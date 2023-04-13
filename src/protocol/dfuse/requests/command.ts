/**
 * These commands are defined for both DfuSe upload (4.2) and DfuSe download (5).
 * "USB DFU protocol used in the STM32 bootloader" AN3156, Rev 14.
 *
 * Enum member names are derived from the specification, with the exception of ERASE_SECTOR, which was already named as such.
 */
export enum DfuSeRequestCommand {
	GET_COMMAND = 0x00,
	SET_ADDRESS_PTR = 0x21,
	// Previous code calls this ERASE_SECTOR but I cannot find any mention of sectors in the spec.
	// In 5.3 there are mentions of pages, however.
	ERASE_SECTOR = 0x41,
	// This command is not used by our code but is included for completeness.
	READ_UNPROTECT = 0x92,
}
