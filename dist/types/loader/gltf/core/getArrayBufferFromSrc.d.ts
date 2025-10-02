/**
 * Represents a callback function for a loader that loads an ArrayBuffer.
 *
 * @callback LoaderCallback
 * @param {ArrayBuffer} buffer - The loaded ArrayBuffer.
 * @returns {void}
 */
type LoaderCallback = (buffer: ArrayBuffer) => void;
/**
 * Represents a callback function that handles error.
 *
 * @callback ErrorCallback
 * @param {any} err - The error object to be handled.
 * @returns {void}
 */
type ErrorCallback = (err: any) => void;
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
declare const getArrayBufferFromSrc: (src: string, onLoad: LoaderCallback, onError?: ErrorCallback) => Promise<void>;
export default getArrayBufferFromSrc;
