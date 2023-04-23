import { USBInterfaceDescriptor } from "../../types/usb/interfaceDescriptor";

/**
 * Parse a USB Interface Descriptor from the given `DataView`.
 *
 * Property sizes are taken from the USB Specification Revision 2, Section 9.6.5, Table 9-12. "Standard Interface Descriptor".
 *
 * @param data The `DataView` object containing the descriptor data
 * @returns a `USBInterfaceDescriptor` type object containing the parsed data
 */
export const interfaceDescriptor = (data: DataView): USBInterfaceDescriptor => {
	return {
		// bLength: 1 byte
		bLength: data.getUint8(0),

		// bDescriptorType: 1 byte
		bDescriptorType: data.getUint8(1),

		// bInterfaceNumber: 1 byte
		bInterfaceNumber: data.getUint8(2),

		// bAlternateSetting: 1 byte
		bAlternateSetting: data.getUint8(3),

		// bNumEndpoints: 1 byte
		bNumEndpoints: data.getUint8(4),

		// bInterfaceClass: 1 byte
		bInterfaceClass: data.getUint8(5),

		// bInterfaceSubClass: 1 byte
		bInterfaceSubClass: data.getUint8(6),

		// bInterfaceProtocol: 1 byte
		bInterfaceProtocol: data.getUint8(7),

		// iInterface: 1 byte
		iInterface: data.getUint8(8),

		descriptors: [],
	};
};
