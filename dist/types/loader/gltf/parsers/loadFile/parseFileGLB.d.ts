import GLTFLoader, { GLTFLoadingProgressInfo } from "../../GLTFLoader";
/**
 * Parses a GLB file using the provided GLTFLoader and invokes the callback with the parsed data.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader used to load the GLB file.
 * @param {function} callBack - The callback function to be invoked with the parsed GLTF data.
 *
 * @returns {Promise<void>} - A promise that resolves when the GLB file has been parsed.
 */
declare const parseFileGLB: (gltfLoader: GLTFLoader, callBack: any, onProgress?: (info: GLTFLoadingProgressInfo) => void) => Promise<void>;
export default parseFileGLB;
