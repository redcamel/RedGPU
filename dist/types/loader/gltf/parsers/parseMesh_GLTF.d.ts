import { GLTF, GlTfId, Mesh as GltfMesh } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
declare const parseMesh_GLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, gltfMesh: GltfMesh, nodeGlTfId: GlTfId) => any[];
export default parseMesh_GLTF;
