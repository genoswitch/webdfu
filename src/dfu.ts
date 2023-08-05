import TypedEmitter from "typed-emitter";
import { EventEmitter } from "events";

import { ReadEvents, WriteEvents } from "./events";
import { DFUClassSpecificRequest } from "./protocol/dfu/requests/classSpecificRequest";
import { BlockNumber } from "./protocol/dfu/transfer/block";
import { DFUDeviceState } from "./protocol/dfu/transfer/deviceState";
import { DFUVersion } from "./protocol/version";
import { DFUFunctionalDescriptor } from "./types/dfu/functionalDescriptor";
import { DFUStatusResponse } from "./types/dfu/statusResponse";
import { delay } from "./util/delay";
import { DFUDeviceStatus } from "./protocol/dfu/transfer/deviceStatus";
import { DFUFunctionalDescriptorAttribute } from "./protocol/dfu/functionalDescriptorAttribute";
import { WebDFUError } from "./error";
import { DFUModeInterfaceDescriptor } from "./types/dfu/modeInterfaceDescriptor";
import { USBConfigurationDescriptor } from "./types/usb";
import { ensureError } from "./util/ensureError";
import { DFUStateResponse } from "./types/dfu/stateResponse";

export class DFUDevice {
	private readonly device: USBDevice;
	private readonly interface: USBInterface;
	private readonly functionalDescriptor: DFUFunctionalDescriptor;
	private readonly configurationDescriptor: USBConfigurationDescriptor;
	private readonly interfaceDescriptor: DFUModeInterfaceDescriptor;

	constructor(
		device: USBDevice,
		iface: USBInterface,
		functionalDescriptor: DFUFunctionalDescriptor,
		configurationDescriptor: USBConfigurationDescriptor,
		interfaceDescriptor: DFUModeInterfaceDescriptor
	) {
		this.device = device;
		this.interface = iface;
		this.functionalDescriptor = functionalDescriptor;
		this.configurationDescriptor = configurationDescriptor;
		this.interfaceDescriptor = interfaceDescriptor;

		console.log("(DFUDevice) constructor.");
	}

	async close(): Promise<void> {
		await this.device.releaseInterface(this.interface.interfaceNumber);
		await this.device.close();
	}

	get type(): DFUVersion {
		if (
			this.functionalDescriptor.bcdDFUVersion == DFUVersion.DfuSe &&
			this.interface.alternate.interfaceProtocol == 0x02
		) {
			return DFUVersion.DfuSe;
		} else if (this.functionalDescriptor.bcdDFUVersion == DFUVersion.DFU_1_1) {
			// 0x0110
			return DFUVersion.DFU_1_1;
		} else if (this.functionalDescriptor.bcdDFUVersion == DFUVersion.DFU_1_1_ALT) {
			// 0x0101
			return DFUVersion.DFU_1_1_ALT;
		}

		// Fallback to DFU 1.0
		return DFUVersion.DFU_1_0;
	}

	get attributes(): typeof DFUFunctionalDescriptorAttribute {
		return this.functionalDescriptor.attributes;
	}

	get transferSize(): number {
		return this.functionalDescriptor.wTransferSize;
	}

	/**
	 * The target memory segement is specified in the {@link DFUModeInterfaceDescriptor | DFU interface descriptor's} {@link DFUModeInterfaceDescriptor.bAlternateSetting | bAlternateSetting} field.
	 */
	get memorySegment(): number {
		return this.interfaceDescriptor.bAlternateSetting;
	}

	//#region USB Transfer helper functions.

	/**
	 * Transmit specified data to the specified **interface** of the connected USB device..
	 *
	 * @param bRequest A vendor-specific command
	 * @param data A {@link BufferSource} conntaining the data to send to the device
	 * @param wValue Venddor-specific request paramaters
	 * @returns A {@link Promise} that resolves to a {@link USBOutTransferResult}
	 */
	private async requestOut(
		bRequest: number | DFUClassSpecificRequest,
		data?: BufferSource,
		wValue = 0
	): Promise<USBOutTransferResult> {
		const result = await this.device
			.controlTransferOut(
				{
					requestType: "class",
					recipient: "interface",
					request: bRequest,
					value: wValue,
					index: this.interface.interfaceNumber,
				},
				data
			)
			.catch(err => {
				return Promise.reject(`ControlTransferOut failed: ${err}`);
			});

		if (result.status !== "ok") {
			return Promise.reject(`Unexpected ControlTransferOut status ${result.status}`);
		}

		// Request completed successfully
		return result;
	}

