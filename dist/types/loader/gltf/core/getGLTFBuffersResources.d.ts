import { GLTF } from "../GLTF";
import GLTFLoader, { GLTFLoadingProgressInfo } from "../GLTFLoader";
/**
 * [KO] glTF 데이터에 정의된 모든 버퍼 리소스를 로드하고 `DataView`로 변환하여 저장합니다.
 * [EN] Loads all buffer resources defined in the glTF data, converts them into `DataView` instances, and stores them.
 *
 * @param gltfLoader -
 * [KO] 대상 GLTF 로더 인스턴스
 * [EN] Target GLTF loader instance
 * @param gltfData -
 * [KO] 파싱된 glTF 데이터 객체
 * [EN] Parsed glTF data object
 * @param callback -
 * [KO] 모든 버퍼 로드가 완료되었을 때 호출될 콜백 함수
 * [EN] Callback function invoked when all buffers have finished loading
 * @param onProgress -
 * [KO] 버퍼 로딩 진행 상태가 갱신될 때 호출될 콜백 함수
 * [EN] Callback function invoked when buffer loading progress updates
 * @category GLTF
 */
declare const getGLTFBuffersResources: (gltfLoader: GLTFLoader, gltfData: GLTF, callback: any, onProgress: (info: GLTFLoadingProgressInfo) => void) => void;
export default getGLTFBuffersResources;
