import { WebDFUInterfaceSubDescriptor } from "../../core";
import { USBDescriptor } from "./descriptor";

/**
 * Standard USB Configuration Descriptor.
 * Defined in the USB Specification Revision 2.0, Section 9.6.3 'Configuration'.
 *
 * Properties are annotated with their respective descriptions from Table 9-10 "Standard Configuration Descriptor" in the same section.
 */
export interface USBConfigurationDescriptor extends USBDescriptor {
	/**
	 * **Total length of data returned for this configuration.**
	 *
	 * Includes the combined length of all descriptors (configuration, interface,
	 * endpoint, and class- or vendor-specific) returned for this configuration.
	 */
	wTotalLength: number;

	/**
	 * **Number of interfaces supported by this configuration**
	 */
	bNumInterfaces: number;

	/**
	 * Value to use as an argument to the SetConfiguration() request to select this configuration
	 */
	bConfigurationValue: number;

	/**
	 * **Index of string descriptor describing this configuration**
	 */
	iConfiguration: number;

	/**
	 * **A bitmask containing configuration characteristics.**
	 *
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
	bmAttributes: number;

	/**
	 * **Maximum power consumption of the USB device from the bus in this specific
	 * configuration when the device is fully operational.**
	 *
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
	bMaxPower: number;

	// The existing webDFU code has these descriptor objects.
	// This behaviour may be changed in the future but for now it will be ported across.
	descriptors: (USBDescriptor | WebDFUInterfaceSubDescriptor)[];
}