	/**
	 * Request a transfer from the USB device to the USB host.
	 *
	 * (aka. Recieve a buffer of a provided length from the USB device)
	 *
	 * @param bRequest A vendor-specific command
	 * @param wLength The maximum number of bytes to read from the device
	 * @param wValue Vendor-specific request paramaters
	 * @returns A {@link Promise} that resolves to a {@link USBInTransferResult}
	 */
	private async requestIn(
		bRequest: number | DFUClassSpecificRequest,
		wLength: number,
		wValue = 0
	): Promise<USBInTransferResult> {
		const result = await this.device
			.controlTransferIn(
				{
					requestType: "class",
					recipient: "interface",
					request: bRequest,
					value: wValue,
					index: this.interface.interfaceNumber,
				},
				wLength
			)
			.catch(err => {
				return Promise.reject(`ControlTransferIn failed: ${err}`);
			});

		if (result.status !== "ok") {
			return Promise.reject(`Unexpected ControlTransferIn status ${result.status}`);
		}

		// Request completed successfully
		return result;
	}

	//#endregion

	/**
	 * Download a {@link ArrayBuffer} to the USB device.
	 *
	 * @param data An {@link ArrayBuffer} containing the data to be transmitted
	 * @param blockNum The block number.
	 * @returns A {@link Promise} that resolves to a {@link USBOutTransferResult}
	 */
	private download(data: ArrayBuffer, blockNum: BlockNumber) {
		return this.requestOut(DFUClassSpecificRequest.DFU_DNLOAD, data, blockNum);
	}

	/**
	 * Upload a specified block from the USB device to the USB host (us).
	 *
	 * @param length The maximum number of bytes to read from the USB device
	 * @param blockNum The block number to request
	 * @returns A {@link Promise} that resolves to {@link USBInTransferResult} which contains the data.
	 */
	private upload(length: number, blockNum: BlockNumber) {
		return this.requestIn(DFUClassSpecificRequest.DFU_UPLOAD, length, blockNum);
	}

	/**
	 * Request the device to exit from it's current state and return to the {@link DFUDeviceState.dfuIDLE | DFU_IDLE} state
	 */
	// TODO: Spec: "The device sets the OK status on receipt of this request."
	//		 Check for OK dfu status after request is sent.
	private async abortToIdle() {
		// Send abort request
		await this.requestOut(DFUClassSpecificRequest.DFU_ABORT);

		let state = await this.getState();
		if (state.bState == DFUDeviceState.dfuERROR) {
			await this.clearState();
			state = await this.getState();
		}
		if (state.bState != DFUDeviceState.dfuIDLE) {
			throw new WebDFUError(
				`Device failed to return to idle state after abort. Current state: ${state.bState}`
			);
		}
	}

	/**
	 * Send a {@link DFUClassSpecificRequest.DFU_GETSTATUS | DFU_GETSTATUS} request to the device.
	 *
	 * @returns A {@link Promise} that resolves to a {@link DFUStatusResponse} containing the response payload
	 */
	async getStatus(): Promise<DFUStatusResponse> {
		// wLength: 6
		const result = await this.requestIn(DFUClassSpecificRequest.DFU_GETSTATUS, 6).catch(err => {
			return Promise.reject(`DFU_GETSTATUS failed: ${err}`);
		});

		if (!result.data) {
			return Promise.reject("DFU_GETSTATUS returned a USBTransferInResult with no data.");
		}

		// We have checked for result.data so TS no longer views it as optional.
		return new DFUStatusResponse(result.data);
	}

	/**
	 * Request the device to exit from the
	 * {@link DFUDeviceState.dfuERROR | DFU_ERROR} state and transition to the
	 * {@link DFUDeviceState.dfuIDLE | DFU_IDLE} state.
	 *
	 * This request returns no data.
	 *
	 * @returns A {@link Promise} that resolves to the {@link USBOutTransferResult} for this request.
	 */
	// TODO: Spec: "The device sets the OK status on receipt of this request."
	//		 Check for OK dfu status after request is sent.
	clearState(): Promise<USBOutTransferResult> {
		return this.requestOut(DFUClassSpecificRequest.DFU_CLRSTATUS);
	}

	/**
	 * Request information about the current state of the device.
	 *
	 * @remarks
	 *
	 * The state reported/returned is the current state of the device.
	 * There is no change in state upon transmission of the response.
	 *
	 * @returns A {@link Promise} that resolves to a {@link DFUStateResponse} object containing the current state.
	 */
	async getState(): Promise<DFUStateResponse> {
		const result = await this.requestIn(DFUClassSpecificRequest.DFU_GETSTATE, 1).catch(err => {
			return Promise.reject(`DFU_GETSTATE failed: ${err}`);
		});
		if (!result.data) {
			return Promise.reject("DFU_GETSTATE returned a USBTransferInResult with no data.");
		}

		// We have checked for result.data so TS no longer views it as optional.
		return new DFUStateResponse(result.data);
	}

