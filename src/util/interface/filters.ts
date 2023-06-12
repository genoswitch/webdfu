export const InterfaceFilters = {
	DFU: (iface: USBInterface): boolean =>
		iface.alternate.interfaceClass == 0xfe &&
		iface.alternate.interfaceProtocol == 0x02 &&
		iface.alternate.interfaceSubclass == 0x01,
};

export interface InterfaceFilterPredicate {
	(iface: USBInterface): boolean;
}
