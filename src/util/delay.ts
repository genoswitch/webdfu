/**
 * Async function to wait or delay for a specified number of milliseconds.
 *
 * @param ms The time to delay for, in milliseconds.
 * @returns A {@link Promise} that resolves when the specified time has elapsed.
 */
export const delay = (ms: number): Promise<unknown> => {
	return new Promise(resolve => setTimeout(resolve, ms));
};
