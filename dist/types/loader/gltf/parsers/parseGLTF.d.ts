import { MaterialVariantEntry } from "../core/materialVariantsHelper";
import { GLTF } from "../GLTF";
import GLTFLoader, { GLTFLoadingProgressInfo } from "../GLTFLoader";
/**
 * [KO] glTF 파싱 완료 시 파싱된 데이터와 Material Variants 정보를 전달받는 내부 콜백 타입입니다.
 * [EN] Internal callback type receiving parsed glTF data and Material Variants info upon completion.
 *
 * @category GLTF
 */
export type GLTFOnParsedCallback = (gltfData: GLTF, materialVariants: string[], materialVariantEntries: MaterialVariantEntry[]) => void;
/**
 * [KO] glTF 데이터를 프레임 단위로 분산 파싱하여 버퍼, 씬, 카메라, 텍스처, 애니메이션 리소스를 순차적으로 구성합니다.
 * [EN] Parses glTF data across frames via a flat async/await pipeline to sequentially construct buffers, scenes, cameras, textures, and animation resources.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param gltfData -
 * [KO] 파싱할 원본 `GLTF` 데이터 객체
 * [EN] Source `GLTF` data object to parse
 * @param callBack -
 * [KO] 전체 파싱 및 리소스 로딩 완료 시 호출할 콜백 함수 (선택)
 * [EN] Callback function invoked when all parsing and resource loading complete (optional)
 * @param onProgress -
 * [KO] 로딩 진행 상태를 전달받는 콜백 함수 (선택)
 * [EN] Callback function receiving loading progress information (optional)
 * @param signal -
 * [KO] 로딩 취소를 제어할 `AbortSignal` (선택)
 * [EN] Optional `AbortSignal` to cancel loading
 * @param onParsed -
 * [KO] 파싱 완료 메타데이터 전달 콜백 (선택)
 * [EN] Optional callback receiving parsed metadata
 * @category GLTF
 */
declare const parseGLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, callBack?: () => void, onProgress?: (info: GLTFLoadingProgressInfo) => void, signal?: AbortSignal, onParsed?: GLTFOnParsedCallback) => Promise<void>;
export default parseGLTF;
