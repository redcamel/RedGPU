import { GLTF } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import GLTFParseContext from "../../core/GLTFParseContext";
/**
 * [KO] GLTF 데이터의 전체 애니메이션 클립 및 채널들을 파싱합니다.
 * [EN] Parses all animation clips and channels in the GLTF data.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param gltfData -
 * [KO] 애니메이션 정보를 포함한 GLTF 데이터 객체
 * [EN] GLTF data object containing animation information
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스 (선택)
 * [EN] Optional `GLTFParseContext` instance for the current parse session
 * @returns
 * [KO] 애니메이션 파싱이 완료되면 해결되는 `Promise<void>`
 * [EN] `Promise<void>` that resolves when animation parsing is complete
 * @category GLTF
 */
declare const parseAnimations: (gltfLoader: GLTFLoader, gltfData: GLTF, parseContext?: GLTFParseContext) => Promise<void>;
export default parseAnimations;
