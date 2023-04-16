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
 * #### Descriptors 15-49 (`BOS`-`SUPERSPEEDPLUS_ISOCHRONOUS_ENDPOINT_COMPANION`)
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

	// **Descriptors 15-49**
	// USB 3.2 Revision 1.1 Specification, Table 9-6.
	// (USB 3.0 specification not found at this time)
	// https://genoswitch.github.io/usb-spec/usb3.2/docs/USB%203.2%20Revision%201.1.pdf
	BOS = 15,
	DEVICE_CAPABILITY = 16,
	SUPERSPEED_USB_ENDPOINT_COMPANION = 48,
	SUPERSPEEDPLUS_ISOCHRONOUS_ENDPOINT_COMPANION = 49,
}
