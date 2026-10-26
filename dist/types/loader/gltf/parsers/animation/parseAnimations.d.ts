import { GLTF } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
/**
 * [KO] GLTF 데이터의 전체 애니메이션 클립 및 채널들을 비동기로 파싱합니다.
 * [EN] Asynchronously parses all animation clips and channels in the GLTF data.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param gltfData -
 * [KO] 애니메이션 정보를 포함한 GLTF 데이터 객체
 * [EN] GLTF data object containing animation information
 * @returns
 * [KO] 애니메이션 파싱이 완료되면 해결되는 `Promise<void>`
 * [EN] `Promise<void>` that resolves when animation parsing is complete
 * @category Loader
 */
declare const parseAnimations: (gltfLoader: GLTFLoader, gltfData: GLTF) => Promise<void>;
export default parseAnimations;
