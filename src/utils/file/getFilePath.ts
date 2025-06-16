/**
 * Retrieves the file path from the given URL.
 *
 * @param {string} url - The URL from which to retrieve the file path.
 * @returns {string} - The file path extracted from the URL.
 * @throws {Error} - If the URL is empty or undefined.
 */
const getFilePath = (url: string): string => {
	if (!url || url.trim().length === 0) {
		throw new Error('URL must not be empty or undefined');
	}
	return url.substring(0, url.lastIndexOf('/') + 1);
};
export default getFilePath;
