import Mesh from "../../../../display/mesh/Mesh";
import { GLTF, Skin } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
/**

 * Parse skin information from GLTF data and assign it to a mesh.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader instance used to load the GLTF data.
 * @param {GLTF} scenesData - The GLTF data containing the scene information.
 * @param {Skin} skin - The skin object containing the joint and skeleton information.
 * @param {Mesh} mesh - The mesh object to which the skin information should be assigned.
 */
declare const parseSkin_GLTF: (gltfLoader: GLTFLoader, scenesData: GLTF, skin: Skin, mesh: Mesh) => void;
export default parseSkin_GLTF;
