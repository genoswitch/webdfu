/**
 * Known USB Descriptor Types.
 *
 * ### Sources
 * Links to the relavant sources have been added using copies stored at a reference repository at https://github.com/genoswitch/usb-spec.
 * #### Descriptors 1-8 (`DEVICE`-`INTERFACE_POWER`)
 * [USB 2.0 Specification, Revision 2.0](https://genoswitch.github.io/usb-spec/usb2.0/docs/usb_20.pdf).
 * Section 9.4 "Standard Device Requests",
 * Table 9-5 "Descriptor Types"
 *
 *
 * #### Descriptor 9 `OTG`
 * [On-The-Go and Embedded Host Supplement to the USB Revision 2.0 Specification, Revision 2.0](https://genoswitch.github.io/usb-spec/usb2.0/docs/USB%20OTG%20and%20Embedded%20Host/USB_OTG_and_EH_2-0-version%201_1a.pdf),
 * Version 1.1a, Section 6.1, "OTG Descriptor", Table 6-1 "OTG Descriptor"
 *
 * #### Descriptor 10 `DEBUG`
 * Noted in the "Interface Association Descriptors ECN" (USB 2.0), onwards. Exact source unknown.
 *
 * #### Descriptor 11 `INTERFACE_ASSOCIATION`
 * [Interface Association Descriptors Engineering Change Notice](https://genoswitch.github.io/usb-spec/usb2.0/docs/InterfaceAssociationDescriptor_ecn.pdf), Specification Changes,
 * Amendments to Table 9-6.
 *
 * #### Descriptors 15-16 (`BOS`-`DEVICE_CAPABILITY`)
 * [USB 3.2 Revision 1.1 Specification](https://genoswitch.github.io/usb-spec/usb3.2/docs/USB%203.2%20Revision%201.1.pdf), Table 9-6.
 *
 * #### Descriptor 33 (`DFU_FUNCTIONAL`)
 * [DFU Specification, Revision 1.0](https://genoswitch.github.io/usb-spec/dfu/Device%20Firmware%20Upgrade%20Specification%20v1.0.pdf),
 * Section 4.1.3 "Run-Time DFU Functional Descriptor", Table 4-2 "DFU Functional Descriptor", bDescriptorType literal.
 *
 * The value is not noted in the specification, so the value was instead sourced from the [upstream (flipperdevices) codebase](https://github.com/genoswitch/webdfu/blob/archive/upstream-flipperdevices/index.ts#L180) as well as in [TinyUSB (`src/class/dfu/dfu.h`)](https://github.com/hathach/tinyusb/blob/5e023fa2ca4c20f06b6e0dc12f6f044a7d4e14bd/src/class/dfu/dfu.h#L50)
 *
 * #### Descriptors 48-49 (`SUPERSPEED_USB_ENDPOINT_COMPANION`-`SUPERSPEEDPLUS_ISOCHRONOUS_ENDPOINT_COMPANION`)
 * [USB 3.2 Revision 1.1 Specification](https://genoswitch.github.io/usb-spec/usb3.2/docs/USB%203.2%20Revision%201.1.pdf), Table 9-6.
 *
 */
export enum USBDescriptorType {
	// **Descriptors 1-8**
	// USB 2.0 Specification, Revision 2.0, 9.4 "Standard Device Requests",
	// Table 9-5 "Descriptor Types"
	// https://genoswitch.github.io/usb-spec/usb2.0/docs/usb_20.pdfs
	DEVICE = 1,
	CONFIGURATION = 2,
	STRING = 3,
	INTERFACE = 4,
	ENDPOINT = 5,
	DEVICE_QUALIFIER = 6,
	OTHER_SPEED_CONFIGURATION = 7,

	// "The INTERFACE_POWER descriptor is defined in the current revision of the USB Interface Power Management Specification."
	INTERFACE_POWER = 8,

	// On-The-Go and Embedded Host Supplement to the USB Revision 2.0 Specification, Revision 2.0,
	// Version 1.1a, Section 6.1, "OTG Descriptor", Table 6-1 "OTG Descriptor"
	// https://genoswitch.github.io/usb-spec/usb2.0/docs/USB%20OTG%20and%20Embedded%20Host/USB_OTG_and_EH_2-0-version%201_1a.pdf
	OTG = 9,

	// noted in IAD onwards (including USB3)
	DEBUG = 10,

	// USB 2.0 (Interface Association Descriptor)
	// Interface Association Descriptors Engineering Change Notice,
	// Specification Changes, Amendments to Table 9-6.
	// https://genoswitch.github.io/usb-spec/usb2.0/docs/InterfaceAssociationDescriptor_ecn.pdf
	INTERFACE_ASSOCIATION = 11,

	// **Descriptors 15-16**
	// USB 3.2 Revision 1.1 Specification, Table 9-6.
	// (USB 3.0 specification not found at this time)
	// https://genoswitch.github.io/usb-spec/usb3.2/docs/USB%203.2%20Revision%201.1.pdf
	BOS = 15,
	DEVICE_CAPABILITY = 16,

	// **Descriptor 33**
	// DFU Specification, Revision 1.0.
	// Section 4.1.3 "Run-Time DFU Functional Descriptor",
	// Table 4-2 "DFU Functional Descriptor", bDescriptorType literal.
	// https://genoswitch.github.io/usb-spec/dfu/Device%20Firmware%20Upgrade%20Specification%20v1.0.pdf
	// Value inherited from upstream (flipperdevices) codebase, as well as tinyUSB.
	// The value is not noted in the specification.
	DFU_FUNCTIONAL = 33, // 0x21

	// **Descriptors 48-49**
	// USB 3.2 Revision 1.1 Specification, Table 9-6.
	// (USB 3.0 specification not found at this time)
	// https://genoswitch.github.io/usb-spec/usb3.2/docs/USB%203.2%20Revision%201.1.pdf
	SUPERSPEED_USB_ENDPOINT_COMPANION = 48,
	SUPERSPEEDPLUS_ISOCHRONOUS_ENDPOINT_COMPANION = 49,
}
