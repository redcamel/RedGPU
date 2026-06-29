import {glMatrix} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import AniTrack_GLTF from "../cls/anitrack/AniTrack_GLTF";
import {PlayAnimationInfo} from "../GLTFLoader";

// 최적화: 매 프레임의 중복 산술 연산 및 변수 생성을 방지하기 위해 상수를 파일 모듈 스코프로 승격
const PI_180 = 180 / Math.PI;

/**
 * [KO] 단일 키프레임 포즈 샘플링 헬퍼 (이진 탐색 및 보간 - 정수형 타입 & 캐싱 우회 & 호이스팅 적용)
 * [EN] Keyframe pose sampling helper (binary search and interpolation - optimized)
 */
function sampleTrackPose(track: AniTrack_GLTF, time: number): Float32Array | null {
    // [최적화] 변수 호이스팅
    let timeAnimationInfo = track.timeAnimationInfo;
    let aniDataAnimationInfo = track.aniDataAnimationInfo;
    let interpolationType = track.interpolationType;
    let isCUBICSPLINE = interpolationType === 2;

    let targetTimeDataList = timeAnimationInfo.dataList;
    let targetAnimationDataList = aniDataAnimationInfo.dataList;
    let targetTimeDataListLength = targetTimeDataList.length;

    let previousTimeDataIDX: number;
    let nextTimeDataIDX: number;
    let lastHint = track.lastPrevIdx || 0;

    let left: number, right: number, mid: number;
    let previousTimeFrame: number, nextTimeFrame: number;
    let interpolationValue: number;
    let p: number, pp: number, ppp: number;
    let s0: number, s1: number, s2: number, s3: number;
    let timeDiff: number, timeRatio: number;

    let prevIdx: number, nextIdx: number;
    let pose: Float32Array;
    let cached: any;
    let numericCacheKey: number;
    let cosom: number;
    let prevX: number, prevY: number, prevZ: number, prevW: number;
    let nextX: number, nextY: number, nextZ: number, nextW: number;
    let scale0: number, scale1: number;
    let omega: number, sinom: number;
    let idx: number;
    let morphLength: number;
    let weightMeshes: any[]; // 누락되었던 로컬 스코프 변수 선언 추가

    if (lastHint < targetTimeDataListLength - 1) {
        if (targetTimeDataList[lastHint] <= time && time < targetTimeDataList[lastHint + 1]) {
            previousTimeDataIDX = lastHint;
            nextTimeDataIDX = lastHint + 1;
        } else if (lastHint + 1 < targetTimeDataListLength - 1 &&
            targetTimeDataList[lastHint + 1] <= time &&
            time < targetTimeDataList[lastHint + 2]) {
            previousTimeDataIDX = lastHint + 1;
            nextTimeDataIDX = lastHint + 2;
        } else {
            if (time <= targetTimeDataList[0]) {
                previousTimeDataIDX = targetTimeDataListLength - 1;
                nextTimeDataIDX = 0;
            } else if (time >= targetTimeDataList[targetTimeDataListLength - 1]) {
                previousTimeDataIDX = targetTimeDataListLength - 1;
                nextTimeDataIDX = 0;
            } else {
                left = 0;
                right = targetTimeDataListLength - 1;
                while (left < right - 1) {
                    mid = (left + right) >> 1;
                    if (targetTimeDataList[mid] <= time) {
                        left = mid;
                    } else {
                        right = mid;
                    }
                }
                previousTimeDataIDX = left;
                nextTimeDataIDX = right;
            }
        }
    } else {
        if (time <= targetTimeDataList[0]) {
            previousTimeDataIDX = targetTimeDataListLength - 1;
            nextTimeDataIDX = 0;
        } else if (time >= targetTimeDataList[targetTimeDataListLength - 1]) {
            previousTimeDataIDX = targetTimeDataListLength - 1;
            nextTimeDataIDX = 0;
        } else {
            left = 0;
            right = targetTimeDataListLength - 1;
            while (left < right - 1) {
                mid = (left + right) >> 1;
                if (targetTimeDataList[mid] <= time) {
                    left = mid;
                } else {
                    right = mid;
                }
            }
            previousTimeDataIDX = left;
            nextTimeDataIDX = right;
        }
    }

    track.lastPrevIdx = previousTimeDataIDX;
    track.lastNextIdx = nextTimeDataIDX;
    previousTimeFrame = targetTimeDataList[previousTimeDataIDX];
    nextTimeFrame = targetTimeDataList[nextTimeDataIDX];

    if (isCUBICSPLINE) {
        timeDiff = nextTimeFrame - previousTimeFrame;
        interpolationValue = timeDiff === timeDiff ? timeDiff : 0;
        timeRatio = (time - previousTimeFrame) / interpolationValue;
        p = timeRatio === timeRatio ? timeRatio : 0;
        pp = p * p;
        ppp = pp * p;
        s2 = -2 * ppp + 3 * pp;
        s3 = ppp - pp;
        s0 = 1 - s2;
        s1 = s3 - pp + p;
    } else {
        if (interpolationType === 0) { // STEP
            interpolationValue = 0;
        } else {
            timeRatio = (time - previousTimeFrame) / (nextTimeFrame - previousTimeFrame);
            interpolationValue = timeRatio === timeRatio ? timeRatio : 0;
        }
    }

    track.lastInterpolationValue = interpolationValue;

    // 최적화: keyType 사용
    switch (track.keyType) {
        case 1: { // rotation
            pose = new Float32Array(4);
            if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                idx = previousTimeDataIDX << 2;
                pose[0] = targetAnimationDataList[idx];
                pose[1] = targetAnimationDataList[idx + 1];
                pose[2] = targetAnimationDataList[idx + 2];
                pose[3] = targetAnimationDataList[idx + 3];
            } else if (isCUBICSPLINE) {
                prevIdx = previousTimeDataIDX * 12;
                nextIdx = nextTimeDataIDX * 12;
                let tempX = targetAnimationDataList[prevIdx + 4];
                let tempY = targetAnimationDataList[prevIdx + 5];
                let tempZ = targetAnimationDataList[prevIdx + 6];
                let tempW = targetAnimationDataList[prevIdx + 7];
                let tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
                let prevX, prevY, prevZ, prevW;
                if (tempLen > 0) {
                    let tempInvLen = 1 / Math.sqrt(tempLen);
                    prevX = tempX * tempInvLen;
                    prevY = tempY * tempInvLen;
                    prevZ = tempZ * tempInvLen;
                    prevW = tempW * tempInvLen;
                } else {
                    prevX = prevY = prevZ = 0;
                    prevW = 1;
                }

                tempX = targetAnimationDataList[prevIdx + 8];
                tempY = targetAnimationDataList[prevIdx + 9];
                tempZ = targetAnimationDataList[prevIdx + 10];
                tempW = targetAnimationDataList[prevIdx + 11];
                tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
                let prevOutX, prevOutY, prevOutZ, prevOutW;
                if (tempLen > 0) {
                    let tempInvLen = 1 / Math.sqrt(tempLen);
                    prevOutX = tempX * tempInvLen;
                    prevOutY = tempY * tempInvLen;
                    prevOutZ = tempZ * tempInvLen;
                    prevOutW = tempW * tempInvLen;
                } else {
                    prevOutX = prevOutY = prevOutZ = 0;
                    prevOutW = 1;
                }

                tempX = targetAnimationDataList[nextIdx];
                tempY = targetAnimationDataList[nextIdx + 1];
                tempZ = targetAnimationDataList[nextIdx + 2];
                tempW = targetAnimationDataList[nextIdx + 3];
                tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
                let nextInX, nextInY, nextInZ, nextInW;
                if (tempLen > 0) {
                    let tempInvLen = 1 / Math.sqrt(tempLen);
                    nextInX = tempX * tempInvLen;
                    nextInY = tempY * tempInvLen;
                    nextInZ = tempZ * tempInvLen;
                    nextInW = tempW * tempInvLen;
                } else {
                    nextInX = nextInY = nextInZ = 0;
                    nextInW = 1;
                }

                tempX = targetAnimationDataList[nextIdx + 4];
                tempY = targetAnimationDataList[nextIdx + 5];
                tempZ = targetAnimationDataList[nextIdx + 6];
                tempW = targetAnimationDataList[nextIdx + 7];
                tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
                let nextX, nextY, nextZ, nextW;
                if (tempLen > 0) {
                    let tempInvLen = 1 / Math.sqrt(tempLen);
                    nextX = tempX * tempInvLen;
                    nextY = tempY * tempInvLen;
                    nextZ = tempZ * tempInvLen;
                    nextW = tempW * tempInvLen;
                } else {
                    nextX = nextY = nextZ = 0;
                    nextW = 1;
                }

                pose[0] = s0 * prevX + s1 * prevOutX * interpolationValue + s2 * nextX + s3 * nextInX * interpolationValue;
                pose[1] = s0 * prevY + s1 * prevOutY * interpolationValue + s2 * nextY + s3 * nextInY * interpolationValue;
                pose[2] = s0 * prevZ + s1 * prevOutZ * interpolationValue + s2 * nextX + s3 * nextInX * interpolationValue;
                pose[3] = s0 * prevW + s1 * prevOutW * interpolationValue + s2 * nextW + s3 * nextInW * interpolationValue;
            } else {
                prevIdx = previousTimeDataIDX << 2;
                nextIdx = nextTimeDataIDX << 2;
                numericCacheKey = (prevIdx << 16) | nextIdx;

                // 최적화: 캐시 테이블 탐색 우회 가동
                cached = track.lastCachedItem;
                if (!cached || track.lastCachedKey !== numericCacheKey) {
                    cached = track.cacheTable[numericCacheKey];
                    if (!cached) {
                        let tempX = targetAnimationDataList[prevIdx];
                        let tempY = targetAnimationDataList[prevIdx + 1];
                        let tempZ = targetAnimationDataList[prevIdx + 2];
                        let tempW = targetAnimationDataList[prevIdx + 3];
                        let tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
                        let prevX, prevY, prevZ, prevW, nextX, nextY, nextZ, nextW;
                        if (tempLen > 0) {
                            let tempInvLen = 1 / Math.sqrt(tempLen);
                            prevX = tempX * tempInvLen;
                            prevY = tempY * tempInvLen;
                            prevZ = tempZ * tempInvLen;
                            prevW = tempW * tempInvLen;
                        } else {
                            prevX = prevY = prevZ = 0;
                            prevW = 1;
                        }

                        tempX = targetAnimationDataList[nextIdx];
                        tempY = targetAnimationDataList[nextIdx + 1];
                        tempZ = targetAnimationDataList[nextIdx + 2];
                        tempW = targetAnimationDataList[nextIdx + 3];
                        tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
                        if (tempLen > 0) {
                            let tempInvLen = 1 / Math.sqrt(tempLen);
                            nextX = tempX * tempInvLen;
                            nextY = tempY * tempInvLen;
                            nextZ = tempZ * tempInvLen;
                            nextW = tempW * tempInvLen;
                        } else {
                            nextX = nextY = nextZ = 0;
                            nextW = 1;
                        }

                        let cosom = prevX * nextX + prevY * nextY + prevZ * nextZ + prevW * nextW;
                        if (cosom < 0) {
                            cosom = -cosom;
                            nextX = -nextX;
                            nextY = -nextY;
                            nextZ = -nextZ;
                            nextW = -nextW;
                        }

                        cached = new Float32Array(9);
                        cached[0] = cosom;
                        cached[1] = prevX;
                        cached[2] = prevY;
                        cached[3] = prevZ;
                        cached[4] = prevW;
                        cached[5] = nextX;
                        cached[6] = nextY;
                        cached[7] = nextZ;
                        cached[8] = nextW;
                        track.cacheTable[numericCacheKey] = cached;
                    }
                    track.lastCachedKey = numericCacheKey;
                    track.lastCachedItem = cached;
                }

                let cosomVal = cached[0];
                let prevX = cached[1], prevY = cached[2], prevZ = cached[3], prevW = cached[4];
                let nextX = cached[5], nextY = cached[6], nextZ = cached[7], nextW = cached[8];

                let scale0, scale1;
                if ((1 - cosomVal) > glMatrix.EPSILON) {
                    const omega = Math.acos(cosomVal);
                    const sinom = Math.sin(omega);
                    scale0 = Math.sin((1 - interpolationValue) * omega) / sinom;
                    scale1 = Math.sin(interpolationValue * omega) / sinom;
                } else {
                    scale0 = 1 - interpolationValue;
                    scale1 = interpolationValue;
                }

                pose[0] = scale0 * prevX + scale1 * nextX;
                pose[1] = scale0 * prevY + scale1 * nextY;
                pose[2] = scale0 * prevZ + scale1 * nextZ;
                pose[3] = scale0 * prevW + scale1 * nextW;
            }
            return pose;
        }
        case 2:
        case 3: { // translation or scale
            pose = new Float32Array(3);
            if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                idx = previousTimeDataIDX * 3;
                pose[0] = targetAnimationDataList[idx];
                pose[1] = targetAnimationDataList[idx + 1];
                pose[2] = targetAnimationDataList[idx + 2];
            } else if (isCUBICSPLINE) {
                prevIdx = previousTimeDataIDX * 9;
                let nX = targetAnimationDataList[prevIdx + 3];
                let nY = targetAnimationDataList[prevIdx + 4];
                let nZ = targetAnimationDataList[prevIdx + 5];
                let pXOut = targetAnimationDataList[prevIdx + 6];
                let pYOut = targetAnimationDataList[prevIdx + 7];
                let pZOut = targetAnimationDataList[prevIdx + 8];

                nextIdx = nextTimeDataIDX * 9;
                let nXOut = targetAnimationDataList[nextIdx];
                let nYOut = targetAnimationDataList[nextIdx + 1];
                let nZOut = targetAnimationDataList[nextIdx + 2];
                let pX = targetAnimationDataList[nextIdx + 3];
                let pY = targetAnimationDataList[nextIdx + 4];
                let pZ = targetAnimationDataList[nextIdx + 5];

                pose[0] = s0 * pX + s1 * pXOut * interpolationValue + s2 * nX + s3 * nXOut * interpolationValue;
                pose[1] = s0 * pY + s1 * pYOut * interpolationValue + s2 * nY + s3 * nYOut * interpolationValue;
                pose[2] = s0 * pZ + s1 * pZOut * interpolationValue + s2 * nZ + s3 * nZOut * interpolationValue;
            } else {
                prevIdx = nextTimeDataIDX * 3;
                let nX = targetAnimationDataList[prevIdx];
                let nY = targetAnimationDataList[prevIdx + 1];
                let nZ = targetAnimationDataList[prevIdx + 2];

                nextIdx = previousTimeDataIDX * 3;
                let pX = targetAnimationDataList[nextIdx];
                let pY = targetAnimationDataList[nextIdx + 1];
                let pZ = targetAnimationDataList[nextIdx + 2];

                pose[0] = pX + interpolationValue * (nX - pX);
                pose[1] = pY + interpolationValue * (nY - pY);
                pose[2] = pZ + interpolationValue * (nZ - pZ);
            }
            return pose;
        }
        case 4: { // weights
            weightMeshes = track.weightMeshes;
            morphLength = weightMeshes[0]?.animationInfo.morphInfo.morphInfoDataList.length || 0;
            pose = new Float32Array(morphLength);
            if (morphLength > 0) {
                for (let i = 0; i < morphLength; i++) {
                    pose[i] = targetAnimationDataList[previousTimeDataIDX * morphLength + i] +
                        interpolationValue * (targetAnimationDataList[nextTimeDataIDX * morphLength + i] - targetAnimationDataList[previousTimeDataIDX * morphLength + i]);
                }
            }
            return pose;
        }
    }
    return null;
}

