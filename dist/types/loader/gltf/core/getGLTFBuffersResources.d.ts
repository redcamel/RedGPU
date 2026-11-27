import { GLTF } from "../GLTF";
import GLTFLoader, { GLTFLoadingProgressInfo } from "../GLTFLoader";
/**
 * [KO] glTF 데이터에 정의된 모든 버퍼 리소스를 로드하고 `DataView`로 변환하여 저장합니다.
 * [EN] Loads all buffer resources defined in the glTF data, converts them into `DataView` instances, and stores them.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param gltfData -
 * [KO] 파싱된 glTF 데이터 객체
 * [EN] Parsed glTF data object
 * @param callback -
 * [KO] 모든 버퍼 로드 완료 콜백 (선택)
 * [EN] Callback invoked when all buffers finish loading (optional)
 * @param onProgress -
 * [KO] 버퍼 로딩 진행률 갱신 콜백 (선택)
 * [EN] Callback invoked when buffer loading progress updates (optional)
 * @param onError -
 * [KO] 로드 에러 콜백 (선택)
 * [EN] Error callback (optional)
 * @param signal -
 * [KO] 로딩 취소용 `AbortSignal` (선택)
 * [EN] `AbortSignal` to cancel loading (optional)
 * @param outBuffers -
 * [KO] 로드된 `DataView`를 기록할 대상 배열 (선택)
 * [EN] Target array to store loaded `DataView` instances (optional)
 * @category GLTF
 */
declare const getGLTFBuffersResources: (gltfLoader: GLTFLoader, gltfData: GLTF, callback?: () => void, onProgress?: (info: GLTFLoadingProgressInfo) => void, onError?: (error: unknown) => void, signal?: AbortSignal, outBuffers?: DataView[]) => void;
export default getGLTFBuffersResources;
