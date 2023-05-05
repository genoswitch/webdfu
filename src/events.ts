export type WriteEvents = {
	start: () => void;
	progress: (bytesSent: number, expectedSize: number) => void;
	finish: (bytesSent: number) => void;
};
