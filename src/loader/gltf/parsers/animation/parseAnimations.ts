import {GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import parseSingleChannel from "./parseAnimationChannel_GLTF";

export interface GLTFParsedSingleClip {
	minTime: number;
	maxTime: number;
	name: string;

	[key: string]: any; // for additional properties
}

/**
 * Parses animation data for a given GLTF scene.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader used for loading the scene data.
 * @param {GLTF} gltfData - The GLTF scene data containing animations to be parsed.
 * @returns {Promise<void>} - A promise that resolves when the animation data has been parsed.
 */
const parseAnimations = (gltfLoader: GLTFLoader, gltfData: GLTF) => {
	return new Promise<void>(async resolve => {
		// console.log('Animation parsing has start.');
		if (!gltfData.animations) gltfData.animations = [];
		const {parsingResult} = gltfLoader
		const {animations: parsedAnimations} = parsingResult;
		const {animations: allAnimations} = gltfData;
		if (allAnimations.length) {
			// console.log(allAnimations);
			const allPromises = allAnimations.map(async (singleAnimationData) => {
				// console.log('Check', singleAnimationData);
				const {samplers, channels} = singleAnimationData;
				// @ts-ignore
				const parsedSingleClip: GLTFParsedSingleClip = []; //TODO 타입정의 해야함
				parsedSingleClip.minTime = 10000000;
				parsedSingleClip.maxTime = -1;
				parsedSingleClip.name = singleAnimationData['name'];
				parsedAnimations.push(parsedSingleClip);
				await Promise.all(channels.map(async (animationChannel) => {
					return parseSingleChannel(gltfLoader, parsedSingleClip, animationChannel, samplers, gltfData);
				}));
				// console.log('singleClip', parsedSingleClip);
			});
			await Promise.all(allPromises);
			if (parsedAnimations.length) {
				// console.log('Animation parsing has ended.');
				parsedAnimations.forEach(animation => gltfLoader.playAnimation(animation));
			}
		}
		resolve();
	});
};
export default parseAnimations;
