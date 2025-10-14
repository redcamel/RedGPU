/**
 * Load an ArrayBuffer from a given source URL.
 *
 * @param {string} src - The source URL to load the ArrayBuffer from.
 * @param {function} onLoad - The callback function to be called when the ArrayBuffer is loaded successfully.
 * @param {function} [onError] - The callback function to be called when an error occurs during loading. Default is an empty function.
 * @returns {void}
 * @async
 * @throws {Error} if an error occurs during loading.
 */
const getArrayBufferFromSrc = async (src, onLoad, onError = () => {
}) => {
    try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        onLoad(arrayBuffer);
    }
    catch (error) {
        onError(error);
    }
};
export default getArrayBufferFromSrc;
