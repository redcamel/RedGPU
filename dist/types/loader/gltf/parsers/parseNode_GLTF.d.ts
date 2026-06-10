import Mesh from "../../../display/mesh/Mesh";
import { GLTF, GlTfId } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * Parses a node in a GLTF hierarchy and constructs the corresponding mesh or group in the scene.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader instance.
 * @param {GLTF} gltfData - The GLTF data.
 * @param {GlTfId} nodeGlTfId - The identifier of the node in the GLTF data.
 * @param {Mesh} parentMesh - The parent mesh to attach the parsed node to.
 */
declare const parseNode_GLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, nodeGlTfId: GlTfId, parentMesh: Mesh) => void;
export default parseNode_GLTF;
