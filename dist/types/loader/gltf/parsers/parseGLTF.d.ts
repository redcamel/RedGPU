import { GLTF } from "../GLTF";
import GLTFLoader, { GLTFLoadingProgressInfo } from "../GLTFLoader";
declare const parseGLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, callBack: any, onProgress?: (info: GLTFLoadingProgressInfo) => void) => void;
export default parseGLTF;
