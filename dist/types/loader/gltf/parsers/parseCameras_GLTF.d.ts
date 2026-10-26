import { GLTF } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * [KO] GLTF 카메라 정의를 PerspectiveCamera로 변환하여 `gltfLoader.parsingResult.cameras`에 추가합니다.
 * [EN] Converts GLTF camera definitions into PerspectiveCamera instances and appends them to `gltfLoader.parsingResult.cameras`.
 *
 * [KO] `yfov`는 radian에서 degree로 변환되며, orthographic 타입은 현재 기본 PerspectiveCamera로 생성됩니다.
 * [EN] `yfov` is converted from radians to degrees, and the orthographic type is currently created as a default PerspectiveCamera.
 *
 * @param gltfLoader -
 * [KO] 파싱 결과를 저장할 GLTFLoader 인스턴스
 * [EN] GLTFLoader instance that stores the parsing result
 * @param gltfData -
 * [KO] 파싱할 GLTF 데이터
 * [EN] GLTF data to parse
 */
declare const parseCameras_GLTF: (gltfLoader: GLTFLoader, gltfData: GLTF) => void;
export default parseCameras_GLTF;
