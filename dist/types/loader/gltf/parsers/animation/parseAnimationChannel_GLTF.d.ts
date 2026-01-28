import { AnimationChannel, AnimationSampler, GLTF } from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import { GLTFParsedSingleClip } from "./parseAnimations";
/**
 * Parse a single animation channel for GLTF.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader instance.
 * @param {GLTFParsedSingleClip} parsedSingleClip - The parsed single clip data.
 * @param {AnimationChannel} animationChannel - The animation channel to parse.
 * @param {AnimationSampler[]} animationSamplers - An array of animation samplers.
 * @param {GLTF} gltfData - The GLTF data.
 */
declare const parseAnimationChannel_GLTF: (gltfLoader: GLTFLoader, parsedSingleClip: GLTFParsedSingleClip, animationChannel: AnimationChannel, animationSamplers: AnimationSampler[], gltfData: GLTF) => void;
export default parseAnimationChannel_GLTF;
