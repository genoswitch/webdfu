// Import DFUClassSpecificRequest for typedoc IntelliSense
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// @ts-ignore: Imported for IntelliSense only
import { DFUClassSpecificRequest } from "../../protocol/dfu/requests/classSpecificRequest";

import { DFUDeviceStatus } from "../../protocol/dfu/transfer/deviceStatus";

/**
 * {@link DFUClassSpecificRequest.DFU_GETSTATUS | DFU_GETSTATUS} response payload.
 *
 * @remarks
 * This response is defined in the DFU Specification Revision 1.1,
 * Section 6.1.2 "DFU_GETSTATUS Request", Table 2 (unnamed).
 */
export class DFUStatusResponse {
	/**
	 * An indication of the status resulting from the execution of the most
	 * recent request.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 0
	 * @fieldByteType Uint8
	 */
	readonly bStatus: DFUDeviceStatus;

	/**
	 * Minimum time, in milliseconds, that the host should wait before sending
	 * a subsequent {@link DFUClassSpecificRequest.DFU_GETSTATUS | DFU_GETSTATUS} request.
	 *
	 * @fieldByteSize 3
	 * @fieldByteIndex 1
	 * @fieldByteType Uint32 (little-endian)
	 *
	 * @remarks
	 * The purpose of this field is to allow the device to dynamically adjust
	 * the amount of time that the device expects the host to wait between the
	 * status phase of the next {@link DFUClassSpecificRequest.DFU_DNLOAD | DFU_DNLOAD} and the subsequent solicitation of
	 * the device’s status via {@link DFUClassSpecificRequest.DFU_GETSTATUS | DFU_GETSTATUS}. This permits the device to vary
	 * the delay depending on its need to erase memory, program the memory, etc.
	 *
	 */
	readonly bwPollTimeout: number;

	/**
	 * An indication of the state that the device is going to enter immediately
	 * following transmission of this response.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 4
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * By the time the host receives this information, this is the current
	 * state of the device.
	 */
	readonly bState: number;

	/**
	 * Index of status description in string table.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 5
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * The iString field is used to reference a string describing the
	 * corresponding status. The device can make these strings available to
	 * the host by means of the GET_DESCRIPTOR (STRING) standard request.
	 * However, the host may reference its own string table instead.
	 */
	readonly iString: number;

	constructor(data: DataView) {
		this.bStatus = data.getUint8(0);

		// Upstream/previous code does a bitwise AND with 0xffffff, ported across
		this.bwPollTimeout = data.getUint32(1, true) & 0xffffff;

		this.bState = data.getUint8(4);

		this.iString = data.getUint8(5);
	}
}