	/**
	 * Continuously poll the USB device until the device state matches that of the predicate.
	 *
	 * Eg. After a download request, poll until device is IDLE (finished processing)
	 *
	 * @param statePredicate A predicate that returns true when the state is what is required
	 * @returns A {@link Promise} that resolves to a {@link DFUStatusResponse} when the predicate is true.
	 */
	private async pollUntil(statePredicate: (state: DFUDeviceState) => boolean) {
		let dfuStatus = await this.getStatus();

		while (!statePredicate(dfuStatus.bState) && dfuStatus.bState != DFUDeviceState.dfuERROR) {
			await delay(dfuStatus.bwPollTimeout);
			dfuStatus = await this.getStatus();
		}

		return dfuStatus;
	}

	beginWrite(data: ArrayBuffer): TypedEmitter<WriteEvents> {
		const emitter = new EventEmitter() as TypedEmitter<WriteEvents>;

		emitter.emit("init");

		// Call doWrite (without awaiting)
		this.doWrite(emitter, data)
			.then(() => {
				// When the doWrite promise resolves (completes), emit the end event.
				console.log("doWrite finished successfully, emitting 'end'...");
				emitter.emit("end");
			})
			.catch((err: unknown) => {
				// When the doWrite promise is rejected (errors), emit the error event.
				console.log(`doWrite encountered error: ${err}`);
				emitter.emit("error", err);
			});

		// This allows us to return the emitter while the function is still running
		return emitter;
	}

	beginRead(firstBlock = 0, maxSize = Infinity): TypedEmitter<ReadEvents> {
		const emitter = new EventEmitter() as TypedEmitter<ReadEvents>;

		emitter.emit("init");

		this.doRead(emitter, firstBlock, maxSize)
			.then(() => {
				// when the doRead promise resolves (completes), emit the end event.
				console.log("doRead finished successfully, emitting 'end'...");
				emitter.emit("end");
			})
			.catch((err: unknown) => {
				// When the doRead promise is rejected (errors), emit the error event.
				console.log(`doRead encountered error: ${err}`);
				emitter.emit("error", "err");
			});

		// This allows us to return the emitter while the function is still running
		return emitter;
	}

