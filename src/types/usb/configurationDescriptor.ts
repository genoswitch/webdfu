import { WebDFUInterfaceSubDescriptor } from "../../core";
import { USBDescriptorType } from "../../protocol/usb/descriptorTypes";
import { DFUFunctionalDescriptor } from "../dfu/functionalDescriptor";
import { USBDescriptor } from "./descriptor";
import { USBInterfaceDescriptor } from "./interfaceDescriptor";

// Variables for the sub descriptor parser function.
// TODO: Move these to an enum at some point, like descriptorTypes.
const USB_CLASS_APP_SPECIFIC = 0xfe;
const USB_SUBCLASS_DFU = 0x01;

/**
 * USB Configuration Descriptor.
 *
 * @remarks
 * The USB Configuration Descriptor is defined in the USB Specification Revision 2.0, Section 9.6.3 'Configuration'.
 *
 * Property sizes and annotations are taken from the USB Specification Revision 2, Section 9.6.3 'Configuration', Table 9-10 "Standard Configuration Descriptor".
 */
export class USBConfigurationDescriptor extends USBDescriptor {
	/**
	 * Total length of data returned for this configuration.
	 *
	 * @fieldByteSize 2
	 * @fieldByteIndex 2
	 * @fieldByteType Uint16 (little-endian)
	 *
	 * @remarks
	 * Includes the combined length of all descriptors (configuration, interface,
	 * endpoint, and class- or vendor-specific) returned for this configuration.
	 */
	readonly wTotalLength: number;

	/**
	 * Number of interfaces supported by this configuration
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 4
	 * @fieldByteType Uint8
	 */
	readonly bNumInterfaces: number;

	/**
	 * Value to use as an argument to the SetConfiguration() request to select this configuration
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 5
	 * @fieldByteType Uint8
	 */
	readonly bConfigurationValue: number;

	/**
	 * Index of string descriptor describing this configuration
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 6
	 * @fieldByteType Uint8
	 */
	readonly iConfiguration: number;

	/**
	 * A bitmask containing configuration characteristics.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 7
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * Bit 7: Reserved (set to one)
	 *
	 * Bit 6: Self-powered
	 * > A device configuration that uses power from the bus and a local source
	 * reports a non-zero value in bMaxPower to indicate the amount of bus power
	 * required and sets D6. The actual power source at runtime may be determined
	 * using the GetStatus(DEVICE) request (see Section 9.4.5).
	 *
	 * Bit 5: Remote wakeup [supported]
	 * > If a device configuration supports remote wakeup, D5 is set to one.
	 *
	 * Bit 4..0: Reserved (reset to zero)
	 */
	readonly bmAttributes: number;

	/**
	 * Maximum power consumption of the USB device from the bus in this specific
	 * configuration when the device is fully operational.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 8
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * Expressed in 2 mA units(i.e., 50 = 100 mA).
	 *
	 * #### Notes
	 * A device configuration reports whether the configuration is bus-powered or self-powered.
	 * Device status reports whether the device is currently self-powered. If a device is
	 * disconnected from its external power source, it updates device status to indicate that
	 * it is no longer self-powered.
	 *
	 * A device may not increase its power draw from the bus, when it loses its external power
	 * source, beyond the amount reported by its configuration.
	 *
	 * If a device can continue to operate when disconnected from its external power source, it
	 * continues to do so. If the device cannot continue to operate, it fails operations it can
	 * no longer support. The USB System Software may determine the cause of the failure by
	 * checking the status and noting the loss of the device’s power source.
	 */
	readonly bMaxPower: number;

	// The existing webDFU code has these descriptor objects.
	// This behaviour may be changed in the future but for now it will be ported across.
	descriptors: (USBDescriptor | WebDFUInterfaceSubDescriptor)[];

	/**
	 * Parse a USB Configuration Descriptor from the given `DataView`, as well as any "sub-descriptors" in the DataView.
	 *
	 * @param data The `DataView` object containing the descriptor data
	 */
	constructor(data: DataView) {
		super(data);
		// bLength and bDescriptorType are set by the parent class.

		this.wTotalLength = this.data.getUint16(2, true);
		this.bNumInterfaces = this.data.getUint8(4);
		this.bConfigurationValue = this.data.getUint8(5);
		this.iConfiguration = this.data.getUint8(6);
		this.bmAttributes = this.data.getUint8(7);
		this.bMaxPower = this.data.getUint8(8);

		// Parse all descriptors ('sub-descriptors') located after this configuration descriptor
		this.descriptors = USBConfigurationDescriptor.parseSubDescriptors(this.overflowData);
	}

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
	private static parseSubDescriptors = (data: DataView): USBDescriptor[] => {
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
			const currentDescriptor = new USBDescriptor(remainingData);

			// Take different actions depending on descriptor type
			if (currentDescriptor.bDescriptorType == USBDescriptorType.INTERFACE) {
				//#region handle type: interface

				// (re-)parse the descriptor as an interface descriptor.
				// data is a optional property, but will have a value in this scenario.
				// Therefore, let's cast it to avoid having to use ! (non null assertation)
				ifaceDescriptor = new USBInterfaceDescriptor(currentDescriptor.data);

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
				const dfuFuncDescriptor = new DFUFunctionalDescriptor(currentDescriptor.data);

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
}
