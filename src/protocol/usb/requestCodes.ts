/**
 * Known USB Request Codes.
 *
 * ### Sources
 * Links to the relavant sources have been added using copies stored at a reference repository at https://github.com/genoswitch/usb-spec.
 * #### Codes 0-12 (`GET_STATUS`-`SYNCH_FRAME`)
 * [USB 2.0 Specification, Revision 2.0](https://genoswitch.github.io/usb-spec/usb2.0/docs/usb_20.pdf).
 * Section 9.4 "Standard Device Requests",
 * Table 9-4 "Standard Request Codes"
 *
 * #### Codes 13-23 (`SET_ENCRYPTION`-`SET_INTERFACE_DS`)
 * [Wireless USB Specification, Revision 1.1](https://genoswitch.github.io/usb-spec/wireless_usb/WirelessUSB_Specification_r11.pdf).
 * Section 7.3.1 "Wireless USB Extensions to Standard Requests",
 * Table 7-3 "Wireless USB Standard Request Codes".
 *
 * #### Codes 26-27 (`GET_FW_STATUS`-`SET_FW_STATUS`)
 * [USB 3.2 Firmware Update ECN](https://genoswitch.github.io/usb-spec/usb3.2/docs/USB%203.2%20ECNs/USB%203.2%20ECN%20USB%20FW%20Update.pdf).
 * (Engineering Change Notice, [Applies to USB 3.2 Revision 1.0](https://genoswitch.github.io/usb-spec/usb3.2_r1.0/usb3.2.pdf)).
 * Therefore, this change is visible in the [USB 3.2 Revision 1.1](https://genoswitch.github.io/usb-spec/usb3.2/docs/USB%203.2%20Revision%201.1.pdf) document.
 *
 * #### Codes 48-49 (`SET_SEL`-`SET_ISOCH_DELAY`)
 * [USB 3.2 Specification, Revision 1.0](https://genoswitch.github.io/usb-spec/usb3.2_r1.0/usb3.2.pdf).
 * Section 9.4 "Standard Device Requests",
 * Table 9-5 "Standard Request Codes".
 */
export enum USBRequestCode {
	// **Codes 0-12**
	// USB 2.0 Specification, Revision 2.0, Section 9.4 "Standard Device Requests"
	// Table 9-4 "Standard Request Codes"
	// https://genoswitch.github.io/usb-spec/usb2.0/docs/usb_20.pdf
	GET_STATUS = 0,
	CLEAR_FEATURE = 1,
	// 2 is reserved
	SET_FEATURE = 3,
	// 4 is reserved
	SET_ADDRESS = 5,
	GET_DESCRIPTOR = 6,
	SET_DESCRIPTOR = 7,
	GET_CONFIGURATION = 8,
	SET_CONFIGURATION = 9,
	GET_INTERFACE = 10,
	SET_INTERFACE = 11,
	SYNCH_FRAME = 12,

	// **Codes 13-23**
	// Wireless USB Specification, Revision 1.1
	// Section 7.3.1 "Wireless USB Extensions to Standard Requests",
	// Table 7-3 "Wireless USB Standard Request Codes".
	// https://genoswitch.github.io/usb-spec/wireless_usb/WirelessUSB_Specification_r11.pdf
	// -> Purpose: Security
	SET_ENCRYPTION = 13,
	GET_ENCRYPTION = 14,
	SET_HANDSHAKE = 15,
	GET_HANDSHAKE = 16,
	SET_CONNECTION = 17,
	SET_SECURITY_DATA = 18,
	GET_SECURITY_DATA = 19,
	// -> Purpose: General
	SET_WUSB_DATA = 20,
	LOOPBACK_DATA_WRITE = 21,
	LOOPBACK_DATA_READ = 22,
	SET_INTERFACE_DS = 23,

	// **Codes 26-27**
	// USB 3.2 Firmware Update ECN
	// (Applies to USB 3.2 Specification Revision 1.0)
	// https://genoswitch.github.io/usb-spec/usb3.2/docs/USB%203.2%20ECNs/USB%203.2%20ECN%20USB%20FW%20Update.pdf
	GET_FW_STATUS = 26,
	SET_FW_STATUS = 27,

	// **Codes 48-49**
	// USB 3.2 Specification, Revision 1.0
	// Section 9.4 "Standard Device Requests", Table 9-4 "Standard Request Codes"
	// https://genoswitch.github.io/usb-spec/usb3.2_r1.0/usb3.2.pdf
	SET_SEL = 48,
	SET_ISOCH_DELAY = 49,
}
