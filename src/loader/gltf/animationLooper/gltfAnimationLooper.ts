import {keepLog} from "../../../utils";
import AniTrack_GLTF from "../cls/AniTrack_GLTF";
import {GLTFParsedSingleClip} from "../parsers/animation/parseAnimations";
import gltfAnimationLooper_rotation from "./gltfAnimationLooper_rotation";
import gltfAnimationLooper_scale from "./gltfAnimationLooper_scale";
import gltfAnimationLooper_transition from "./gltfAnimationLooper_transition";
import gltfAnimationLooper_weight from "./gltfAnimationLooper_weight";

const gltfAnimationLooper = (time: number, animationLoopList: GLTFParsedSingleClip[]) => {
	let currentTime: number, previousTimeFrame: number, nextTimeFrame: number;
	let animationListIndex: number = animationLoopList.length;
	let interpolationValue: number;
	let targetAniTrackIDX: number;
	let targetAnimationTrackList: AniTrack_GLTF[];
	let loopListItem: GLTFParsedSingleClip;
	let currentAniTrack: AniTrack_GLTF;
	//
	let nextTimeDataIDX: number, previousTimeDataIDX: number;
	let targetTimeDataList: number[];
	let targetAnimationDataList: number[];
	let targetTimeDataListLength: number;
	let targetTimeDataIDX: number;
	// console.log('animationLoopList',animationLoopList)
	while (animationListIndex--) {
		loopListItem = animationLoopList[animationListIndex];
		targetAnimationTrackList = loopListItem.targetAniTrackList;
		// console.log('loopListItem', loopListItem)
		targetAniTrackIDX = targetAnimationTrackList.length;
		// console.log('targetAniTrackIDX',targetAniTrackIDX)
		while (targetAniTrackIDX--) {
			currentAniTrack = targetAnimationTrackList[targetAniTrackIDX];
			const {animationTargetMesh, timeAnimationInfo, aniDataAnimationInfo, weightMeshes} = currentAniTrack
			currentTime = ((time - loopListItem.startTime) % (targetAnimationTrackList['maxTime'] * 1000)) / 1000;
			/////////////////////////////////////////////////////////////////////////////////
			targetTimeDataList = timeAnimationInfo.dataList;
			targetAnimationDataList = aniDataAnimationInfo.dataList;
			targetTimeDataListLength = targetTimeDataList.length;
			targetTimeDataIDX = 0;
			previousTimeDataIDX = targetTimeDataList.length - 1;
			nextTimeDataIDX = 0;
			previousTimeFrame = targetTimeDataList[previousTimeDataIDX];
			nextTimeFrame = targetTimeDataList[nextTimeDataIDX];
			for (targetTimeDataIDX; targetTimeDataIDX < targetTimeDataListLength; targetTimeDataIDX++) {
				const targetTime = targetTimeDataList[targetTimeDataIDX];
				if (targetTime < currentTime) {
					previousTimeDataIDX = targetTimeDataIDX;
					previousTimeFrame = targetTimeDataList[previousTimeDataIDX];
					if (targetTimeDataList[previousTimeDataIDX + 1] == undefined) nextTimeDataIDX = 0;
					else nextTimeDataIDX = previousTimeDataIDX + 1;
					nextTimeFrame = targetTimeDataList[nextTimeDataIDX];
				}
				// resetTimeFrameAtStart
				if (targetTimeDataIDX == 0 && (currentTime < targetTime)) {
					previousTimeDataIDX = targetTimeDataListLength - 1;
					previousTimeFrame = targetTimeDataList[previousTimeDataIDX];
					nextTimeDataIDX = targetTimeDataIDX;
					nextTimeFrame = targetTimeDataList[nextTimeDataIDX];
					currentTime = targetTime;
					break;
				}
				//resetTimeFrameAtEnd
				if (targetTimeDataIDX == targetTimeDataListLength - 1 && (currentTime > targetTime)) {
					previousTimeDataIDX = 0;
					previousTimeFrame = targetTimeDataList[previousTimeDataIDX];
					nextTimeDataIDX = targetTimeDataListLength - 1;
					nextTimeFrame = targetTimeDataList[nextTimeDataIDX];
					currentTime = targetTime;
					break;
				}
			}
			/////////////////////////////////////////////////////////////////////////////////
			let p: number
			let pp: number
			let ppp: number
			let s0: number, s1: number, s2: number, s3: number
			if (currentAniTrack.interpolation == 'CUBICSPLINE') {
				interpolationValue = nextTimeFrame - previousTimeFrame;
				if (interpolationValue.toString() == 'NaN') interpolationValue = 0;
				p = (currentTime - previousTimeFrame) / interpolationValue;
				if (p.toString() == 'NaN') p = 0;
				pp = p * p;
				ppp = pp * p;
				s2 = -2 * ppp + 3 * pp;
				s3 = ppp - pp;
				s0 = 1 - s2;
				s1 = s3 - pp + p;
			} else {
				if (currentAniTrack.interpolation == 'STEP') interpolationValue = 0;
				else interpolationValue = (currentTime - previousTimeFrame) / (nextTimeFrame - previousTimeFrame);
				if (interpolationValue.toString() == 'NaN') interpolationValue = 0;
			}
			// if (animationTargetMesh) {}
			// keepLog(currentAniTrack.key)
			switch (currentAniTrack.key) {
				case 'rotation' :
					gltfAnimationLooper_rotation(
						currentAniTrack.interpolation,
						animationTargetMesh,
						targetAnimationDataList,
						targetTimeDataListLength,
						interpolationValue,
						previousTimeDataIDX,
						nextTimeDataIDX,
						s0, s1, s2, s3
					)
					break;
				case 'translation' :
					gltfAnimationLooper_transition(
						currentAniTrack.interpolation,
						animationTargetMesh,
						targetAnimationDataList,
						targetTimeDataListLength,
						interpolationValue,
						previousTimeDataIDX,
						nextTimeDataIDX,
						s0, s1, s2, s3
					)
					break;
				case 'scale' :
					gltfAnimationLooper_scale(
						currentAniTrack.interpolation,
						animationTargetMesh,
						targetAnimationDataList,
						targetTimeDataListLength,
						interpolationValue,
						previousTimeDataIDX,
						nextTimeDataIDX,
						s0, s1, s2, s3
					)
					break;
				case 'weights' :
					gltfAnimationLooper_weight(
						weightMeshes,
						targetAnimationDataList,
						interpolationValue,
						previousTimeDataIDX,
						nextTimeDataIDX
					)
					break;
			}
		}
	}
}
export default gltfAnimationLooper
