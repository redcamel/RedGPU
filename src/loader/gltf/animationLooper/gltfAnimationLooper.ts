import {glMatrix} from "gl-matrix";
import {keepLog} from "../../../utils";
import AniTrack_GLTF from "../cls/AniTrack_GLTF";
import {GLTFParsedSingleClip} from "../parsers/animation/parseAnimations";
import gltfAnimationLooper_rotation from "./gltfAnimationLooper_rotation";
import gltfAnimationLooper_scale from "./gltfAnimationLooper_scale";
import gltfAnimationLooper_transition from "./gltfAnimationLooper_transition";
import gltfAnimationLooper_weight from "./gltfAnimationLooper_weight";

// 상수를 모듈 레벨에서 정의 (V8이 인라인 최적화 가능)
const CUBICSPLINE = 'CUBICSPLINE';
const STEP = 'STEP';
const ROTATION = 'rotation';
const TRANSLATION = 'translation';
const SCALE = 'scale';
const WEIGHTS = 'weights';
const THOUSAND = 1000;
const EPSILON = glMatrix.EPSILON;
const PI_180 = 180 / Math.PI;

const rotationHandler = gltfAnimationLooper_rotation;
const translationHandler = gltfAnimationLooper_transition;
const scaleHandler = gltfAnimationLooper_scale;
const weightHandler = gltfAnimationLooper_weight;

