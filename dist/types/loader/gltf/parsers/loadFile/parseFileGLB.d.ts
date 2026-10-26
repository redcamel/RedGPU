import GLTFLoader, { GLTFLoadingProgressInfo } from "../../GLTFLoader";
/**
 * [KO] GLB 파일을 로드 및 파싱하고 완료 시 콜백 함수를 호출합니다.
 * [EN] Loads and parses a GLB file and invokes the callback function upon completion.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param callBack -
 * [KO] 파싱 완료 후 호출될 콜백 함수
 * [EN] Callback function invoked after parsing is complete
 * @param onProgress -
 * [KO] 로딩 진행 상태를 전달받는 콜백 함수
 * [EN] Optional callback function receiving loading progress information
 * @returns
 * [KO] 파싱이 완료되면 해결되는 `Promise<void>`
 * [EN] `Promise<void>` that resolves when parsing is complete
 * @category Loader
 */
declare const parseFileGLB: (gltfLoader: GLTFLoader, callBack: any, onProgress?: (info: GLTFLoadingProgressInfo) => void) => Promise<void>;
export default parseFileGLB;
