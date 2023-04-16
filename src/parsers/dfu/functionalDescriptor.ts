import { DFUFunctionalDescriptor } from "../../types/dfu/functionalDescriptor";

/**
 * Parse a DFU Functional Descriptor from the given `DataView`.
 *
 * Property sizes are taken from the DFU Specification Revision 1.1, 4.1.3, Table 4.2 "DFU Functional Descriptor".
 *
 * @param data The `DataView` object containing the descriptor data
 * @returns a `DFUFunctionalDescriptor` type object containing the parsed data
 */
export const functionalDescriptor = (data: DataView): DFUFunctionalDescriptor => {
	return {
		// bLength: 1 byte
		bLength: data.getUint8(0),

		// bDescriptorType: 1 byte
		bDescriptorType: data.getUint8(1),

		// bmAttributes: 1 byte (bitmask)
		bmAttributes: data.getUint8(2),

		// wDetachTimeOut: 2 bytes (USB is little-endian)
		wDetachTimeOut: data.getUint16(3, true),

		// wTransferSize: 2 bytes (USB is little-endian)
		wTransferSize: data.getUint16(5, true),

		// bcdDFUVersion: 2 bytes (USB is little-endian)
		bcdDFUVersion: data.getUint16(7, true),
	};
};