const gltfAnimationLooper = (time: number, animationLoopList: GLTFParsedSingleClip[]) => {

	let currentTime: number, previousTimeFrame: number, nextTimeFrame: number;
	let animationListIndex: number = animationLoopList.length;




	while (animationListIndex--) {
		let interpolationValue: number;
		let targetAniTrackIDX: number;
		let targetAnimationTrackList: AniTrack_GLTF[];
		let loopListItem: GLTFParsedSingleClip;
		let currentAniTrack: AniTrack_GLTF;
		let nextTimeDataIDX: number, previousTimeDataIDX: number;
		let targetTimeDataList: number[];
		let targetAnimationDataList: number[];
		let targetTimeDataListLength: number;
		let targetTimeDataIDX: number;
		let targetTime: number;
		let maxTime: number;
		let animationTargetMesh: any;
		let timeAnimationInfo: any;
		let aniDataAnimationInfo: any;
		let weightMeshes: any;
		let interpolation: string;
		let key: string;
		loopListItem = animationLoopList[animationListIndex];
		targetAnimationTrackList = loopListItem.targetAniTrackList;
		// 곱셈을 상수로 미리 계산하여 JIT 최적화 돕기
		maxTime = targetAnimationTrackList['maxTime'] * THOUSAND;
		targetAniTrackIDX = targetAnimationTrackList.length;

		while (targetAniTrackIDX--) {
			// 보간 관련 변수
			let p: number, pp: number, ppp: number;
			let s0: number, s1: number, s2: number, s3: number;
			let timeDiff: number, invTimeDiff: number;
			currentAniTrack = targetAnimationTrackList[targetAniTrackIDX];


			animationTargetMesh = currentAniTrack.animationTargetMesh;
			timeAnimationInfo = currentAniTrack.timeAnimationInfo;
			aniDataAnimationInfo = currentAniTrack.aniDataAnimationInfo;
			weightMeshes = currentAniTrack.weightMeshes;
			interpolation = currentAniTrack.interpolation;
			key = currentAniTrack.key;

			// 시간 계산 최적화
			timeDiff = time - loopListItem.startTime;
			currentTime = (timeDiff % maxTime) / THOUSAND;

			/////////////////////////////////////////////////////////////////////////////////
			// 배열 참조를 미리 캐시 (메모리 접근 최적화)
			/////////////////////////////////////////////////////////////////////////////////
			targetTimeDataList = timeAnimationInfo.dataList;
			targetAnimationDataList = aniDataAnimationInfo.dataList;
			targetTimeDataListLength = targetTimeDataList.length;

			// 초기값 설정
			previousTimeDataIDX = targetTimeDataListLength - 1;
			nextTimeDataIDX = 0;
			previousTimeFrame = targetTimeDataList[previousTimeDataIDX];
			nextTimeFrame = targetTimeDataList[nextTimeDataIDX];

			// 시간 프레임 검색
			targetTimeDataIDX = 0;
			while (targetTimeDataIDX < targetTimeDataListLength) {
				targetTime = targetTimeDataList[targetTimeDataIDX];

				if (targetTime < currentTime) {
					previousTimeDataIDX = targetTimeDataIDX;
					previousTimeFrame = targetTime;
					if (targetTimeDataIDX + 1 < targetTimeDataListLength) {
						nextTimeDataIDX = targetTimeDataIDX + 1;
					} else {
						nextTimeDataIDX = 0;
					}
					nextTimeFrame = targetTimeDataList[nextTimeDataIDX];
				}
				// resetTimeFrameAtStart
				else if (targetTimeDataIDX === 0 && currentTime < targetTime) {
					previousTimeDataIDX = targetTimeDataListLength - 1;
					previousTimeFrame = targetTimeDataList[previousTimeDataIDX];
					nextTimeDataIDX = 0;
					nextTimeFrame = targetTime;
					currentTime = targetTime;
					break;
				}
				// resetTimeFrameAtEnd
				else if (targetTimeDataIDX === targetTimeDataListLength - 1 && currentTime > targetTime) {
					previousTimeDataIDX = 0;
					previousTimeFrame = targetTimeDataList[0];
					nextTimeDataIDX = targetTimeDataListLength - 1;
					nextTimeFrame = targetTime;
					currentTime = targetTime;
					break;
				}
				++targetTimeDataIDX;
			}

			/////////////////////////////////////////////////////////////////////////////////
			// 보간 값 계산
			/////////////////////////////////////////////////////////////////////////////////
			if (interpolation === CUBICSPLINE) {
				timeDiff = nextTimeFrame - previousTimeFrame;
				// NaN 체크
				if (timeDiff !== timeDiff) timeDiff = 0;

				// 0 division 체크를 먼저 수행
				if (timeDiff === 0) {
					p = 0;
				} else {
					p = (currentTime - previousTimeFrame) / timeDiff;
					if (p !== p) p = 0;
				}

				// 수학 계산 최적화 (중간값 재사용)
				pp = p * p;
				ppp = pp * p;
				// 공통 표현식 추출
				const twoP3 = ppp + ppp; // 2 * ppp
				const threeP2 = pp + pp + pp; // 3 * pp

				s2 = threeP2 - twoP3;
				s3 = ppp - pp;
				s0 = 1 - s2;
				s1 = s3 - pp + p;

				interpolationValue = p; // cubic spline에서는 p 값 사용
			} else {
				if (interpolation === STEP) {
					interpolationValue = 0;
				} else {
					timeDiff = nextTimeFrame - previousTimeFrame;
					if (timeDiff === 0) {
						interpolationValue = 0;
					} else {
						interpolationValue = (currentTime - previousTimeFrame) / timeDiff;
						if (interpolationValue !== interpolationValue) interpolationValue = 0;
					}
				}
			}


			if (key === ROTATION) {
				// rotationHandler(interpolation, animationTargetMesh, targetAnimationDataList,
				// 	targetTimeDataListLength, interpolationValue, previousTimeDataIDX,
				// 	nextTimeDataIDX, s0, s1, s2, s3);
				{
					let tempX, tempY, tempZ, tempW, tempLen, tempInvLen;
					let prevX, prevY, prevZ, prevW, nextX, nextY, nextZ, nextW;
					let cosom, omega, sinom, scale0, scale1;
					let x2, y2, z2, xx, xy, xz, yy, yz, zz, wx, wy, wz;
					let m11, m12, m13, m22, m23, m32, m33;
					// 경계 조건 체크 (조기 종료)
					if (previousTimeDataIDX === targetTimeDataListLength - 1) return;

					if (interpolation === 'CUBICSPLINE') {
						let prevIdx = previousTimeDataIDX * 12;
						let nextIdx = nextTimeDataIDX * 12;

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
						let prevIdx = previousTimeDataIDX * 4;
						let nextIdx = nextTimeDataIDX * 4;

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
			} else if (key === SCALE) {
				// translationHandler(interpolation, animationTargetMesh, targetAnimationDataList,
				// 	targetTimeDataListLength, interpolationValue, previousTimeDataIDX,
				// 	nextTimeDataIDX, s0, s1, s2, s3);
				{
					let tempIDX;
					let nX, nY, nZ, pX, pY, pZ;
					let nXOut, nYOut, nZOut, pXOut, pYOut, pZOut;
					let startV, startOut, endV, endIn;
					if (interpolation === 'CUBICSPLINE') {
						// 경계 조건 체크 (조기 종료)
						if (previousTimeDataIDX === targetTimeDataListLength - 1) return;

						// 이전 키프레임 데이터
						tempIDX = previousTimeDataIDX * 9;
						nX = targetAnimationDataList[tempIDX + 3];
						nY = targetAnimationDataList[tempIDX + 4];
						nZ = targetAnimationDataList[tempIDX + 5];
						pXOut = targetAnimationDataList[tempIDX + 6];
						pYOut = targetAnimationDataList[tempIDX + 7];
						pZOut = targetAnimationDataList[tempIDX + 8];

						// 다음 키프레임 데이터
						tempIDX = nextTimeDataIDX * 9;
						nXOut = targetAnimationDataList[tempIDX];
						nYOut = targetAnimationDataList[tempIDX + 1];
						nZOut = targetAnimationDataList[tempIDX + 2];
						pX = targetAnimationDataList[tempIDX + 3];
						pY = targetAnimationDataList[tempIDX + 4];
						pZ = targetAnimationDataList[tempIDX + 5];

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

					} else {
						// Linear 보간
						// 다음 키프레임 스케일
						tempIDX = nextTimeDataIDX * 3;
						nX = targetAnimationDataList[tempIDX];
						nY = targetAnimationDataList[tempIDX + 1];
						nZ = targetAnimationDataList[tempIDX + 2];

						// 이전 키프레임 스케일
						tempIDX = previousTimeDataIDX * 3;
						pX = targetAnimationDataList[tempIDX];
						pY = targetAnimationDataList[tempIDX + 1];
						pZ = targetAnimationDataList[tempIDX + 2];

						// Linear 보간 및 직접 할당 (한 번에)
						animationTargetMesh.scaleX = pX + interpolationValue * (nX - pX);
						animationTargetMesh.scaleY = pY + interpolationValue * (nY - pY);
						animationTargetMesh.scaleZ = pZ + interpolationValue * (nZ - pZ);
					}
				}
			} else if (key === TRANSLATION) {
				// scaleHandler(interpolation, animationTargetMesh, targetAnimationDataList,
				// 	targetTimeDataListLength, interpolationValue, previousTimeDataIDX,
				// 	nextTimeDataIDX, s0, s1, s2, s3);
				{
					let tempIDX;
					let nX, nY, nZ, pX, pY, pZ;
					let nXOut, nYOut, nZOut, pXOut, pYOut, pZOut;
					let startV, startOut, endV, endIn;
					if (interpolation === 'CUBICSPLINE') {
						// 경계 조건 체크 (조기 종료)
						if (previousTimeDataIDX === targetTimeDataListLength - 1) return;

						// 이전 키프레임 데이터
						tempIDX = previousTimeDataIDX * 9;
						nX = targetAnimationDataList[tempIDX + 3];
						nY = targetAnimationDataList[tempIDX + 4];
						nZ = targetAnimationDataList[tempIDX + 5];
						pXOut = targetAnimationDataList[tempIDX + 6];
						pYOut = targetAnimationDataList[tempIDX + 7];
						pZOut = targetAnimationDataList[tempIDX + 8];

						// 다음 키프레임 데이터
						tempIDX = nextTimeDataIDX * 9;
						nXOut = targetAnimationDataList[tempIDX];
						nYOut = targetAnimationDataList[tempIDX + 1];
						nZOut = targetAnimationDataList[tempIDX + 2];
						pX = targetAnimationDataList[tempIDX + 3];
						pY = targetAnimationDataList[tempIDX + 4];
						pZ = targetAnimationDataList[tempIDX + 5];

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

					} else {
						// Linear 보간
						// 다음 키프레임 스케일
						tempIDX = nextTimeDataIDX * 3;
						nX = targetAnimationDataList[tempIDX];
						nY = targetAnimationDataList[tempIDX + 1];
						nZ = targetAnimationDataList[tempIDX + 2];

						// 이전 키프레임 스케일
						tempIDX = previousTimeDataIDX * 3;
						pX = targetAnimationDataList[tempIDX];
						pY = targetAnimationDataList[tempIDX + 1];
						pZ = targetAnimationDataList[tempIDX + 2];

						// Linear 보간 및 직접 할당 (한 번에)
						animationTargetMesh.x = pX + interpolationValue * (nX - pX);
						animationTargetMesh.y = pY + interpolationValue * (nY - pY);
						animationTargetMesh.z = pZ + interpolationValue * (nZ - pZ);
					}
				}
			} else if (key === WEIGHTS) {
				weightHandler(weightMeshes, targetAnimationDataList, interpolationValue,
					previousTimeDataIDX, nextTimeDataIDX);
			}
		}
	}
}

export default gltfAnimationLooper;
