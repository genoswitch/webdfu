import { USBDescriptorType } from "./protocol/usb/descriptorTypes";
import { DFUFunctionalDescriptor } from "./types/dfu/functionalDescriptor";
import { getConfigurationDescriptor } from "./util/descriptors/configuration";
import { InterfaceFilters } from "./util/interface/filters";
import { findInterface } from "./util/interface/find";

export class DeviceBootstrapper {
	private readonly device: USBDevice;
	private interface: USBInterface;

	private functionalDescriptor?: DFUFunctionalDescriptor;

	// In TypeScript you can create and assign a class instance property like this!
	constructor(device: USBDevice, iface: USBInterface) {
		this.device = device;

		// If a DFU interface was not passed, find the correct DFU interface to use.
		// Otherwise, pass the given USBInterface.
		if (iface) {
			this.interface = iface;
		} else {
			this.interface = findInterface(this.device, InterfaceFilters.DFU);
		}
	}

	async init() {
		// Open the device if it has not already been opened.
		if (!this.device.opened) await this.device.open();

		// Claim the DFU interface if not already claimed.
		if (this.interface.claimed) await this.device.claimInterface(this.interface.interfaceNumber);

		this.functionalDescriptor = await this.getDFUFunctionalDescriptor();

		console.log(this.functionalDescriptor.bcdDFUVersion);
		console.log(this.functionalDescriptor.bmAttributes);
	}

	// "Attempt to parse the DFU functional descriptor."
	private async getDFUFunctionalDescriptor() {
		// 1. Get the configuration descriptor for the DFU interface
		const dfuConfigurationDesc = await getConfigurationDescriptor(
			this.device,
			this.interface.interfaceNumber
		);

		// 2. Iterate through the configuration's "sub-descriptors" until we find the DFU Functional descriptor
		for (const desc of dfuConfigurationDesc.descriptors) {
			if (desc.bDescriptorType == USBDescriptorType.DFU_FUNCTIONAL) {
				return desc as DFUFunctionalDescriptor;
			}
		}

		return Promise.reject("DFU Functional Descriptor not found.");
	}
}
