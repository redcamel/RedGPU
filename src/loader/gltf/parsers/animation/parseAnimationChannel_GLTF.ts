import Mesh from "../../../../display/mesh/Mesh";
import parseAnimationInfo_GLTF from "../../cls/AnimationData_GLTF";
import AniTrack_GLTF from "../../cls/anitrack/AniTrack_GLTF";
import {AnimationChannel, AnimationSampler, GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import {GLTFParsedSingleClip} from "./parseAnimations";

/**
 * Parse a single animation channel for GLTF.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader instance.
 * @param {GLTFParsedSingleClip} parsedSingleClip - The parsed single clip data.
 * @param {AnimationChannel} animationChannel - The animation channel to parse.
 * @param {AnimationSampler[]} animationSamplers - An array of animation samplers.
 * @param {GLTF} gltfData - The GLTF data.
 */
const parseAnimationChannel_GLTF = (
	gltfLoader: GLTFLoader,
	parsedSingleClip: GLTFParsedSingleClip,
	animationChannel: AnimationChannel,
	animationSamplers: AnimationSampler[],
	gltfData: GLTF
) => {
	let tMesh: Mesh;
	let aniTrack: AniTrack_GLTF; //
	const {nodes: NODES, meshes: MESHES} = gltfData
	const targetMeshes = [];
	const {sampler: channelSamplerGlTfId, target: channelTarget} = animationChannel
	const tSampler = animationSamplers[channelSamplerGlTfId];
	const {node: channelTargetDataNodeGlTfId, path: channelTargetDataPath} = channelTarget
	const tNode = NODES[channelTargetDataNodeGlTfId];
	if ('mesh' in tNode) {
		tMesh = tNode['Mesh'];
		const {primitives} = MESHES[tNode.mesh];
		let i = primitives.length;
		while (i--) {
			targetMeshes.push(primitives[i]['Mesh']);
		}
	} else {
		let tGroup;
		if (gltfLoader.parsingResult.groups[channelTargetDataNodeGlTfId]) {
			tGroup = gltfLoader.parsingResult.groups[channelTargetDataNodeGlTfId];
			tMesh = tGroup;
			// console.log('tGroup', tGroup)
		} else return console.log('여기로 오는경우가 있는건가2');
	}
	if (
		channelTargetDataPath == 'scale'
		|| channelTargetDataPath == 'rotation'
		|| channelTargetDataPath == 'translation'
		|| channelTargetDataPath == 'weights'
	) {
		// console.log('path', tChannelTargetDataPath)
		// // 시간축은 샘플의 input
		// console.log('시간축', tSampler['input'])
		// console.log('시간엑세서 데이터', tSampler['input'])
		// console.log('시간축 데이터리스트', animationData['time'])
		// // 로테이션 축은 샘플의 output
		// console.log('translation', tSampler['output'])
		// console.log('translation 엑세서 데이터', tSampler['output'])
		// console.log('scale 데이터리스트', t0)
		aniTrack = new AniTrack_GLTF(
			channelTargetDataPath,
			new parseAnimationInfo_GLTF(gltfLoader, gltfData, tSampler.input),
			new parseAnimationInfo_GLTF(gltfLoader, gltfData, tSampler.output),
			tSampler.interpolation,
			tMesh,
			targetMeshes
		)
		parsedSingleClip.push(aniTrack);
	} else {
		console.log('파싱할수없는 데이터', channelTargetDataPath);
	}
	if (aniTrack) {
		const {timeAnimationInfo} = aniTrack
		const {dataList} = timeAnimationInfo
		if (parsedSingleClip.minTime > dataList[0]) parsedSingleClip.minTime = dataList[0];
		if (parsedSingleClip.maxTime < dataList[dataList.length - 1]) parsedSingleClip.maxTime = dataList[dataList.length - 1];
	}
};
export default parseAnimationChannel_GLTF
