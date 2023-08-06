import { USBRequestCode } from "../../protocol/usb/requestCodes";
import { USBConfigurationDescriptor } from "../../types/usb/configurationDescriptor";

export const getConfigurationDescriptor = async (
	device: USBDevice,
	index: number
): Promise<USBConfigurationDescriptor> => {
	const DT_CONFIGURATION = 0x02;
	const wValue = (DT_CONFIGURATION << 8) | index;

	const setup: USBControlTransferParameters = {
		requestType: "standard",
		recipient: "device",
		request: USBRequestCode.GET_DESCRIPTOR,
		value: wValue,
		index: 0,
	};

	// Get the first four bytes of the descriptor containing the configuration descriptor size.
	const sizeRes = await device.controlTransferIn(setup, 4);

	// Ensure that the operation completed successfully.
	if (!sizeRes.data || sizeRes.status !== "ok") {
		throw new Error("controlTransferInError.");
	}

	// Get the length from the data property. (a DataView object)
	// byte 0: uint8 - bLength (base usb descriptor property)
	// byte 1: uint8 - bDescriptorType (base usb descriptor property)
	// byte 2: uint16 - wTotalLength (configuration descriptor property)
	const wTotalLength = sizeRes.data.getUint16(2, true); // usb is little-endian

	// Now that we have the size of the entire configuration descriptor,
	// Send another controlTranferIn request with the exact size we need.
	const descriptor = await device.controlTransferIn(setup, wTotalLength);

	// Ensure that the operation completed successfully.
	if (!descriptor.data || descriptor.status !== "ok") {
		throw new Error("controlTransferInError.");
	}

	// We have recieved the descriptor correctly!

	// Parse the configuration descriptor
	const parsedData = new USBConfigurationDescriptor(descriptor.data);

	// Return the parsed descriptor.
	return parsedData;
};
