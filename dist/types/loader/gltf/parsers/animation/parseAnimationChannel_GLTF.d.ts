import { AnimationChannel, AnimationSampler, GLTF } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import { GLTFParsedSingleClip } from "./GLTFParsedSingleClip";
/**
 * [KO] GLTF의 단일 애니메이션 채널 데이터를 파싱하여 트랙을 생성하고 클립에 추가합니다.
 * [EN] Parses a single GLTF animation channel to create a track and adds it to the clip.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param parsedSingleClip -
 * [KO] 트랙이 추가될 파싱된 단일 애니메이션 클립 객체
 * [EN] Parsed single animation clip object to which the track will be added
 * @param animationChannel -
 * [KO] 파싱할 GLTF 애니메이션 채널 데이터
 * [EN] GLTF animation channel data to parse
 * @param animationSamplers -
 * [KO] GLTF 애니메이션 샘플러 배열
 * [EN] Array of GLTF animation samplers
 * @param gltfData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @category Loader
 */
declare const parseAnimationChannel_GLTF: (gltfLoader: GLTFLoader, parsedSingleClip: GLTFParsedSingleClip, animationChannel: AnimationChannel, animationSamplers: AnimationSampler[], gltfData: GLTF) => void;
export default parseAnimationChannel_GLTF;
