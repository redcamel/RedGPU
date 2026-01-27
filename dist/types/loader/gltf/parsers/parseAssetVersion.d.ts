import { GLTF } from "../GLTF";
/**
 * Parses the asset version from the given GLTF data.
 * Throws an error if the asset version is invalid or lower than the required version.
 *
 * @param {GLTF} gltfData - The GLTF data to parse.
 * @returns {number} - The parsed asset version.
 * @throws {Error} - If the asset version is invalid or lower than the required version.
 */
declare const parseAssetVersion: (gltfData: GLTF) => number;
export default parseAssetVersion;
