import { USBDescriptorType } from "../../protocol/usb/descriptorTypes";
import { USBDescriptor } from "../../types/usb/descriptor";
import { functionalDescriptor } from "../dfu/functionalDescriptor";
import { descriptor } from "./descriptor";
import { interfaceDescriptor } from "./interfaceDescriptor";

const USB_CLASS_APP_SPECIFIC = 0xfe;
const USB_SUBCLASS_DFU = 0x01;

/**
 * Parse "sub"-descriptors from a given DataView object.
 *
 * Some descriptors contain "sub-descriptors", that it to say,
 * return multiple descriptors in one request.
 *
 * An example of a descriptor that does this would be a configuration descriptor.
 *
 * @param data The `DataView` object containing data for multiple descriptors
 * @returns an array of objects with a parent of `USBDescriptor` corresponding to the parsed descriptors.
 */
export const subDescriptor = (data: DataView): USBDescriptor[] => {
	// Some descriptors contain "sub-descriptors", that it to say,
	// return multiple descriptors in one request.

	// Create a DataView object to store data we have not yet parsed
	// Setting it's inital value to the data paramater.
	let remainingData: DataView = data;

	// Create an array to store descriptors we have parsed.
	const descriptors: USBDescriptor[] = [];

	// Create a bool to keep track if we are currently parsing the DFU interface.
	let inDfuInterface = false;

	// Define ifaceDescriptor here as it is used by both interface and dfu functional handlers
	// If we define the type here we get an error (used before being assigned) when using this
	// in the dfu funcional handler
	let ifaceDescriptor;

	// Loop until remainingData has less than 2 bytes left
	// (at which point everything should have been parsed)
	while (remainingData.byteLength > 2) {
		// Parse the current descriptor as a "generic" descriptor (length, type, data).
		// This contains a DataView object with the bytes for THIS descriptor only.
		const currentDescriptor = descriptor(remainingData);

		// Take different actions depending on descriptor type
		if (currentDescriptor.bDescriptorType == USBDescriptorType.INTERFACE) {
			//#region handle type: interface

			// (re-)parse the descriptor as an interface descriptor.
			// data is a optional property, but will have a value in this scenario.
			// Therefore, let's cast it to avoid having to use ! (non null assertation)
			ifaceDescriptor = interfaceDescriptor(currentDescriptor.data as DataView);

			// Set the inDfuInterface property if this interface is a DFU interface.
			if (
				ifaceDescriptor.bInterfaceClass == USB_CLASS_APP_SPECIFIC &&
				ifaceDescriptor.bInterfaceSubClass == USB_SUBCLASS_DFU
			) {
				inDfuInterface = true;
			} else {
				inDfuInterface = false;
			}

			// Push the descriptor to the descriptor array.
			descriptors.push(ifaceDescriptor);

			//#endregion
		} else if (
			inDfuInterface &&
			currentDescriptor.bDescriptorType == USBDescriptorType.DFU_FUNCTIONAL
		) {
			//#region handle type: dfu functional interface

			// (re-)parse the descriptor as an dfu functional descriptor.
			// data is a optional property, but will have a value in this scenario.
			// Therefore, let's cast it to avoid having to use ! (non null assertation)
			const dfuFuncDescriptor = functionalDescriptor(currentDescriptor.data as DataView);

			// Push the descriptor to the descriptor array.
			descriptors.push(dfuFuncDescriptor);

			// If the interfaceDescriptor is set (should be), add this descriptor to the 'child' descriptor of that obj.
			ifaceDescriptor?.descriptors.push(dfuFuncDescriptor);

			//#endregion
		} else {
			//#region handle type: generic descriptor

			// Push the descriptor to the descriptor array.
			descriptors.push(currentDescriptor);

			// If the interfaceDescriptor is set (should be), add this descriptor to the 'child' descriptor of that obj.
			ifaceDescriptor?.descriptors.push(currentDescriptor);

			//#endregion
		}

		// Set remainingData to a sliced copy starting at the end of the current descriptor.
		// This effecively removes the current descriptor from the buffer.
		remainingData = new DataView(remainingData.buffer.slice(currentDescriptor.bLength));
	}

	// Loop done! Return the list of descriptors.
	return descriptors;
};
