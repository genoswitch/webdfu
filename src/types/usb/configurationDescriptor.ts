import { WebDFUInterfaceSubDescriptor } from "../../core";
import { subDescriptor } from "../../parsers/usb/subDescriptor";
import { USBDescriptor } from "./descriptor";

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
		this.descriptors = subDescriptor(this.overflowData);
	}
}
