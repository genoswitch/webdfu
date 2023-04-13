/**
 * DFU Specification, Rev 1.1 - 3; Table 3.2 'DFU Class-Specific Request Values', page 10.
 *
 * Enum member names are derived from the specification.
 */
export enum DFUClassSpecificRequest {
	DFU_DETACH = 0,
	DFU_DNLOAD = 1,
	DFU_UPLOAD = 2,
	DFU_GETSTATUS = 3,
	DFU_CLRSTATUS = 4,
	DFU_GETSTATE = 5,
	DFU_ABORT = 6,
}
