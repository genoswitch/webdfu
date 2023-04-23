import { USBConfigurationDescriptor } from "../../types/usb/configurationDescriptor";
import { subDescriptor } from "./subDescriptor";

export const configurationDescriptor = (data: DataView): USBConfigurationDescriptor => {
	// TODO: bLength should == 9.
	// Old code used 9, check if this is accurate.

	// Create a sliced copy of the data buffer starting at the end of the configuration descriptor
	const childDescriptorData = new DataView(data.buffer.slice(9));
	// Parse all descriptors ('sub-descriptors') located after this configuration descriptor
	const descriptors = subDescriptor(childDescriptorData);

	return {
		// bLength: 1 byte
		bLength: data.getUint8(0),

		// bDescriptorType: 1 byte
		bDescriptorType: data.getUint8(1),

		// wTotalLength: 2 bytes (usb is little-endian)
		wTotalLength: data.getUint16(2, true),

		// bNumInterfaces: 1 byte
		bNumInterfaces: data.getUint8(4),

		// bConfigurationValue: 1 byte
		bConfigurationValue: data.getUint8(5),

		// iConfiguration: 1 byte
		iConfiguration: data.getUint8(6),

		// bmAttributes: 1 byte
		bmAttributes: data.getUint8(7),

		// bMaxPower: 1 byte
		bMaxPower: data.getUint8(8),

		descriptors,
	};
};
