import GLTFLoader, { GLTFLoadingProgressInfo } from "../../GLTFLoader";
declare const parseFileGLTF: (gltfLoader: GLTFLoader, callBack: any, onProgress?: (info: GLTFLoadingProgressInfo) => void) => Promise<void>;
export default parseFileGLTF;
