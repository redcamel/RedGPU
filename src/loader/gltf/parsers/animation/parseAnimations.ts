import {GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import {ClipAnimState} from "../../animationLooper/AnimStateMachine";
import AnimationData_GLTF from "../../cls/AnimationData_GLTF";
import parseSingleChannel from "./parseAnimationChannel_GLTF";
import {GLTFParsedSingleClip} from "./GLTFParsedSingleClip";

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
 * @returns
 * [KO] 애니메이션 파싱이 완료되면 해결되는 `Promise<void>`
 * [EN] `Promise<void>` that resolves when animation parsing is complete
 * @category Loader
 */
const parseAnimations = async (gltfLoader: GLTFLoader, gltfData: GLTF): Promise<void> => {
    if (!gltfData.animations) gltfData.animations = [];
    const {animations: parsedAnimations} = gltfLoader.parsingResult;
    const {animations: allAnimations} = gltfData;
    const animLen = allAnimations.length;
    if (!animLen) return;

    const animationDataCache = new Map<number, AnimationData_GLTF>();
    for (let i = 0; i < animLen; i++) {
        const singleAnimationData = allAnimations[i];
        const {samplers, channels} = singleAnimationData;
        const parsedSingleClip = new GLTFParsedSingleClip(singleAnimationData['name']);
        const clipState = new ClipAnimState(parsedSingleClip.name, parsedSingleClip);
        parsedAnimations.push(clipState);
        for (let c = 0, chLen = channels.length; c < chLen; c++) {
            parseSingleChannel(gltfLoader, parsedSingleClip, channels[c], samplers, gltfData, animationDataCache);
        }
    }
    for (let i = 0, len = parsedAnimations.length; i < len; i++) {
        gltfLoader.playAnimation(parsedAnimations[i]);
    }
};
export default parseAnimations;
