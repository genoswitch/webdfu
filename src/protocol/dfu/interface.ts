/**
 * Interface Protocol (`bInterfaceProtocol`)
 * This attribute is part of the DFU Interface Descriptor.
 *
 * This attribute represents the mode of operation supported by the DFU device.
 *
 * (DFU Rev 1.1, 4.1.2 Run-Time DFU Interface Descriptor, Table 4.1)
 *
 * (DFU Rev 1.1, 4.2.3 DFU Mode Interface Descriptor, Table 4.4)
 */
export enum InterfaceProtocol {
	RUNTIME_DFU = 0x01,
	DFU = 0x02,
}
