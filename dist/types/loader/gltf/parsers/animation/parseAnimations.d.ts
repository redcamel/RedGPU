import { GLTF } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
export interface GLTFParsedSingleClip {
    minTime: number;
    maxTime: number;
    name: string;
    [key: string]: any;
}
/**
 * Parses animation data for a given GLTF scene.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader used for loading the scene data.
 * @param {GLTF} gltfData - The GLTF scene data containing animations to be parsed.
 * @returns {Promise<void>} - A promise that resolves when the animation data has been parsed.
 */
declare const parseAnimations: (gltfLoader: GLTFLoader, gltfData: GLTF) => Promise<void>;
export default parseAnimations;
