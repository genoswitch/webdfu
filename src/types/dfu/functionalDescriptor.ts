import { DFUFunctionalDescriptorAttribute } from "../../protocol/dfu/functionalDescriptorAttribute";
import { USBDescriptor } from "../usb/descriptor";

/**
 * DFU Functional Descriptor.
 *
 * @remarks
 * the DFU Functional Descriptor is defined in the DFU Specification Revision 1.1, Section 4.1.3 "Run-Time DFU Functional Descriptor"
 *
 * Note that this descriptor is **identical** for both run-time and DFU mode descriptor sets.
 *
 * Therefore, Section 4.2.4 "DFU Functional Descriptor" simply points to `4.1.3`.
 *
 * Property sizes and annotations are taken from the DFU Specification Revision 1.1, Section 4.1.3, Table 4.2 "DFU Functional Descriptor".
 */
export class DFUFunctionalDescriptor extends USBDescriptor {
	/**
	 * A bitmask containing DFU attributes.
	 *
	 * @fieldByteSize 1
	 * @fieldByteIndex 2
	 * @fieldByteType Uint8
	 *
	 * @remarks
	 * Bit 7..4 Reserved
	 *
	 * Bit 3: Device will perform a bus reattach without a USB [bus] reset `bitWillDetach`
	 * > Device will perform a bus detach-attach sequence when it receives a DFU_DETACH request. The host must not issue a USB Reset.
	 *
	 * Bit 2: Device will tolerate manifestation `bitManifestationTolerant`
	 * > Device is able to communicate via USB after the manifestation phase.
	 *
	 * > `0`: No, must see [USB] bus reset.
	 *
	 * > `1`: Yes
	 *
	 * Bit 1: Upload capable `bitCanUpload`
	 *
	 * Bit 0: Download capable `bitCanDnload`
	 */
	readonly bmAttributes: number;

	/**
	 * Time, in ms, that the device will wait after recieving a `DFU_DETACH` request.
	 *
	 * @fieldByteSize 2
	 * @fieldByteIndex 3
	 * @fieeldByteType Uint16 (little-endian)
	 *
	 * If this time elapses without a USB reset, then the device will terminate the Reconfiguration
	 * phase and revert back to normal operation. This represents the maximum time that the device can
	 * wait (depending on its timers, etc.). The host may specify a shorter timeout in the `DFU_DETACH` request.
	 */
	readonly wDetachTimeOut: number;

	/**
	 * Maximum number of bytes that the device can accept per control-write transaction.
	 *
	 * @fieldByteSize 2
	 * @fieldByteIndex 5
	 * @fieldByteType Uint16 (little-endian)
	 */
	readonly wTransferSize: number;

	/**
	 * Supported DFU version in binary coded decimal.
	 *
	 * @fieldByteSize 2
	 * @fieldByteIndex 7
	 * @fieldByteType Uint16 (little-endian)
	 *
	 * @remarks
	 * Numeric expression identifying the version of the DFU Specification release.
	 */
	readonly bcdDFUVersion: number;

	/**
	 * (alias) Enum of available attributes for this descriptor.
	 *
	 * @see isSupported
	 */
	readonly attributes = DFUFunctionalDescriptorAttribute;

	/**
	 * Parse a DFU Functional Descriptor from the given `DataView`
	 *
	 *
	 * @param data The `DataView` object containing the descriptor
	 */
	constructor(data: DataView) {
		super(data);

		// bLength and bDescriptorType are set by the parent class.

		this.bmAttributes = this.data.getUint8(2);
		this.wDetachTimeOut = this.data.getUint16(3, true);
		this.wTransferSize = this.data.getUint16(5, true);
		this.bcdDFUVersion = this.data.getUint16(7, true);
	}

	/**
	 * Query if an attribute is supported or set.
	 *
	 * @param attr The attribute to query against
	 * @returns A boolean representing if the attribute is supported/set or not.
	 */
	isSupported(attr: DFUFunctionalDescriptorAttribute): boolean {
		return (this.bmAttributes & attr) != 0;
	}
}
