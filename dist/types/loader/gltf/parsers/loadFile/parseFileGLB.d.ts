import { LoadingProgressInfo } from "../../core/getArrayBufferFromSrc";
import GLTFLoader from "../../GLTFLoader";
declare const parseFileGLB: (gltfLoader: GLTFLoader, callBack: any, onProgress: (info: LoadingProgressInfo) => void) => Promise<void>;
export default parseFileGLB;
