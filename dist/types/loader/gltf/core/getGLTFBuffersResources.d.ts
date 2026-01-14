import { GLTF } from "../GLTF";
import GLTFLoader, { GLTFLoadingProgressInfo } from "../GLTFLoader";
declare const getGLTFBuffersResources: (gltfLoader: GLTFLoader, gltfData: GLTF, callback: any, onProgress: (info: GLTFLoadingProgressInfo) => void) => void;
export default getGLTFBuffersResources;
