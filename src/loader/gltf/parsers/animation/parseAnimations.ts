import {GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import {ClipAnimState} from "../../animationLooper/AnimStateMachine";
import parseSingleChannel from "./parseAnimationChannel_GLTF";
import {GLTFParsedSingleClip} from "./GLTFParsedSingleClip";

// re-export for backward compatibility
export {GLTFParsedSingleClip} from "./GLTFParsedSingleClip";

/**
 * Parses animation data for a given GLTF scene.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader used for loading the scene data.
 * @param {GLTF} gltfData - The GLTF scene data containing animations to be parsed.
 * @returns {Promise<void>} - A promise that resolves when the animation data has been parsed.
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
        }
        resolve();
    });
};
export default parseAnimations;
