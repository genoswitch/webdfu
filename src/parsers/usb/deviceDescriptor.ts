import { USBDeviceDescriptor } from "../../types/usb/deviceDescriptor";

/**
 * Parse a USB Device Descriptor from the given `DataView`.
 *
 * Property sizes are taken from the USB Specification Revision 2, Section 9.6.1, Table 9-8. "Standard Device Descriptor".
 *
 * @param data The `DataView` object containing the descriptor data
 * @returns a `USBDeviceDescriptor` type object containing the parsed data
 */
export const deviceDescriptor = (data: DataView): USBDeviceDescriptor => {
	return {
		// bLength: 1 byte
		bLength: data.getUint8(0),

		// bDescriptorType: 1 byte
		bDescriptorType: data.getUint8(1),

		// bcdUSB: 2 bytes (USB is little-endian)
		bcdUSB: data.getUint16(2, true),

		// bDeviceClass: 1 byte
		bDeviceClass: data.getUint8(4),

		// bDeviceSubClass: 1 byte
		bDeviceSubClass: data.getUint8(5),

		// bDeviceProtocol: 1 byte
		bDeviceProtocol: data.getUint8(6),

		// bMaxPacketSize0: 1 byte
		bMaxPacketSize0: data.getUint8(7),

		// idVendor: 2 bytes (USB is little-endian)
		idVendor: data.getUint16(8, true),

		// idProduct: 2 bytes (USB is little-endian)
		idProduct: data.getUint16(10, true),

		// bcdDevice: 2 bytes (USB is little-endian)
		bcdDevice: data.getUint16(12, true),

		// iManufacturer: 1 byte
		iManufacturer: data.getUint8(14),

		// iProduct: 1 byte
		iProduct: data.getUint8(15),

		// iSerialNumber: 1 byte
		iSerialNumber: data.getUint8(16),

		// bNumConfigurations: 1 byte
		bNumConfigurations: data.getUint8(17),
	};
};
