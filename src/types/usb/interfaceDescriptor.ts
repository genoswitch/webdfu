import { WebDFUInterfaceSubDescriptor } from "../../core";
import { USBDescriptor } from "./descriptor";

/**
 * USB Interface Descriptor
 *
 * @remarks
 *
 * The USB Interface Descriptor is defined in the USB Specification Revision 2.0, Section 9.6.5 'Interface'.
 *
 * Property sizes are taken from the USB Specification Revision 2, Section 9.6.5, Table 9-12. "Standard Interface Descriptor".
 *
 * Properties are annotated based on their respective descriptions from Table 9-12 in the same section.
 */
export class USBInterfaceDescriptor extends USBDescriptor {
	/**
	 * The number of this interface.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 2
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * Zero-based value identifying the index in the array of concurrent interfaces
	 * supported by this configuration.
	 */
	readonly bInterfaceNumber: number;

	/**
	 * Alternate setting for this interface.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 3
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * Value used to select an alternate setting for the interface specified in `bInterfaceNumber`.
	 */
	readonly bAlternateSetting: number;

	/**
	 * Number of endpoints used by this interface (excluding endpoint zero).
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 4
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * If this value is zero, this interface only uses the Default Control Pipe.
	 */
	readonly bNumEndpoints: number;

	/**
	 * Class code (assigned by the USB-IF).
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 5
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * The USB Class Codes are defined [here.](https://www.usb.org/defined-class-codes).
	 *
	 * `0xEF` is Miscellaneous (including DFU).
	 * `0xFE` is Application-specific
	 * `0xFF` is Vendor-specific
	 */
	readonly bInterfaceClass: number;

	/**
	 * Subclass code (assigned by the USB-IF).
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 6
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * These codes are qualified by the value of the `bDeviceClass` field.
	 *
	 * If the `bDeviceClass` field is reset to zero, this field must also be reset to zero.
	 *
	 * If the bDeviceClass field is not set to FFH, all values are reserved for assignment by the USB-IF.
	 */
	readonly bInterfaceSubClass: number;

	/**
	 * Protocol code (assigned by the USB-IF)
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 7
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * These codes are qualified by the value of the `bInterfaceClass` and the
	 * `bInterfaceSubClass` fields. If an interface supports class-specific protocols
	 * on a device basis as opposed to an interface basis, this code identifies
	 * the protocols that the device uses as defined by the specification of the
	 * device class.
	 *
	 * If this field is reset to zero, the device does not use a class-specific
	 * protocol on this interface.
	 *
	 * If this field is set to FFH, the device uses a vendor-specific protocol
	 * on this interface.
	 */
	readonly bInterfaceProtocol: number;

	/**
	 * Index of string descriptor describing this interface.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 8
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * Similar to `iProduct` in the USB device descriptor.
	 */
	readonly iInterface: number;

	// The existing webDFU code has these descriptor objects.
	// This behaviour may be changed in the future but for now it will be ported across.
	descriptors: (USBDescriptor | WebDFUInterfaceSubDescriptor)[];

	/**
	 * Parse a USB Interface Descriptor from the given `DataView`.
	 *
	 * @param data The `DataView` object containing the descriptor data
	 */
	constructor(data: DataView) {
		super(data);

		// bLength and bDescriptorType are set by the parent class.

		this.bInterfaceNumber = this.data.getUint8(2);
		this.bAlternateSetting = this.data.getUint8(3);
		this.bNumEndpoints = this.data.getUint8(4);
		this.bInterfaceClass = this.data.getUint8(5);
		this.bInterfaceSubClass = this.data.getUint8(6);
		this.bInterfaceProtocol = this.data.getUint8(7);
		this.iInterface = this.data.getUint8(8);

		// Initialize the `descriptors` variable as an empty array.
		this.descriptors = [];
	}
}
