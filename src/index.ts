import { DFUDevice } from "./dfu";
import { USBDescriptorType } from "./protocol/usb/descriptorTypes";
import { DFUVersion } from "./protocol/version";
import { DFUFunctionalDescriptor } from "./types/dfu/functionalDescriptor";
import { DFUModeInterfaceDescriptor } from "./types/dfu/modeInterfaceDescriptor";
import { USBConfigurationDescriptor, USBInterfaceDescriptor } from "./types/usb";
import { getConfigurationDescriptor } from "./util/descriptors/configuration";
import { InterfaceFilters } from "./util/interface/filters";
import { findInterface } from "./util/interface/find";

export class DeviceBootstrapper {
	private readonly device: USBDevice;
	private interface: USBInterface;

	private functionalDescriptor?: DFUFunctionalDescriptor;
	private configurationDescriptor?: USBConfigurationDescriptor;
	private interfaceDescriptor?: DFUModeInterfaceDescriptor;

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

	async init(): Promise<DFUDevice> {
		// Open the device if it has not already been opened.
		if (!this.device.opened) await this.device.open();

		// Claim the DFU interface if not already claimed.
		if (!this.interface.claimed) await this.device.claimInterface(this.interface.interfaceNumber);

		// Get the configuration descriptor for the DFU interface.
		this.configurationDescriptor = await getConfigurationDescriptor(
			this.device,
			this.interface.interfaceNumber
		);

		// Get the interface descriptor
		this.interfaceDescriptor = await this.getDFUModeInterfaceDescriptor();

		this.functionalDescriptor = await this.getDFUFunctionalDescriptor();

		console.log(this.functionalDescriptor.bcdDFUVersion);
		console.log(this.functionalDescriptor.bmAttributes);

		// Determine if the device is DfuSe-compatible
		if (
			this.functionalDescriptor.bcdDFUVersion == DFUVersion.DfuSe &&
			this.interface.alternate.interfaceProtocol == 0x02
		) {
			throw new Error("Found a DfuSe device! Not yet implemented.");
		}

		// DFU device. Instanciate and return a DFUDevice instance.
		return new DFUDevice(
			this.device,
			this.interface,
			this.functionalDescriptor,
			this.configurationDescriptor,
			this.interfaceDescriptor
		);
	}

	// "Attempt to parse the DFU functional descriptor."
	private async getDFUFunctionalDescriptor() {
		if (this.configurationDescriptor) {
			// 2. Iterate through the configuration's "sub-descriptors" until we find the DFU Functional descriptor
			for (const desc of this.configurationDescriptor.descriptors) {
				if (desc.bDescriptorType == USBDescriptorType.DFU_FUNCTIONAL) {
					return desc as DFUFunctionalDescriptor;
				}
			}

			return Promise.reject("DFU Functional Descriptor not found.");
		} else {
			return Promise.reject("Configuration Descriptor not found.");
		}
	}

	private async getDFUModeInterfaceDescriptor() {
		if (this.configurationDescriptor) {
			for (const desc of this.configurationDescriptor.descriptors) {
				if (desc.bDescriptorType == USBDescriptorType.INTERFACE) {
					// This descriptor is an interface descriptor. Cast to USBInterfaceDescriptor.
					const ifaceDesc = desc as USBInterfaceDescriptor;
					// Check the interface class, protocol and subclass
					if (
						ifaceDesc.bInterfaceClass == 0xfe &&
						ifaceDesc.bInterfaceSubClass == 0x01 &&
						ifaceDesc.bInterfaceProtocol == 0x02
					) {
						// Interface appears to be an interface descriptor for DFU Mode.
						// Cast to DFUModeInterfaceDescriptor and return.
						return ifaceDesc as DFUModeInterfaceDescriptor;
					}
				}
			}
			return Promise.reject("USB Interface Descriptor not found.");
		} else {
			return Promise.reject("Configuration Descriptor not found.");
		}
	}
}
