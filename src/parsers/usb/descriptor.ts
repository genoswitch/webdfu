import { USBDescriptor } from "../../types/usb/descriptor";

/**
 * Parse a USB (Base) Descriptor from the given `DataView`.
 *
 * This parser will slice the DataView to only contain data from the same descriptor,
 * using the `bLength` variable. This DataView object is available under the `data` property.
 *
 *
 * Property sizes are taken from the USB Specification Revision 2, Section 9.6.1, Table 9-8. "Standard Device Descriptor".
 *
 * @param data The `DataView` object containing the descriptor data
 * @returns a `USBDescriptor` type object containing the parsed data
 */
export const descriptor = (data: DataView): USBDescriptor => {
	// In this parser we get data outside of the return as the data value depends on bLength.

	// bLength: 1 byte
	const bLength = data.getUint8(0);

	// bDescriptorType: 1 byte
	const bDescriptorType = data.getUint8(1);

	// Construct a DataView object with a subset of the data property corresponding to the descriptor size.
	// This means that when this function is called with multiple descriptors, only the 'current' descriptor data is returned.
	const currentDescriptorData = new DataView(data.buffer.slice(0, bLength));

	return {
		bLength,
		bDescriptorType,
		data: currentDescriptorData,
	};
};
