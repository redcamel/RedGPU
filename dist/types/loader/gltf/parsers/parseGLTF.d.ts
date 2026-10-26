import { GLTF } from "../GLTF";
import GLTFLoader, { GLTFLoadingProgressInfo } from "../GLTFLoader";
/**
 * [KO] glTF 데이터를 프레임 단위로 분산 파싱하여 버퍼, 씬, 카메라, 텍스처, 애니메이션 리소스를 순차적으로 구성합니다.
 * [EN] Parses glTF data across multiple frames to sequentially construct buffers, scenes, cameras, textures, and animation resources.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param gltfData -
 * [KO] 파싱할 원본 `GLTF` 데이터 객체
 * [EN] Source `GLTF` data object to parse
 * @param callBack -
 * [KO] 전체 파싱 및 리소스 로딩 완료 시 호출할 콜백 함수
 * [EN] Callback function invoked when all parsing and resource loading complete
 * @param onProgress -
 * [KO] 로딩 진행 상태를 전달받는 콜백 함수 (선택)
 * [EN] Callback function receiving loading progress information (optional)
 * @category GLTF
 */
declare const parseGLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, callBack: any, onProgress?: (info: GLTFLoadingProgressInfo) => void) => void;
export default parseGLTF;
