/**
 * DFU Device state.
 * DFU Specificiation, Rev 1.1 - 6.1.2, page 22.
 *
 * Enum member names are matched to the names from the specification.
 */
export enum DFUDeviceState {
	/**
	 * Device is running its normal application.
	 */
	appIDLE = 0,

	/**
	 * Device is running its normal application,
	 * has received the DFU_DETACH request, and is waiting for a USB reset.
	 */
	appDETACH = 1,

	/**
	 * Device is operating in the DFU mode and is waiting for requests.
	 */
	dfuIDLE = 2,

	/**
	 * Device has received a block and is waiting for the host to solicit the
	 * status via DFU_GETSTATUS.
	 */
	dfuDNLOAD_SYNC = 3,

	/**
	 * Device is programming a control-write block into its nonvolatile memories.
	 */
	dfuDNBUSY = 4,

	/**
	 * Device is processing a download operation. Expecting DFU_DNLOAD requests.
	 */
	dfuDNLOAD_IDLE = 5,

	/**
	 * Device has received the final block of firmware from the host and is waiting
	 * for receipt of DFU_GETSTATUS to begin the Manifestation phase;
	 *
	 * or device has completed the Manifestation phase and is waiting for receipt of
	 * DFU_GETSTATUS.
	 *
	 * (Devices that can enter this state after the Manifestation phase set bmAttributes
	 *  bit bitManifestationTolerant to 1.)
	 */
	dfuMANIFEST_SYNC = 6,

	/**
	 * Device is in the Manifestation phase.
	 *
	 * (Not all devices will be able to respond to DFU_GETSTATUS when in this state.)
	 */
	dfuMANIFEST = 7,

	/**
	 * Device has programmed its memories and is waiting for a USB reset or a power on reset.
	 *
	 * (Devices that must enter this state clear bitManifestationTolerant to 0.)
	 */
	dfuMANIFEST_WAIT_RESET = 8,

	/**
	 * The device is processing an upload operation. Expecting DFU_UPLOAD requests.
	 */
	dfuUPLOAD_IDLE = 9,

	/**
	 * An error has occurred. Awaiting the DFU_CLRSTATUS request.
	 */
	dfuERROR = 10,
}
