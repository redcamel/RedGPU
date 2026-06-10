import { GLTF } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * Parses the scene from a GLTF file.
 * @param {GLTFLoader} gltfLoader - The GLTF loader object.
 * @param {GLTF} gltfData - The GLTF data object.
 * @param {Function} [callback] - Optional callback function to be called after parsing the scene.
 */
declare const parseScene_GLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, callback?: Function) => void;
export default parseScene_GLTF;
