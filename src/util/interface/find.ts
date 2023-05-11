import { InterfaceFilterPredicate } from "./filters";

// Find an interface, assumming the device is already available
export const findInterface = (
	device: USBDevice,
	predicate: InterfaceFilterPredicate
): USBInterface => {
	if (!device.configuration) {
		throw new Error("Device configuration not available.");
	}

	const interfaces = device.configuration.interfaces;

	const matches = interfaces.filter(predicate);

	if (matches.length == 1) {
		// TypeScript shows USBInterface[] indicies as USBInterface | undefined.
		return matches[0] as USBInterface;
	}

	if (matches.length == 0) {
		throw new Error("No matches found. Is this a DFU device?");
	}

	// Unexpected number of matches found
	throw new Error("Unexpected number of matches found.");
};
