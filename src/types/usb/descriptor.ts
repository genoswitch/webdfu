/**
 * USB Descriptor Base interface.
 *
 * This interface contains common properties used in all descriptors. The base interface, if you will.
 *
 * https://www.beyondlogic.org/usbnutshell/usb5.shtml
 */
export interface USBDescriptor {
	/**
	 * **Size of this descriptor in bytes**
	 */
	bLength: number;

	/**
	 *  **Interface Descriptor Type** (const)
	 */
	bDescriptorType: number;

	// Raw data
	data?: DataView;
}