/**
 * [KO] 단일 포즈 뼈대 적용 헬퍼 (쿼터니언-오일러 인라인 연산 포함 - 호이스팅 적용)
 * [EN] Single pose mesh application helper (includes inline quaternion-to-Euler conversion)
 */
function applySinglePose(
    mesh: any,
    keyType: number,
    pose: Float32Array,
    redGPUContext: RedGPUContext,
    computePassEncoder: GPUComputePassEncoder,
    track: AniTrack_GLTF
) {
    // [최적화] 변수 호이스팅
    let tempX: number, tempY: number, tempZ: number, tempW: number;
    let x2: number, y2: number, z2: number;
    let xx: number, xy: number, xz: number;
    let yy: number, yz: number, zz: number;
    let wx: number, wy: number, wz: number;
    let m11: number, m12: number, m13: number;
    let m22: number, m23: number;
    let m32: number, m33: number;
    let rotX: number, rotY: number, rotZ: number;
    let weightMeshes: any[];
    let animationTargetIndex: number;

    switch (keyType) {
        case 2: // translation
            mesh.x = pose[0];
            mesh.y = pose[1];
            mesh.z = pose[2];
            break;
        case 1: { // rotation
            tempX = pose[0];
            tempY = pose[1];
            tempZ = pose[2];
            tempW = pose[3];
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
            m13 = xz + wy;
            m11 = 1 - (yy + zz);
            m12 = xy - wz;
            m23 = yz - wx;
            m33 = 1 - (xx + yy);
            m32 = yz + wx;
            m22 = 1 - (xx + zz);
            rotY = Math.asin(Math.max(-1, Math.min(1, m13)));
            if (Math.abs(m13) < 0.99999) {
                rotX = Math.atan2(-m23, m33);
                rotZ = Math.atan2(-m12, m11);
            } else {
                rotX = Math.atan2(m32, m22);
                rotZ = 0;
            }
            mesh.rotationX = rotX * PI_180;
            mesh.rotationY = rotY * PI_180;
            mesh.rotationZ = rotZ * PI_180;
            break;
        }
        case 3: // scale
            mesh.scaleX = pose[0];
            mesh.scaleY = pose[1];
            mesh.scaleZ = pose[2];
            break;
        case 4: { // weights
            weightMeshes = track.weightMeshes;
            animationTargetIndex = weightMeshes.length;
            while (animationTargetIndex--) {
                track.renderWeight(
                    redGPUContext,
                    computePassEncoder,
                    weightMeshes[animationTargetIndex],
                    track.lastInterpolationValue,
                    track.lastPrevIdx,
                    track.lastNextIdx
                );
            }
            break;
        }
    }
}

