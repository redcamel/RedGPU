import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import { GLTF, MeshPrimitive } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
/**
 * Parse Material Info from GLTF
 * @param {GLTFLoader} gltfLoader - The GLTF Loader
 * @param {GLTF} gltfData - The GLTF data
 * @param {MeshPrimitive} meshPrimitive - The Mesh Primitive
 * @returns {PBRMaterial} - The parsed PBR Material
 */
declare const parseMaterialInfo_GLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, meshPrimitive: MeshPrimitive) => PBRMaterial;
export default parseMaterialInfo_GLTF;
