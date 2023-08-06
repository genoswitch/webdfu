export type LifecycleEvents = {
	/**
	 * Event emitted to indicate the start/initialization of a process.
	 */
	init: () => void;

	/**
	 * Event emitted to indicate the process has finished (last thing emitted)
	 */
	end: () => void;

	/**
	 * Event emitted to indicate the process has encountered an error.
	 *
	 * @param err The error returned by the promise
	 */
	error: (err: unknown) => void;
};

export type WriteEvents = LifecycleEvents & {
	/**
	 * Event called when the write process begins.
	 */
	"write/start": () => void;

	/**
	 * Event emitted to indicate the progress of a write process.
	 *
	 * @param bytesSent The amount of bytes transmitted so far
	 * @param expectedSize The expected size (used to calculate percentage progress)
	 */
	"write/progress": (bytesSent: number, expectedSize: number) => void;

	/**
	 * Event emitted to indicate the end of a write process.
	 *
	 * @param bytesSent The amount of bytes transmitted so far
	 *
	 * @remarks
	 * After this event is emitted, clean-up operations will start.
	 *
	 * {@link LifecycleEvents.end} will be emitted before the process ends.
	 *
	 */
	"write/finish": (bytesSent: number) => void;
};

export type ReadEvents = LifecycleEvents & {
	/**
	 * Event called when the read process begins.
	 */
	"read/start": () => void;

	/**
	 * Event emitted to indicate the progress of a read process.
	 *
	 * @param bytesRead The amount of bytes read so far
	 * @param block The last block ({@link USBInTransferResult}) that has been read
	 */
	"read/progress": (bytesRead: number, block: USBInTransferResult) => void;

	/**
	 * Event emitted to indicate the end of a read process.
	 *
	 * @param bytesRead The amount of bytes read
	 * @param blocks An array of {@link USBInTransferResult}s from the read process
	 * @param data A {@link Blob} containing the raw data that has been read from the device
	 */
	"read/finish": (bytesRead: number, blocks: USBInTransferResult[], data: Blob) => void;
};
