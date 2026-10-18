import {GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import {ClipAnimState} from "../../animationLooper/AnimStateMachine";
import parseSingleChannel from "./parseAnimationChannel_GLTF";
import {GLTFParsedSingleClip} from "./GLTFParsedSingleClip";

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
const parseAnimations = (gltfLoader: GLTFLoader, gltfData: GLTF) => {
    return new Promise<void>(async resolve => {
        if (!gltfData.animations) gltfData.animations = [];
        const {parsingResult} = gltfLoader
        const {animations: parsedAnimations} = parsingResult;
        const {animations: allAnimations} = gltfData;
        if (allAnimations.length) {
            const allPromises = allAnimations.map(async (singleAnimationData) => {
                const {samplers, channels} = singleAnimationData;
                const parsedSingleClip = new GLTFParsedSingleClip(singleAnimationData['name']);
                const clipState = new ClipAnimState(parsedSingleClip.name, parsedSingleClip);
                parsedAnimations.push(clipState);
                await Promise.all(channels.map(async (animationChannel) => {
                    return parseSingleChannel(gltfLoader, parsedSingleClip, animationChannel, samplers, gltfData);
                }));
            });
            await Promise.all(allPromises);
            if (parsedAnimations.length) {
                parsedAnimations.forEach(clipState => gltfLoader.playAnimation(clipState));
            }
        }
        resolve();
    });
};
export default parseAnimations;
