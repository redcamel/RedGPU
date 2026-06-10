import GLTFLoader, { GLTFLoadingProgressInfo } from "../../GLTFLoader";
declare const parseFileGLB: (gltfLoader: GLTFLoader, callBack: any, onProgress?: (info: GLTFLoadingProgressInfo) => void) => Promise<void>;
export default parseFileGLB;
