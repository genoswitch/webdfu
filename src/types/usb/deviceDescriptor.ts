/**
 * Standard USB Device Descriptor.
 * Defined in the USB Specification Revision 2.0, Section 9.6.1 'Device'.
 *
 * Properties are annotated with their respective descriptions from Table 9-8 in the same section.
 */
export type USBDeviceDescriptor = {
	/**
	 * **Size of this descriptor, in bytes.**
	 */
	bLength: number;

	/**
	 * **DEVICE descriptor type.**
	 */
	bDescriptorType: number;

	/**
	 * **USB specification release number in binary coded decimal.**
	 *
	 * (i.e., 2.10 is 210H). This field identifies the release of the USB
	 * Specification with which the device and its descriptors are compliant.
	 */
	bcdUSB: number;

	/**
	 * **Class code (assigned by the USB-IF).**
	 * The USB Class Codes are defined [here.](https://www.usb.org/defined-class-codes).
	 *
	 * `0xEF` is Miscellaneous (including DFU).
	 * `0xFE` is Application-specific
	 * `0xFF` is Class-specific
	 *
	 * If this field is reset to zero, each interface within a configuration
	 * specifies its own class information and the various interfaces operate independently.
	 *
	 * If this field is set to a value between 1 and FEH, the device supports different
	 * class specifications on different interfaces and the interfaces may not operate
	 * independently. This value identifies the class definition used for the aggregate
	 * interfaces.
	 *
	 * If this field is set to FFH, the device class is vendor-specific.
	 */
	bDeviceClass: number;

	/**
	 * **Subclass code (assigned by the USB-IF).**
	 *
	 * These codes are qualified by the value of the `bDeviceClass` field.
	 *
	 * If the `bDeviceClass` field is reset to zero, this field must also be reset to zero.
	 *
	 * If the bDeviceClass field is not set to FFH, all values are reserved for assignment by the USB-IF.
	 */
	bDeviceSubClass: number;

	/**
	 * **Protocol code (assigned by the USB-IF)**
	 *
	 * These codes are qualified by the value of the `bDeviceClass` and the
	 * `bDeviceSubClass` fields. If a device supports class-specific protocols
	 * on a device basis as opposed to an interface basis, this code identifies
	 * the protocols that the device uses as defined by the specification of the
	 * device class.
	 *
	 * If this field is reset to zero, the device does not use class-specific protocols
	 * on a device basis. However, it may use class-specific protocols on an interface basis.
	 *
	 * If this field is set to FFH, the device uses a vendor-specific protocol on a device basis.
	 */
	bDeviceProtocol: number;

	/**
	 * **Maximum packet size for endpoint zero.**
	 *
	 * For USB 2.0, only 8, 16, 32, or 64 are valid.
	 */
	bMaxPacketSize0: number;

	/**
	 *  **Vendor ID (assigned by the USB-IF)**
	 */
	idVendor: number;

	/**
	 * **Product ID (assigned by the manufacturer)**
	 */
	idProduct: number;

	/**
	 * **Device release number in binary-coded decimal.**
	 */
	bcdDevice: number;

	/**
	 * **Index of string descriptor describing manufacturer.**
	 */
	iManufacturer: number;

	/**
	 * **Index of string descriptor describing product.**
	 */
	iProduct: number;

	/**
	 * **Index of string descriptor describing the device’s serial number.**
	 */
	iSerialNumber: number;

	/**
	 * **Number of possible configurations for this device.**
	 *
	 * Note that for a DFU device this value should be set to one.
	 */
	bNumConfigurations: number;
};
