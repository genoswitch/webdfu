import TypedEmitter from "typed-emitter";
import { EventEmitter } from "events";

import { WriteEvents } from "./events";
import { DFUClassSpecificRequest } from "./protocol/dfu/requests/classSpecificRequest";
import { BlockNumber } from "./protocol/dfu/transfer/block";
import { DFUDeviceState } from "./protocol/dfu/transfer/deviceState";
import { DFUVersion } from "./protocol/version";
import { DFUFunctionalDescriptor } from "./types/dfu/functionalDescriptor";
import { DFUStatusResponse } from "./types/dfu/statusResponse";
import { delay } from "./util/delay";
import { DFUDeviceStatus } from "./protocol/dfu/transfer/deviceStatus";

export class DFUDevice {
	private readonly device: USBDevice;
	private readonly interface: USBInterface;
	private readonly functionalDescriptor: DFUFunctionalDescriptor;

	constructor(
		device: USBDevice,
		iface: USBInterface,
		functionalDescriptor: DFUFunctionalDescriptor
	) {
		this.device = device;
		this.interface = iface;
		this.functionalDescriptor = functionalDescriptor;

		console.log("(DFUDevice) constructor.");
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

	get transferSize(): number {
		return this.functionalDescriptor.wTransferSize;
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

		// do_read

		return emitter;
	}

	private async doWrite(process: TypedEmitter<WriteEvents>, data: ArrayBuffer): Promise<void> {
		let bytesSent = 0;
		const expectedSize = data.byteLength;
		let transactionNumber = 0;

		// Alias function to emit a progress event
		const sendProgress = () => process.emit("progress", bytesSent, expectedSize);

		// Emit the start event
		process.emit("start");

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
				return Promise.reject(`Error during DFU download operation: ${err}`);
			});

			// Wait until the device re-enters the download idle state
			// (Meaning it has finished processing this transaction/block)
			const dfuStatus = await this.pollUntil(state => state == DFUDeviceState.dfuDNLOAD_IDLE);

			// Check that the DFU status is okay.
			if (dfuStatus?.bStatus != DFUDeviceStatus.OK) {
				return Promise.reject(
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
			return Promise.reject(`Error during final (zero-byte) DFU download: ${err}`);
		});

		// Finished writing!
		// NEXT: Send end event, handle reset/manifestationTolerance.
	}
}
