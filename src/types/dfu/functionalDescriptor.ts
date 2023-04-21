/**
 * DFU Functional Descriptor.
 *
 * Defined in the DFU Specification Revision 1.1,
 *
 * Section 4.1.3 "Run-Time DFU Functional Descriptor"
 *
 * Note that this descriptor is **identical** for both run-time and DFU mode descriptor sets.
 *
 * Therefore, Section 4.2.4 "DFU Functional Descriptor" simply points to `4.1.3`.
 */
export interface DFUFunctionalDescriptor {
	/**
	 * **Size of this descriptor, in bytes.**
	 */
	bLength: number;

	/**
	 * **DFU Functional descriptor type.**
	 */
	bDescriptorType: number;

	/**
	 * **A bitmask containing DFU attributes.**
	 *
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
	bmAttributes: number;

	/**
	 * **Time, in ms, that the device will wait after recieving a `DFU_DETACH` request.**
	 *
	 * If this time elapses without a USB reset, then the device will terminate the Reconfiguration
	 * phase and revert back to normal operation. This represents the maximum time that the device can
	 * wait (depending on its timers, etc.). The host may specify a shorter timeout in the `DFU_DETACH` request.
	 */
	wDetachTimeOut: number;

	/**
	 * **Maximum number of bytes that the device can accept per control-write transaction.**
	 */
	wTransferSize: number;

	/**
	 * **Supported DFU version in binary coded decimal.**
	 *
	 * Numeric expression identifying the version of the DFU Specification release.
	 */
	bcdDFUVersion: number;
}