/**
 * [KO] 두 포즈 믹싱 보간 뼈대 적용 헬퍼 (LERP/SLERP 및 쿼터니언-오일러 인라인 수학식 포함 - 호이스팅 적용)
 * [EN] Blended pose mixing helper (includes inline LERP/SLERP and quaternion-to-Euler conversion)
 */
function applyBlendedPose(
    mesh: any,
    keyType: number,
    poseFrom: Float32Array,
    poseTo: Float32Array,
    blendWeight: number,
    redGPUContext: RedGPUContext,
    computePassEncoder: GPUComputePassEncoder,
    trackFrom: AniTrack_GLTF,
    trackTo: AniTrack_GLTF
) {
    // [최적화] 변수 호이스팅
    let fromX: number, fromY: number, fromZ: number;
    let toX: number, toY: number, toZ: number;
    let q1x: number, q1y: number, q1z: number, q1w: number;
    let q2x: number, q2y: number, q2z: number, q2w: number;
    let cosHalftheta: number, halfTheta: number, sinHalftheta: number;
    let scale0: number, scale1: number;
    let tempX: number, tempY: number, tempZ: number, tempW: number;
    let x2: number, y2: number, z2: number;
    let xx: number, xy: number, xz: number;
    let yy: number, yz: number, zz: number;
    let wx: number, wy: number, wz: number;
    let m11: number, m12: number, m13: number;
    let m22: number, m23: number;
    let m32: number, m33: number;
    let rotX: number, rotY: number, rotZ: number;
    let selectedTrack: AniTrack_GLTF;
    let weightMeshes: any[];
    let animationTargetIndex: number;

    switch (keyType) {
        case 2: { // translation
            fromX = poseFrom[0];
            fromY = poseFrom[1];
            fromZ = poseFrom[2];
            toX = poseTo[0];
            toY = poseTo[1];
            toZ = poseTo[2];
            mesh.x = fromX + blendWeight * (toX - fromX);
            mesh.y = fromY + blendWeight * (toY - fromY);
            mesh.z = fromZ + blendWeight * (toZ - fromZ);
            break;
        }
        case 1: { // rotation
            q1x = poseFrom[0];
            q1y = poseFrom[1];
            q1z = poseFrom[2];
            q1w = poseFrom[3];
            q2x = poseTo[0];
            q2y = poseTo[1];
            q2z = poseTo[2];
            q2w = poseTo[3];

            cosHalftheta = q1x * q2x + q1y * q2y + q1z * q2z + q1w * q2w;
            if (cosHalftheta < 0) {
                cosHalftheta = -cosHalftheta;
                q2x = -q2x;
                q2y = -q2y;
                q2z = -q2z;
                q2w = -q2w;
            }

            if ((1 - cosHalftheta) > 0.000001) {
                halfTheta = Math.acos(cosHalftheta);
                sinHalftheta = Math.sin(halfTheta);
                scale0 = Math.sin((1 - blendWeight) * halfTheta) / sinHalftheta;
                scale1 = Math.sin(blendWeight * halfTheta) / sinHalftheta;
            } else {
                scale0 = 1 - blendWeight;
                scale1 = blendWeight;
            }

            tempX = scale0 * q1x + scale1 * q2x;
            tempY = scale0 * q1y + scale1 * q2y;
            tempZ = scale0 * q1z + scale1 * q2z;
            tempW = scale0 * q1w + scale1 * q2w;

            // [quatToEuler inline]
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
            m13 = xz + wy;
            m11 = 1 - (yy + zz);
            m12 = xy - wz;
            m23 = yz - wx;
            m33 = 1 - (xx + yy);
            m32 = yz + wx;
            m22 = 1 - (xx + zz);
            rotY = Math.asin(Math.max(-1, Math.min(1, m13)));
            if (Math.abs(m13) < 0.99999) {
                rotX = Math.atan2(-m23, m33);
                rotZ = Math.atan2(-m12, m11);
            } else {
                rotX = Math.atan2(m32, m22);
                rotZ = 0;
            }
            mesh.rotationX = rotX * PI_180;
            mesh.rotationY = rotY * PI_180;
            mesh.rotationZ = rotZ * PI_180;
            break;
        }
        case 3: { // scale
            fromX = poseFrom[0];
            fromY = poseFrom[1];
            fromZ = poseFrom[2];
            toX = poseTo[0];
            toY = poseTo[1];
            toZ = poseTo[2];
            mesh.scaleX = fromX + blendWeight * (toX - fromX);
            mesh.scaleY = fromY + blendWeight * (toY - fromY);
            mesh.scaleZ = fromZ + blendWeight * (toZ - fromZ);
            break;
        }
        case 4: { // weights
            selectedTrack = blendWeight < 0.5 ? trackFrom : trackTo;
            weightMeshes = selectedTrack.weightMeshes;
            animationTargetIndex = weightMeshes.length;
            while (animationTargetIndex--) {
                selectedTrack.renderWeight(
                    redGPUContext,
                    computePassEncoder,
                    weightMeshes[animationTargetIndex],
                    selectedTrack.lastInterpolationValue,
                    selectedTrack.lastPrevIdx,
                    selectedTrack.lastNextIdx
                );
            }
            break;
        }
    }
}

