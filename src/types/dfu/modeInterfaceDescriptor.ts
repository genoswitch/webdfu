import { USBInterfaceDescriptor } from "../usb";

/**
 * DFU Mode Interface Descriptor.
 *
 * This class is identical to (and extends) {@link USBInterfaceDescriptor}.
 *
 * The only difference between the two is that this class has different `TSDoc` comments to
 * convey different ways these properties are used.
 */
export class DFUModeInterfaceDescriptor extends USBInterfaceDescriptor {
	/**
	 * @summary
	 * While not restricted as such, in this scenario this property is often
	 * used to indicate what memory "segment" is being accessed.
	 *
	 * @remarks
	 *
	 * (From specification)
	 *
	 * Alternate settings can be used by an application to access additional
	 * memory segments.
	 *
	 * In this case, it is suggested that each alternate
	 * setting employ a string descriptor to indicate the target memory
	 * segment; e.g., “EEPROM”
	 */
	declare bAlternateSetting: number;
}
