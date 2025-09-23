import {glMatrix} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import AniTrack_GLTF from "../cls/anitrack/AniTrack_GLTF";
import {PlayAnimationInfo} from "../GLTFLoader";
import {GLTFParsedSingleClip} from "../parsers/animation/parseAnimations";

const gltfAnimationLooper = (
	redGPUContext:RedGPUContext,time: number,	computePassEncoder: GPUComputePassEncoder, playAnimationInfoList: PlayAnimationInfo[],

) => {
// 사전 계산된 상수들
	const EPSILON = glMatrix.EPSILON;
	const PI_180 = 180 / Math.PI;
	let tempX, tempY, tempZ, tempW, tempLen, tempInvLen;
	let prevX, prevY, prevZ, prevW, nextX, nextY, nextZ, nextW;
	let cosom, omega, sinom, scale0, scale1;
	let x2, y2, z2, xx, xy, xz, yy, yz, zz, wx, wy, wz;
	let m11, m12, m13, m22, m23, m32, m33;
	let prevIdx, nextIdx
	let nX, nY, nZ, pX, pY, pZ;
	let nXOut, nYOut, nZOut, pXOut, pYOut, pZOut;
	let startOut, endIn;
	let currentTime: number, previousTimeFrame: number, nextTimeFrame: number;
	let playAnimationInfoIDX: number = playAnimationInfoList.length;
	let interpolationValue: number;
	let targetAniTrackIDX: number;
	let targetClip: GLTFParsedSingleClip;
	let targetPlayAnimationInfo: PlayAnimationInfo;
	let currentAniTrack: AniTrack_GLTF;
	//
	let nextTimeDataIDX: number, previousTimeDataIDX: number;
	let targetTimeDataList: number[];
	let targetAnimationDataList: number[];
	let targetTimeDataListLength: number;
	let targetTimeDataIDX: number;
	// console.log('playAnimationInfoList',playAnimationInfoList)
	while (playAnimationInfoIDX--) {
		targetPlayAnimationInfo = playAnimationInfoList[playAnimationInfoIDX];
		targetClip = targetPlayAnimationInfo.targetGLTFParsedSingleClip;
		// console.log('loopListItem', loopListItem)
		targetAniTrackIDX = targetClip.length;
		// console.log('targetAniTrackIDX',targetAniTrackIDX)
		while (targetAniTrackIDX--) {
			currentAniTrack = targetClip[targetAniTrackIDX];
			const {animationTargetMesh, timeAnimationInfo, aniDataAnimationInfo, weightMeshes} = currentAniTrack
			currentTime = ((time - targetPlayAnimationInfo.startTime) % (targetClip['maxTime'] * 1000)) / 1000;
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
			const interpolation = currentAniTrack.interpolation;
			const isCUBICSPLINE = interpolation == 'CUBICSPLINE'
			if (isCUBICSPLINE) {
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
				if (interpolation == 'STEP') interpolationValue = 0;
				else interpolationValue = (currentTime - previousTimeFrame) / (nextTimeFrame - previousTimeFrame);
				if (interpolationValue.toString() == 'NaN') interpolationValue = 0;
			}
			// if (animationTargetMesh) {}
			switch (currentAniTrack.key) {
				case 'rotation' : {
					if (previousTimeDataIDX !== targetTimeDataListLength - 1) {
						if (interpolation === 'CUBICSPLINE') {
							prevIdx = previousTimeDataIDX * 12;
							nextIdx = nextTimeDataIDX * 12;
							// 이전 키프레임 quaternion 정규화
							tempX = targetAnimationDataList[prevIdx + 4];
							tempY = targetAnimationDataList[prevIdx + 5];
							tempZ = targetAnimationDataList[prevIdx + 6];
							tempW = targetAnimationDataList[prevIdx + 7];
							tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
							if (tempLen > 0) {
								tempInvLen = 1 / Math.sqrt(tempLen);
								prevX = tempX * tempInvLen;
								prevY = tempY * tempInvLen;
								prevZ = tempZ * tempInvLen;
								prevW = tempW * tempInvLen;
							} else {
								prevX = prevY = prevZ = 0;
								prevW = 1;
							}
							// 이전 아웃 탄젠트 정규화
							tempX = targetAnimationDataList[prevIdx + 8];
							tempY = targetAnimationDataList[prevIdx + 9];
							tempZ = targetAnimationDataList[prevIdx + 10];
							tempW = targetAnimationDataList[prevIdx + 11];
							tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
							let prevOutX, prevOutY, prevOutZ, prevOutW;
							if (tempLen > 0) {
								tempInvLen = 1 / Math.sqrt(tempLen);
								prevOutX = tempX * tempInvLen;
								prevOutY = tempY * tempInvLen;
								prevOutZ = tempZ * tempInvLen;
								prevOutW = tempW * tempInvLen;
							} else {
								prevOutX = prevOutY = prevOutZ = 0;
								prevOutW = 1;
							}
							// 다음 인 탄젠트 정규화
							tempX = targetAnimationDataList[nextIdx];
							tempY = targetAnimationDataList[nextIdx + 1];
							tempZ = targetAnimationDataList[nextIdx + 2];
							tempW = targetAnimationDataList[nextIdx + 3];
							tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
							let nextInX, nextInY, nextInZ, nextInW;
							if (tempLen > 0) {
								tempInvLen = 1 / Math.sqrt(tempLen);
								nextInX = tempX * tempInvLen;
								nextInY = tempY * tempInvLen;
								nextInZ = tempZ * tempInvLen;
								nextInW = tempW * tempInvLen;
							} else {
								nextInX = nextInY = nextInZ = 0;
								nextInW = 1;
							}
							// 다음 키프레임 quaternion 정규화
							tempX = targetAnimationDataList[nextIdx + 4];
							tempY = targetAnimationDataList[nextIdx + 5];
							tempZ = targetAnimationDataList[nextIdx + 6];
							tempW = targetAnimationDataList[nextIdx + 7];
							tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
							if (tempLen > 0) {
								tempInvLen = 1 / Math.sqrt(tempLen);
								nextX = tempX * tempInvLen;
								nextY = tempY * tempInvLen;
								nextZ = tempZ * tempInvLen;
								nextW = tempW * tempInvLen;
							} else {
								nextX = nextY = nextZ = 0;
								nextW = 1;
							}
							// Cubic spline 보간
							tempX = s0 * prevX + s1 * prevOutX * interpolationValue + s2 * nextX + s3 * nextInX * interpolationValue;
							tempY = s0 * prevY + s1 * prevOutY * interpolationValue + s2 * nextY + s3 * nextInY * interpolationValue;
							tempZ = s0 * prevZ + s1 * prevOutZ * interpolationValue + s2 * nextZ + s3 * nextInZ * interpolationValue;
							tempW = s0 * prevW + s1 * prevOutW * interpolationValue + s2 * nextW + s3 * nextInW * interpolationValue;
						} else {
							// Linear/Step 보간
							prevIdx = previousTimeDataIDX * 4;
							nextIdx = nextTimeDataIDX * 4;
							// 이전 키프레임 quaternion 정규화
							tempX = targetAnimationDataList[prevIdx];
							tempY = targetAnimationDataList[prevIdx + 1];
							tempZ = targetAnimationDataList[prevIdx + 2];
							tempW = targetAnimationDataList[prevIdx + 3];
							tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
							if (tempLen > 0) {
								tempInvLen = 1 / Math.sqrt(tempLen);
								prevX = tempX * tempInvLen;
								prevY = tempY * tempInvLen;
								prevZ = tempZ * tempInvLen;
								prevW = tempW * tempInvLen;
							} else {
								prevX = prevY = prevZ = 0;
								prevW = 1;
							}
							// 다음 키프레임 quaternion 정규화
							tempX = targetAnimationDataList[nextIdx];
							tempY = targetAnimationDataList[nextIdx + 1];
							tempZ = targetAnimationDataList[nextIdx + 2];
							tempW = targetAnimationDataList[nextIdx + 3];
							tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
							if (tempLen > 0) {
								tempInvLen = 1 / Math.sqrt(tempLen);
								nextX = tempX * tempInvLen;
								nextY = tempY * tempInvLen;
								nextZ = tempZ * tempInvLen;
								nextW = tempW * tempInvLen;
							} else {
								nextX = nextY = nextZ = 0;
								nextW = 1;
							}
							// SLERP 보간
							cosom = prevX * nextX + prevY * nextY + prevZ * nextZ + prevW * nextW;
							// 최단 경로 선택
							if (cosom < 0) {
								cosom = -cosom;
								nextX = -nextX;
								nextY = -nextY;
								nextZ = -nextZ;
								nextW = -nextW;
							}
							if ((1 - cosom) > EPSILON) {
								omega = Math.acos(cosom);
								sinom = Math.sin(omega);
								scale0 = Math.sin((1 - interpolationValue) * omega) / sinom;
								scale1 = Math.sin(interpolationValue * omega) / sinom;
							} else {
								scale0 = 1 - interpolationValue;
								scale1 = interpolationValue;
							}
							tempX = scale0 * prevX + scale1 * nextX;
							tempY = scale0 * prevY + scale1 * nextY;
							tempZ = scale0 * prevZ + scale1 * nextZ;
							tempW = scale0 * prevW + scale1 * nextW;
						}
						// Quaternion to Euler 변환
						x2 = tempX + tempX;
						y2 = tempY + tempY;
						z2 = tempZ + tempZ;
						xx = tempX * x2;
						xy = tempX * y2;
						xz = tempX * z2;
						yy = tempY * y2;
						yz = tempY * z2;
						zz = tempZ * z2;
						wx = tempW * x2;
						wy = tempW * y2;
						wz = tempW * z2;
						// 직접 오일러 각도 계산
						m13 = xz + wy;
						m11 = 1 - (yy + zz);
						m12 = xy - wz;
						m23 = yz - wx;
						m33 = 1 - (xx + yy);
						m32 = yz + wx;
						m22 = 1 - (xx + zz);
						tempY = Math.asin(Math.max(-1, Math.min(1, m13)));
						if (Math.abs(m13) < 0.99999) {
							tempX = Math.atan2(-m23, m33);
							tempZ = Math.atan2(-m12, m11);
						} else {
							tempX = Math.atan2(m32, m22);
							tempZ = 0;
						}
						// 라디안을 도로 변환하고 결과 적용 (한 번에)
						animationTargetMesh.rotationX = -(tempX * PI_180);
						animationTargetMesh.rotationY = -(tempY * PI_180);
						animationTargetMesh.rotationZ = -(tempZ * PI_180);
					}
					break;
				}
				case 'translation' : {
					if (interpolation === 'CUBICSPLINE') {
						if (previousTimeDataIDX !== targetTimeDataListLength - 1) {
							// 이전 키프레임 데이터
							prevIdx = previousTimeDataIDX * 9;
							nX = targetAnimationDataList[prevIdx + 3];
							nY = targetAnimationDataList[prevIdx + 4];
							nZ = targetAnimationDataList[prevIdx + 5];
							pXOut = targetAnimationDataList[prevIdx + 6];
							pYOut = targetAnimationDataList[prevIdx + 7];
							pZOut = targetAnimationDataList[prevIdx + 8];
							// 다음 키프레임 데이터
							nextIdx = nextTimeDataIDX * 9;
							nXOut = targetAnimationDataList[nextIdx];
							nYOut = targetAnimationDataList[nextIdx + 1];
							nZOut = targetAnimationDataList[nextIdx + 2];
							pX = targetAnimationDataList[nextIdx + 3];
							pY = targetAnimationDataList[nextIdx + 4];
							pZ = targetAnimationDataList[nextIdx + 5];
							// Cubic spline 보간 및 직접 할당 (X, Y, Z 동시 처리)
							startOut = pXOut * interpolationValue;
							endIn = nXOut * interpolationValue;
							animationTargetMesh.x = s0 * pX + s1 * startOut + s2 * nX + s3 * endIn;
							startOut = pYOut * interpolationValue;
							endIn = nYOut * interpolationValue;
							animationTargetMesh.y = s0 * pY + s1 * startOut + s2 * nY + s3 * endIn;
							startOut = pZOut * interpolationValue;
							endIn = nZOut * interpolationValue;
							animationTargetMesh.z = s0 * pZ + s1 * startOut + s2 * nZ + s3 * endIn;
						}
					} else {
						// Linear 보간
						// 다음 키프레임 스케일
						prevIdx = nextTimeDataIDX * 3;
						nX = targetAnimationDataList[prevIdx];
						nY = targetAnimationDataList[prevIdx + 1];
						nZ = targetAnimationDataList[prevIdx + 2];
						// 이전 키프레임 스케일
						nextIdx = previousTimeDataIDX * 3;
						pX = targetAnimationDataList[nextIdx];
						pY = targetAnimationDataList[nextIdx + 1];
						pZ = targetAnimationDataList[nextIdx + 2];
						// Linear 보간 및 직접 할당 (한 번에)
						animationTargetMesh.x = pX + interpolationValue * (nX - pX);
						animationTargetMesh.y = pY + interpolationValue * (nY - pY);
						animationTargetMesh.z = pZ + interpolationValue * (nZ - pZ);
					}
					break;
				}
				case 'scale' : {
					if (interpolation === 'CUBICSPLINE') {
						if (previousTimeDataIDX !== targetTimeDataListLength - 1) {
							// 이전 키프레임 데이터
							prevIdx = previousTimeDataIDX * 9;
							nX = targetAnimationDataList[prevIdx + 3];
							nY = targetAnimationDataList[prevIdx + 4];
							nZ = targetAnimationDataList[prevIdx + 5];
							pXOut = targetAnimationDataList[prevIdx + 6];
							pYOut = targetAnimationDataList[prevIdx + 7];
							pZOut = targetAnimationDataList[prevIdx + 8];
							// 다음 키프레임 데이터
							nextIdx = nextTimeDataIDX * 9;
							nXOut = targetAnimationDataList[nextIdx];
							nYOut = targetAnimationDataList[nextIdx + 1];
							nZOut = targetAnimationDataList[nextIdx + 2];
							pX = targetAnimationDataList[nextIdx + 3];
							pY = targetAnimationDataList[nextIdx + 4];
							pZ = targetAnimationDataList[nextIdx + 5];
							// Cubic spline 보간 및 직접 할당 (X, Y, Z 동시 처리)
							startOut = pXOut * interpolationValue;
							endIn = nXOut * interpolationValue;
							animationTargetMesh.scaleX = s0 * pX + s1 * startOut + s2 * nX + s3 * endIn;
							startOut = pYOut * interpolationValue;
							endIn = nYOut * interpolationValue;
							animationTargetMesh.scaleY = s0 * pY + s1 * startOut + s2 * nY + s3 * endIn;
							startOut = pZOut * interpolationValue;
							endIn = nZOut * interpolationValue;
							animationTargetMesh.scaleZ = s0 * pZ + s1 * startOut + s2 * nZ + s3 * endIn;
						}
					} else {
						// Linear 보간
						// 다음 키프레임 스케일
						prevIdx = nextTimeDataIDX * 3;
						nX = targetAnimationDataList[prevIdx];
						nY = targetAnimationDataList[prevIdx + 1];
						nZ = targetAnimationDataList[prevIdx + 2];
						// 이전 키프레임 스케일
						nextIdx = previousTimeDataIDX * 3;
						pX = targetAnimationDataList[nextIdx];
						pY = targetAnimationDataList[nextIdx + 1];
						pZ = targetAnimationDataList[nextIdx + 2];
						// Linear 보간 및 직접 할당 (한 번에)
						animationTargetMesh.scaleX = pX + interpolationValue * (nX - pX);
						animationTargetMesh.scaleY = pY + interpolationValue * (nY - pY);
						animationTargetMesh.scaleZ = pZ + interpolationValue * (nZ - pZ);
					}
					break;
				}
				case 'weights' :
					// gltfAnimationLooper_weight(
					// 	weightMeshes,
					// 	targetAnimationDataList,
					// 	interpolationValue,
					// 	previousTimeDataIDX,
					// 	nextTimeDataIDX
					// )
					let animationTargetIndex = weightMeshes.length;
					while (animationTargetIndex--) {

						currentAniTrack.render(
							redGPUContext,
							computePassEncoder,
							weightMeshes[animationTargetIndex],
							interpolationValue,
							previousTimeDataIDX,
							nextTimeDataIDX
						)
					}

					break;
			}
		}
	}
}
export default gltfAnimationLooper
