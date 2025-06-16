/**
 * Retrieves the file name from a given URL.
 *
 * @param {string} url - The URL from which to retrieve the file name.
 * @param {boolean} [withExtension=true] - Indicates whether the file name should include the extension.
 * @returns {string} - The file name extracted from the URL.
 */
const getFileName = (url: string, withExtension: boolean = true): string => {
	const fullFileName = url.substring(url.lastIndexOf('/') + 1);
	return withExtension ? fullFileName : fullFileName.split('.').slice(0, -1).join('.');
};
export default getFileName;