	private async doWrite(process: TypedEmitter<WriteEvents>, data: ArrayBuffer): Promise<void> {
		let bytesSent = 0;
		const expectedSize = data.byteLength;
		let transactionNumber = 0;

		// Alias function to emit a progress event
		const sendProgress = () => process.emit("write/progress", bytesSent, expectedSize);

		// Emit the start event
		process.emit("write/start");

		while (bytesSent < expectedSize) {
			// Determine how many bytes still need to be sent.
			const bytesLeft = expectedSize - bytesSent;

			// Set the chunk size to `bytesLeft` or the device transfer size,
			// whatever is smaller (Math.min)
			const chunkSize = Math.min(bytesLeft, this.transferSize);

			// Slice the (complete) data ArrayBuffer to a smaller buffer
			// containing the data to be sent this chunk.
			const chunkData = data.slice(bytesSent, bytesSent + chunkSize);

			// Attempt to write.

			// transferResult.status is checked by this.download -> this.requestOut
			// The amount of bytes written is at transferResult.bytesWritten

			// We increment transactionNumber in the download call.
			// This will increment after use, so there will still be a transaction 0.
			const transferResult = await this.download(chunkData, transactionNumber++).catch(err => {
				throw new WebDFUError(`Error during DFU download operation: ${err}`);
			});

			// Wait until the device re-enters the download idle state
			// (Meaning it has finished processing this transaction/block)
			const dfuStatus = await this.pollUntil(state => state == DFUDeviceState.dfuDNLOAD_IDLE);

			// Check that the DFU status is okay.
			if (dfuStatus?.bStatus != DFUDeviceStatus.OK) {
				throw new WebDFUError(
					`DFU Download failed with state=${dfuStatus?.bState}, status=${dfuStatus?.bStatus}`
				);
			}

			// Increment bytesSent (function defined) by
			// transferResult.bytesWritten(while loop iteration defined)
			bytesSent += transferResult.bytesWritten;

			// Transaction sent! Send a progress event
			sendProgress();
		}

		// All chunks sent!

		// (Inherited from old code)
		// Send a download request with a buffer of length 0
		await this.download(new ArrayBuffer(0), transactionNumber++).catch(err => {
			throw new WebDFUError(`Error during final (zero-byte) DFU download: ${err}`);
		});

		// Finished writing!
		// NEXT: Send end event, handle reset/manifestationTolerance.

		// Emit the start event
		process.emit("write/finish", bytesSent);

		// Manifestation time

		if (
			this.functionalDescriptor.isSupported(DFUFunctionalDescriptorAttribute.MANIFESTATION_TOLERANT)
		) {
			// (Inherited from old code)
			// Transition to `MANIFEST_SYNC` state

			// Wait until the device returns to IDLE
			// If the device is not really manifestation tolerant, it may transition to MANIFEST_WAIT_RESET instead.
			const dfuStatus = await this.pollUntil(
				state => state == DFUDeviceState.dfuIDLE || state == DFUDeviceState.dfuMANIFEST_WAIT_RESET
			);

			// (Inherited comment)
			// if dfu_status.state == DFUDeviceState.dfuMANIFEST_WAIT_RESET
			// => Device transitioned to MANIFEST_WAIT_RESET even though it is manifestation tolerant

			// Check the DFU device status
			if (dfuStatus?.bStatus != DFUDeviceStatus.OK) {
				throw new WebDFUError(
					`DFU Manifest failed state=${dfuStatus.bState}, status=${dfuStatus.bStatus}`
				);
			}

			// Old code had pollUntil in a catch which had the following code.
			// This code is ported across in a comment for future reference.
			// TODO: Check that these catches still exist / are handled somewhere.
			/**
			 * } catch (error) {
				if (
					error.endsWith("ControlTransferIn failed: NotFoundError: Device unavailable.") ||
					error.endsWith("ControlTransferIn failed: NotFoundError: The device was disconnected.")
				) {
					this.log.warning("Unable to poll final manifestation status");
				} else {
					throw new WebDFUError("Error during DFU manifest: " + error);
				}
			}
			 */
		} else {
			// Device reports that it is NOT manifestation tolerant

			// (Inherited) Try polling once to initiate manifestation
			await this.getStatus().catch(() => null);
			// TODO: Following code suggests the devie state would possibly be MANIFEST_WAIT_RESET here?
			// (Inherited code does not use the returned value, only catches it to escape the error.)
		}

		// Reset to exit MANIFEST_WAIT_RESET
		await this.device.reset().catch((err: Error) => {
			if (
				ensureError(
					err,
					"NetworkError",
					"Failed to execute 'reset' on 'USBDevice': Unable to reset the device."
				) ||
				// NOTE: I have not been able to get these two errors to appear.
				// They have been retained/inherited from the previous (upstream) version of this project
				ensureError(err, "NotFoundError", "Device unavailable.") ||
				ensureError(err, "NotFoundError", "The device was disconnected.")
			) {
				// (Inherited): Ignore reset error
				console.log("device.reset() encounted a reset error but was expected.");
			} else {
				// Other error, reject the promise.
				throw new WebDFUError(`Error during reset of manifestation: ${err}`);
			}
		});
	}

	private async doRead(
		process: TypedEmitter<ReadEvents>,
		firstBlock: number,
		// eslint-disable-next-line @typescript-eslint/no-inferrable-types
		maxSize: number = Infinity
	) {
		const blocks: USBInTransferResult[] = [];

		let bytesRead = 0;
		let transactionNumber = firstBlock;

		// Emit the start event
		process.emit("read/start");

		let result: USBInTransferResult;
		let bytesToRead;
		do {
			bytesToRead = Math.min(this.transferSize, maxSize - bytesRead);

			result = await this.upload(bytesToRead, transactionNumber++);

			if (result.data?.byteLength) {
				if (result.data?.byteLength > 0 && result.status == "ok") {
					blocks.push(result);
					bytesRead += result.data?.byteLength;
				}

				process.emit("read/progress", bytesRead, result);
			} else {
				// error: byteLength not set
			}
		} while (bytesRead < maxSize && result.data?.byteLength == bytesToRead);

		if (bytesRead == maxSize) {
			await this.abortToIdle();
		}

		// Convert the array of USBInTransferResult(s) to an array of binary data.
		const binaryBlocks: DataView[] = [];
		blocks.forEach(block => {
			if (block.data) {
				binaryBlocks.push(block.data);
			}
		});

		// Return the data as a blob.
		const blob = new Blob(binaryBlocks, { type: "application/octet-stream" });

		process.emit("read/finish", bytesRead, blocks, blob);
	}
}
