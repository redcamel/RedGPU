import { GLTF } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * [KO] GLTF 카메라 정의(`perspective` / `orthographic`)를 RedGPU 카메라 인스턴스로 변환하여 `gltfLoader.parsingResult.cameras`에 추가합니다.
 * [EN] Converts GLTF camera definitions (`perspective` / `orthographic`) into RedGPU camera instances and appends them to `gltfLoader.parsingResult.cameras`.
 *
 * [KO] 원근 카메라의 `yfov`는 radian에서 degree로 변환되며, 직교 카메라는 `xmag`/`ymag`/`znear`/`zfar`를 `OrthographicCamera` 경계로 매핑합니다.
 * [EN] For perspective cameras, `yfov` is converted from radians to degrees; for orthographic cameras, `xmag`/`ymag`/`znear`/`zfar` are mapped to `OrthographicCamera` bounds.
 *
 * @param gltfLoader -
 * [KO] 파싱 결과를 저장할 GLTFLoader 인스턴스
 * [EN] GLTFLoader instance that stores the parsing result
 * @param gltfData -
 * [KO] 파싱할 GLTF 데이터
 * [EN] GLTF data to parse
 * @category GLTF
 */
declare const parseCameras_GLTF: (gltfLoader: GLTFLoader, gltfData: GLTF) => void;
export default parseCameras_GLTF;
