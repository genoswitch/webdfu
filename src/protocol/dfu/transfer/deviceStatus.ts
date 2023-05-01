// Import DFUClassSpecificRequest for typedoc IntelliSense (line 60)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DFUClassSpecificRequest } from "../requests/classSpecificRequest";

/**
 * DFU Device status.
 *
 * Defined in the DFU Specification, Revision 1.1, Section 6.1.2, page 21, (unnamed table).
 *
 * Enum member names and annotations are taken from this table in the specification.
 */
export enum DFUDeviceStatus {
	/**
	 * No error condition is present.
	 */
	OK = 0,

	/**
	 * File is not targeted for use by this device.
	 */
	errTARGET = 1,

	/**
	 * File is for this device but fails some vendor-specific
	 * verification test.
	 */
	errFILE = 2,

	/**
	 * Device is unable to write memory.
	 */
	errWRITE = 3,

	/**
	 * Memory erase function failed.
	 */
	errERASE = 4,

	/**
	 * Memory erase check failed.
	 */
	errCHECK_ERASED = 5,

	/**
	 * Program memory function failed.
	 */
	errPROG = 6,

	/**
	 * Programmed memory failed verification.
	 */
	errVERIFY = 7,

	/**
	 * Cannot program memory due to received address that is out of range.
	 */
	errADDRESS = 8,

	/**
	 * Received DFU_DNLOAD (see {@link DFUClassSpecificRequest.DFU_DNLOAD}) with wLength = 0, but device does not think it has all of the data yet.
	 */
	errNOTDONE = 9,

	/**
	 * Device’s firmware is corrupt. It cannot return to run-time (non-DFU) operations.
	 */
	errFIRMWARE = 10,

	/**
	 * iString indicates a vendor-specific error.
	 */
	errVENDOR = 11,

	/**
	 * Device detected unexpected USB reset signaling.
	 */
	errUSBR = 12,

	/**
	 * Device detected unexpected power on reset.
	 */
	errPOR = 13,

	/**
	 * Something went wrong, but the device does not know what it was.
	 */
	errUNKNOWN = 14,

	/**
	 * Device stalled an unexpected request.
	 */
	errSTALLEDPKT = 15,
}
