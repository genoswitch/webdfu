import { WebDFUInterfaceSubDescriptor } from "../../core";
import { DFUFunctionalDescriptor } from "../dfu/functionalDescriptor";

/**
 * USB Interface Descriptor
 * Defined in the USB Specification Revision 2.0, Section 9.6.5 'Interface'
 *
 * Properties are annotated based on their respective descriptions from Table 9-12 in the same section.
 */
export type USBInterfaceDescriptor = {
	/**
	 * ** Size of this descriptor in bytes**
	 */
	bLength: number;

	/**
	 *  **Interface Descriptor Type** (const)
	 */
	bDescriptorType: number;

	/**
	 * **Number of this interface.**
	 *
	 * Zero-based value identifying the index in the array of concurrent interfaces
	 * supported by this configuration.
	 */
	bInterfaceNumber: number;

	/**
	 * **Alternate setting for this interface.**
	 *
	 * Value used to select an alternate setting for the interface specified in `bInterfaceNumber`.
	 */
	bAlternateSetting: number;

	/**
	 * **Number of endpoints used by this interface (excluding endpoint zero).**
	 *
	 * If this value is zero, this interface only uses the Default Control Pipe.
	 */
	bNumEndpoints: number;

	/**
	 * **Class code (assigned by the USB-IF).**
	 *
	 * The USB Class Codes are defined [here.](https://www.usb.org/defined-class-codes).
	 *
	 * `0xEF` is Miscellaneous (including DFU).
	 * `0xFE` is Application-specific
	 * `0xFF` is Vendor-specific
	 */
	bInterfaceClass: number;

	/**
	 * **Subclass code (assigned by the USB-IF).**
	 *
	 * These codes are qualified by the value of the `bDeviceClass` field.
	 *
	 * If the `bDeviceClass` field is reset to zero, this field must also be reset to zero.
	 *
	 * If the bDeviceClass field is not set to FFH, all values are reserved for assignment by the USB-IF.
	 */
	bInterfaceSubClass: number;

	/**
	 * **Protocol code (assigned by the USB-IF)**
	 *
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
	bInterfaceProtocol: number;

	/**
	 * **Index of string descriptor describing this interface.**
	 *
	 * Similar to `iProduct` in the USB device descriptor.
	 */
	iInterface: number;

	// The existing webDFU code has these descriptor objects.
	// This behaviour may be changed in the future but for now it will be ported across.
	descriptors: (DFUFunctionalDescriptor | WebDFUInterfaceSubDescriptor)[];
};
