import { DFUVersion } from "./protocol/version";
import { DFUFunctionalDescriptor } from "./types/dfu/functionalDescriptor";

export class DFUDevice {
	private readonly device: USBDevice;
	private readonly interface: USBInterface;
	private readonly functionalDescriptor: DFUFunctionalDescriptor;

	constructor(
		device: USBDevice,
		iface: USBInterface,
		functionalDescriptor: DFUFunctionalDescriptor
	) {
		this.device = device;
		this.interface = iface;
		this.functionalDescriptor = functionalDescriptor;

		console.log("(DFUDevice) constructor.");
	}

	get type(): DFUVersion {
		if (
			this.functionalDescriptor.bcdDFUVersion == DFUVersion.DfuSe &&
			this.interface.alternate.interfaceProtocol == 0x02
		) {
			return DFUVersion.DfuSe;
		} else if (this.functionalDescriptor.bcdDFUVersion == DFUVersion.DFU_1_1) {
			// 0x0110
			return DFUVersion.DFU_1_1;
		} else if (this.functionalDescriptor.bcdDFUVersion == DFUVersion.DFU_1_1_ALT) {
			// 0x0101
			return DFUVersion.DFU_1_1_ALT;
		}

		// Fallback to DFU 1.0
		return DFUVersion.DFU_1_0;
	}
}
