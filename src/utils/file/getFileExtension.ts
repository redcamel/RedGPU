/**
 * Gets the file extension from a given URL.
 *
 * @param {string} url - The URL to extract the file extension from.
 * @returns {string} The file extension, or an empty string if no extension is found.
 * @throws {Error} If the URL is empty or undefined.
 */
const getFileExtension = (url: string): string => {
    if (!url || url.trim().length === 0) {
        throw new Error('URL must not be empty or undefined');
    }
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const extensionStartIndex = fileName.lastIndexOf('.');
    // No extension found
    if (extensionStartIndex === -1) {
        return '';
    }
    return fileName.substring(extensionStartIndex + 1).toLowerCase();
};
export default getFileExtension;
