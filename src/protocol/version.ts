/**
 * Known DFU versions. This property is usually set in `bcdDFUVersion` in the DFU Functional Descriptor.
 */
export enum DFUVersion {
	/**
	 * **DFU Version 1.0.**
	 *
	 * Note that the 1.0 specification does not include a `bcdDFUVersion`
	 * attribute but many implementations will identify DFU 1.0 by it's
	 * lack of such attribute and set it to `0x0100`.
	 *
	 * For other differences between 1.0 and 1.1 please see [`dfu-util`'s spec changes document (permalink)](https://gitlab.com/dfu-util/dfu-util/-/blob/7e1fc9598c179579259a6073a893c7b8466fd714/doc/SPEC-differences.txt).
	 */
	DFU_1_0 = 0x0100, // DFU 1.0
	/**
	 *
	 * **DFU Version 1.1.** (alternate)
	 *
	 * TinyUSB reports `bcdDFUVersion` as `0x0101`.
	 *
	 * This is set in [`src/device/usbd.h` (permalink)](https://github.com/hathach/tinyusb/blob/28817a715024c82b78f9b9d19f37a72771870759/src/device/usbd.h),
	 * on lines 642 (DFU Runtime descriptor) and
	 * on line 656 (DFU Descriptor).
	 *
	 * However, it seems like other libraries also use this version, such as [`xmega_usb`](https://github.com/kuro68k/xmega_usb). Wheather this was inspired by TinyUSB is unknown.
	 * In `xmega_usb`, this version is set in [`usb/descriptors.c#176` (permalink)](https://github.com/kuro68k/xmega_usb/blob/165ff68741ce17bc92a7d9a2bb1ae1a687f26a7d/xmega_usb/usb/descriptors.c#L176)
	 */
	DFU_1_1_ALT = 0x0101,

	/**
	 * **DFU Version 1.1.**
	 *
	 * `0x0110` seems to be the 'proper' version, it is used by dfu-util as the value set when forcing DFU 1.1.
	 */
	DFU_1_1 = 0x0110,

	/**
	 * **ST 'DfuSe' Version 1.1a.**
	 *
	 * DfuSe (DFU with ST extensions) is based on DFU 1.1.
	 *
	 * However, when expanding the functionality of the protocol ST broke the DFU 1.1 standard.
	 *
	 * Therefore, DfuSe compatible devices report the DFU version as `1.1a`.
	 *
	 * More information about DfuSe can be found on the [`dfu-util` SourceForge site](https://dfu-util.sourceforge.net/dfuse.html).
	 */
	DfuSe = 0x011a,
}
