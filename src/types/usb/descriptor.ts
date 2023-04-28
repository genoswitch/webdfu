import { USBDescriptorType } from "../../protocol/usb/descriptorTypes";

/**
 * USB Descriptor (base class).
 *
 * This interface contains common properties used in all descriptors. The base interface, if you will.
 *
 * @remarks
 *
 * Property sizes are taken from the USB Specification Revision 2, Section 9.6.1, Table 9-8. "Standard Device Descriptor".
 *
 * https://www.beyondlogic.org/usbnutshell/usb5.shtml
 */
export class USBDescriptor {
	/**
	 * Size of this descriptor in bytes.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 0
	 * @fieldByteType Uint8
	 */
	readonly bLength: number;

	/**
	 * The Interface Descriptor Type of this descriptor.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 1
	 * @fieldByteType Uint8
	 */
	readonly bDescriptorType: USBDescriptorType;

	/**
	 * A `DataView` object containing the raw bytes that make up this descriptor.
	 */
	readonly data: DataView;

	/**
	 * Parse a USB (Base) Descriptor from the given `DataView`.
	 *
	 * This constructor will slice the DataView to only contain data from the same descriptor,
	 * using the `bLength` variable. This DataView object is available under the `data` property.
	 *
	 * @param data The `DataView` object containing the descriptor data
	 */
	constructor(data: DataView) {
		this.bLength = data.getUint8(0);
		this.bDescriptorType = data.getUint8(1);

		// Construct a DataView object with a subset of the data property corresponding to the descriptor size.
		// This means that when this function is called with multiple descriptors, only the 'current' descriptor data is returned.
		this.data = new DataView(data.buffer.slice(0, this.bLength));
	}
}
