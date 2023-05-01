import { DFUClassSpecificRequest } from "./protocol/dfu/requests/classSpecificRequest";
import { BlockNumber } from "./protocol/dfu/transfer/block";
import { DFUVersion } from "./protocol/version";
import { DFUFunctionalDescriptor } from "./types/dfu/functionalDescriptor";
import { DFUStatusResponse } from "./types/dfu/statusResponse";

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
}
