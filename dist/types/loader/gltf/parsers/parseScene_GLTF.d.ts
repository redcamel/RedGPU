import GLTFParseContext from "../core/GLTFParseContext";
import { GLTF } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * [KO] GLTF 데이터의 기본 씬(Scene)을 2-Pass(Pass 1: 노드·메쉬 생성, Pass 2: 스킨 일괄 링크)로 파싱합니다.
 * [EN] Parses the default scene of GLTF data in 2 passes (Pass 1: node/mesh construction, Pass 2: deferred skin binding).
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param gltfData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스
 * [EN] `GLTFParseContext` instance for the current parse session
 * @category GLTF
 */
declare const parseScene_GLTF: (gltfLoader: GLTFLoader, gltfData: GLTF, parseContext: GLTFParseContext) => void;
export default parseScene_GLTF;