/**
 * [KO] glTF 애니메이션 모션 Blending 메인 진입 함수 (호이스팅 최적화 적용)
 * [EN] Main entry function for glTF animation motion blending
 */
export default function gltfAnimationMotionBlending(
    redGPUContext: RedGPUContext,
    timestamp: number,
    computePassEncoder: GPUComputePassEncoder,
    targetPlayAnimationInfo: PlayAnimationInfo
) {
    // [최적화] 변수 호이스팅
    let fromClip = targetPlayAnimationInfo.fromClip!;
    let toClip = targetPlayAnimationInfo.toClip!;
    let blendWeight = targetPlayAnimationInfo.blendWeight ?? 0.5;

    let maxTimeFrom = fromClip['maxTime'];
    let startTimeFrom = targetPlayAnimationInfo.startTimeFrom!;
    let timeFrom = ((timestamp - startTimeFrom) % (maxTimeFrom * 1000)) / 1000;

    let maxTimeTo = toClip['maxTime'];
    let startTimeTo = targetPlayAnimationInfo.startTimeTo!;
    let timeTo = ((timestamp - startTimeTo) % (maxTimeTo * 1000)) / 1000;

    let i: number;
    let trackFrom: AniTrack_GLTF;
    let mesh: any;
    let keyType: number;
    let trackTo: any;
    let poseFrom: any;
    let poseTo: any;

    let j: number;
    let trackToSingle: AniTrack_GLTF;
    let meshSingle: any;
    let keyTypeSingle: number;
    let trackFromSingle: any;
    let poseToSingle: any;

    // fromClip을 주축으로 돌며 동일 조인트 트랙 매칭 보간
    for (i = 0; i < fromClip.length; i++) {
        trackFrom = fromClip[i];
        mesh = trackFrom.animationTargetMesh;
        keyType = trackFrom.keyType;

        trackTo = toClip.find(t => t.animationTargetMesh === mesh && t.keyType === keyType);

        if (trackTo) {
            poseFrom = sampleTrackPose(trackFrom, timeFrom);
            poseTo = sampleTrackPose(trackTo, timeTo);

            if (poseFrom && poseTo) {
                mesh.dirtyTransform = true;
                applyBlendedPose(
                    mesh,
                    keyType,
                    poseFrom,
                    poseTo,
                    blendWeight,
                    redGPUContext,
                    computePassEncoder,
                    trackFrom,
                    trackTo
                );
            }
        } else {
            poseFrom = sampleTrackPose(trackFrom, timeFrom);
            if (poseFrom) {
                mesh.dirtyTransform = true;
                applySinglePose(
                    mesh,
                    keyType,
                    poseFrom,
                    redGPUContext,
                    computePassEncoder,
                    trackFrom
                );
            }
        }
    }

    // toClip에만 있고 fromClip에는 없는 독자 조인트 트랙 처리
    for (j = 0; j < toClip.length; j++) {
        trackToSingle = toClip[j];
        meshSingle = trackToSingle.animationTargetMesh;
        keyTypeSingle = trackToSingle.keyType;

        trackFromSingle = fromClip.find(t => t.animationTargetMesh === meshSingle && t.keyType === keyTypeSingle);

        if (!trackFromSingle) {
            poseToSingle = sampleTrackPose(trackToSingle, timeTo);
            if (poseToSingle) {
                meshSingle.dirtyTransform = true;
                applySinglePose(
                    meshSingle,
                    keyTypeSingle,
                    poseToSingle,
                    redGPUContext,
                    computePassEncoder,
                    trackToSingle
                );
            }
        }
    }
}
