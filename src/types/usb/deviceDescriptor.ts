import { USBDescriptor } from "./descriptor";

/**
 * USB Device Descriptor.
 *
 * @remarks
 *
 *
 * The USB Device Descriptor is defined in the USB Specification Revision 2.0, Section 9.6.1 'Device'.
 *
 * Property sizes and annotations are taken from the USB Specification Revision 2, Section 9.6.1, Table 9-8. "Standard Device Descriptor".
 */
export class USBDeviceDescriptor extends USBDescriptor {
	/**
	 * USB specification release number in binary coded decimal.
	 *
	 * @fieldByteSize 2
	 * @fieldByteIndex 2
	 * @fieldByteType Uint16 (little-endian)
	 *
	 * @remarks
	 * (i.e., 2.10 is 210H). This field identifies the release of the USB
	 * Specification with which the device and its descriptors are compliant.
	 */
	readonly bcdUSB: number;

	/**
	 * Class code (assigned by the USB-IF).
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 4
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * The USB Class Codes are defined [here.](https://www.usb.org/defined-class-codes).
	 *
	 * > `0xEF` is Miscellaneous (including DFU).
	 *
	 * > `0xFE` is Application-specific.
	 *
	 * > `0xFF` is Vendor-specific.
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
	readonly bDeviceClass: number;

	/**
	 * Subclass code (assigned by the USB-IF).
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 5
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * These codes are qualified by the value of the `bDeviceClass` field.
	 *
	 * If the `bDeviceClass` field is reset to zero, this field must also be reset to zero.
	 *
	 * If the bDeviceClass field is not set to FFH, all values are reserved for assignment by the USB-IF.
	 */
	readonly bDeviceSubClass: number;

	/**
	 * Protocol code (assigned by the USB-IF)
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 6
	 * @fieldByteType Uint8
	 *
	 *
	 * @remarks
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
	readonly bDeviceProtocol: number;

	/**
	 * Maximum packet size for endpoint zero.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 7
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * For USB 2.0, only 8, 16, 32, or 64 are valid.
	 */
	readonly bMaxPacketSize0: number;

	/**
	 *  Vendor ID (assigned by the USB-IF)
	 *
	 * @fieldByteSize 2
	 * @fieldByteIndex 8
	 * @fieldByteType Uint16 (little-endian)
	 */
	readonly idVendor: number;

	/**
	 * Product ID (assigned by the manufacturer)
	 *
	 * @fieldByteSize 2
	 * @fieldByteIndex 10
	 * @fieldByteType Uint16 (little-endian)
	 */
	readonly idProduct: number;

	/**
	 * Device release number in binary-coded decimal.
	 *
	 * @fieldByteSize 2
	 * @fieldByteIndex 12
	 * @fieldByteType Uint16 (little-endian)
	 */
	readonly bcdDevice: number;

	/**
	 * Index of string descriptor describing manufacturer.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 14
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * This property has a value equal to the index of a string descriptor containing a string that will be displayed as the Manufacturer name.
	 *
	 * Example: `ACME, Inc.`
	 */
	readonly iManufacturer: number;

	/**
	 * Index of string descriptor describing product.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 15
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * This property has a value equal to the index of a string descriptor containing a string that will be displayed as the product name.
	 *
	 * Example: `Amazing WebUSB Device`
	 */
	readonly iProduct: number;

	/**
	 * Index of string descriptor describing the device’s serial number.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 16
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * This property has a value equal to the index of a string descriptor containing a string that will be displayed as the product's serial number.
	 *
	 * Example: `0xdeadbeef`, `amazing serial number`, `000000`. Anything you like!
	 */
	readonly iSerialNumber: number;

	/**
	 * Number of possible configurations for this device.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 17
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * Note that for a DFU device this value should be set to one.
	 *
	 * A USB Device can only have a single device descriptor as it includes information about the whole device.
	 */
	readonly bNumConfigurations: number;

	/**
	 * Parse a USB Device Descriptor from thee given `DataView`.
	 *
	 * @param data The `DataView` object containing the descriptor data
	 */
	constructor(data: DataView) {
		super(data);

		// bLength and bDescriptorType are set by the parent class.

		this.bcdUSB = this.data.getUint16(2, true);
		this.bDeviceClass = this.data.getUint8(4);
		this.bDeviceSubClass = this.data.getUint8(5);
		this.bDeviceProtocol = this.data.getUint8(6);
		this.bMaxPacketSize0 = this.data.getUint8(7);
		this.idVendor = this.data.getUint16(8, true);
		this.idProduct = this.data.getUint16(10, true);
		this.bcdDevice = this.data.getUint16(12, true);
		this.iManufacturer = this.data.getUint8(14);
		this.iProduct = this.data.getUint8(15);
		this.iSerialNumber = this.data.getUint8(16);
		this.bNumConfigurations = this.data.getUint8(17);
	}
}
