export const ensureError = (err: Error, name: string, msg: string): boolean => {
	return err.name == name && err.message == msg;
};
