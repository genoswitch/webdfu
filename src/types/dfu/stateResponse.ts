import { DFUDeviceState } from "../../protocol/dfu/transfer/deviceState";

/**
 * {@link DFUClassSpecificRequest.DFU_GETSTATE | DFU_GETSTATE} response payload.
 *
 * @remarks
 * This response is defined in the DFU Specification Revision 1.1,
 * Section 6.1.5 "DFU_GETSTATE Request", Table 2 (unnamed).
 */
export class DFUStateResponse {
	/**
	 * Indicates the current state of the device.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 0
	 * @fieldByteType Uint8
	 */
	readonly bState: DFUDeviceState;

	constructor(data: DataView) {
		this.bState = data.getUint8(0);
	}
}
