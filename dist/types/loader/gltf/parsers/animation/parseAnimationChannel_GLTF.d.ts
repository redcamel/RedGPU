import AnimationData_GLTF from "../../cls/AnimationData_GLTF";
import GLTFParseContext from "../../core/GLTFParseContext";
import { AnimationChannel, AnimationSampler, GLTF } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import { GLTFParsedSingleClip } from "./GLTFParsedSingleClip";
/**
 * [KO] glTF의 단일 애니메이션 채널 데이터를 파싱하여 트랙을 생성하고 클립에 추가합니다.
 * [EN] Parses a single glTF animation channel to create a track and adds it to the clip.
 *
 * @param gltfLoader -
 * [KO] `GLTFLoader` 인스턴스
 * [EN] `GLTFLoader` instance
 * @param parsedSingleClip -
 * [KO] 트랙이 추가될 파싱된 단일 애니메이션 클립 객체
 * [EN] Parsed single animation clip object to which the track is added
 * @param animationChannel -
 * [KO] 파싱할 glTF 애니메이션 채널 데이터
 * [EN] glTF animation channel data to parse
 * @param animationSamplers -
 * [KO] glTF 애니메이션 샘플러 배열
 * [EN] Array of glTF animation samplers
 * @param gltfData -
 * [KO] glTF 데이터 객체
 * [EN] glTF data object
 * @param animationDataCache -
 * [KO] 공유 액세서 `AnimationData_GLTF` 캐시 맵 (선택)
 * [EN] Optional cache map for shared `AnimationData_GLTF` accessors
 * @param parseContext -
 * [KO] 현재 파싱 세션의 `GLTFParseContext` 인스턴스 (선택)
 * [EN] Optional `GLTFParseContext` instance for the current parse session
 * @category GLTF
 */
declare const parseAnimationChannel_GLTF: (gltfLoader: GLTFLoader, parsedSingleClip: GLTFParsedSingleClip, animationChannel: AnimationChannel, animationSamplers: AnimationSampler[], gltfData: GLTF, animationDataCache?: Map<number, AnimationData_GLTF>, parseContext?: GLTFParseContext) => void;
export default parseAnimationChannel_GLTF;
