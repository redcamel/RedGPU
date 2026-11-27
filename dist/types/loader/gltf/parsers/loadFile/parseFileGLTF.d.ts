import GLTFLoader, { GLTFLoadingProgressInfo } from "../../GLTFLoader";
import { GLTFOnParsedCallback } from "../parseGLTF";
/**
 * [KO] `.gltf` JSON 파일을 로드·파싱하고 완료 시 콜백을 호출합니다.
 * [EN] Loads and parses a `.gltf` JSON file and invokes the completion callback.
 *
 * @param gltfLoader -
 * [KO] `GLTFLoader` 인스턴스
 * [EN] `GLTFLoader` instance
 * @param callBack -
 * [KO] 파싱 완료 콜백 (선택)
 * [EN] Callback invoked after parsing completes (optional)
 * @param onProgress -
 * [KO] 로딩 진행 콜백 (선택)
 * [EN] Loading progress callback (optional)
 * @param signal -
 * [KO] 로딩 취소용 `AbortSignal` (선택)
 * [EN] `AbortSignal` to cancel loading (optional)
 * @param onParsed -
 * [KO] 파싱 완료 메타데이터 전달 콜백 (선택)
 * [EN] Callback receiving parsed metadata upon completion (optional)
 * @returns
 * [KO] 파싱 완료 시 해결되는 `Promise<void>`
 * [EN] `Promise<void>` resolving when parsing completes
 * @category GLTF
 */
declare const parseFileGLTF: (gltfLoader: GLTFLoader, callBack?: () => void, onProgress?: (info: GLTFLoadingProgressInfo) => void, signal?: AbortSignal, onParsed?: GLTFOnParsedCallback) => Promise<void>;
export default parseFileGLTF;
