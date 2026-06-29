import {glMatrix} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import AniTrack_GLTF from "../cls/anitrack/AniTrack_GLTF";
import {PlayAnimationInfo} from "../GLTFLoader";

/**
 * [KO] 단일 키프레임 포즈 샘플링 헬퍼 (이진 탐색 및 보간)
 * [EN] Keyframe pose sampling helper (binary search and interpolation)
 */
function sampleTrackPose(track: AniTrack_GLTF, time: number): Float32Array | null {
    const timeAnimationInfo = track.timeAnimationInfo;
    const aniDataAnimationInfo = track.aniDataAnimationInfo;
    const interpolation = track.interpolation;
    
    const targetTimeDataList = timeAnimationInfo.dataList;
    const targetAnimationDataList = aniDataAnimationInfo.dataList;
    const targetTimeDataListLength = targetTimeDataList.length;

    let previousTimeDataIDX: number;
    let nextTimeDataIDX: number;
    const lastHint = track.lastPrevIdx || 0;

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
                let left = 0;
                let right = targetTimeDataListLength - 1;
                while (left < right - 1) {
                    const mid = (left + right) >> 1;
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
            let left = 0;
            let right = targetTimeDataListLength - 1;
            while (left < right - 1) {
                const mid = (left + right) >> 1;
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
    const previousTimeFrame = targetTimeDataList[previousTimeDataIDX];
    const nextTimeFrame = targetTimeDataList[nextTimeDataIDX];

    let interpolationValue: number;
    let p: number, pp: number, ppp: number;
    let s0: number, s1: number, s2: number, s3: number;
    const isCUBICSPLINE = interpolation === 'CUBICSPLINE';

    if (isCUBICSPLINE) {
        const timeDiff = nextTimeFrame - previousTimeFrame;
        interpolationValue = timeDiff === timeDiff ? timeDiff : 0;
        const timeRatio = (time - previousTimeFrame) / interpolationValue;
        p = timeRatio === timeRatio ? timeRatio : 0;
        pp = p * p;
        ppp = pp * p;
        s2 = -2 * ppp + 3 * pp;
        s3 = ppp - pp;
        s0 = 1 - s2;
        s1 = s3 - pp + p;
    } else {
        if (interpolation === 'STEP') {
            interpolationValue = 0;
        } else {
            const timeRatio = (time - previousTimeFrame) / (nextTimeFrame - previousTimeFrame);
            interpolationValue = timeRatio === timeRatio ? timeRatio : 0;
        }
    }

    track.lastInterpolationValue = interpolationValue;
    let prevIdx: number, nextIdx: number;

    switch (track.key) {
        case 'rotation': {
            const pose = new Float32Array(4);
            if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                const idx = previousTimeDataIDX << 2;
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
                const numericCacheKey = (prevIdx << 16) | nextIdx;
                let cached = track.cacheTable[numericCacheKey];
                let cosom, prevX, prevY, prevZ, prevW, nextX, nextY, nextZ, nextW;
                if (cached) {
                    cosom = cached[0];
                    prevX = cached[1];
                    prevY = cached[2];
                    prevZ = cached[3];
                    prevW = cached[4];
                    nextX = cached[5];
                    nextY = cached[6];
                    nextZ = cached[7];
                    nextW = cached[8];
                } else {
                    let tempX = targetAnimationDataList[prevIdx];
                    let tempY = targetAnimationDataList[prevIdx + 1];
                    let tempZ = targetAnimationDataList[prevIdx + 2];
                    let tempW = targetAnimationDataList[prevIdx + 3];
                    let tempLen = tempX * tempX + tempY * tempY + tempZ * tempZ + tempW * tempW;
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

                    cosom = prevX * nextX + prevY * nextY + prevZ * nextZ + prevW * nextW;
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

                let scale0, scale1;
                if ((1 - cosom) > glMatrix.EPSILON) {
                    const omega = Math.acos(cosom);
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
        case 'translation':
        case 'scale': {
            const pose = new Float32Array(3);
            if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                const idx = previousTimeDataIDX * 3;
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
        case 'weights': {
            const weightMeshes = track.weightMeshes;
            const morphLength = weightMeshes[0]?.animationInfo.morphInfo.morphInfoDataList.length || 0;
            const pose = new Float32Array(morphLength);
            if (morphLength > 0) {
                for (let i = 0; i < morphLength; i++) {
                    const prevW = targetAnimationDataList[previousTimeDataIDX * morphLength + i];
                    const nextW = targetAnimationDataList[nextTimeDataIDX * morphLength + i];
                    pose[i] = prevW + interpolationValue * (nextW - prevW);
                }
            }
            return pose;
        }
    }
    return null;
}

/**
 * [KO] 단일 포즈 뼈대 적용 헬퍼 (쿼터니언-오일러 인라인 연산 포함)
 * [EN] Single pose mesh application helper (includes inline quaternion-to-Euler conversion)
 */
function applySinglePose(
    mesh: any,
    key: string,
    pose: Float32Array,
    redGPUContext: RedGPUContext,
    computePassEncoder: GPUComputePassEncoder,
    track: AniTrack_GLTF
) {
    const PI_180 = 180 / Math.PI;
    switch (key) {
        case 'translation':
            mesh.x = pose[0];
            mesh.y = pose[1];
            mesh.z = pose[2];
            break;
        case 'rotation': {
            const tempX = pose[0], tempY = pose[1], tempZ = pose[2], tempW = pose[3];
            const x2 = tempX + tempX, y2 = tempY + tempY, z2 = tempZ + tempZ;
            const xx = tempX * x2, xy = tempX * y2, xz = tempX * z2;
            const yy = tempY * y2, yz = tempY * z2, zz = tempZ * z2;
            const wx = tempW * x2, wy = tempW * y2, wz = tempW * z2;
            const m13 = xz + wy;
            const m11 = 1 - (yy + zz);
            const m12 = xy - wz;
            const m23 = yz - wx;
            const m33 = 1 - (xx + yy);
            const m32 = yz + wx;
            const m22 = 1 - (xx + zz);
            let rotY = Math.asin(Math.max(-1, Math.min(1, m13)));
            let rotX, rotZ;
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
        case 'scale':
            mesh.scaleX = pose[0];
            mesh.scaleY = pose[1];
            mesh.scaleZ = pose[2];
            break;
        case 'weights': {
            const weightMeshes = track.weightMeshes;
            let animationTargetIndex = weightMeshes.length;
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
 * [KO] 두 포즈 믹싱 보간 뼈대 적용 헬퍼 (LERP/SLERP 및 쿼터니언-오일러 인라인 수학식 포함)
 * [EN] Blended pose mixing helper (includes inline LERP/SLERP and quaternion-to-Euler conversion)
 */
function applyBlendedPose(
    mesh: any,
    key: string,
    poseFrom: Float32Array,
    poseTo: Float32Array,
    blendWeight: number,
    redGPUContext: RedGPUContext,
    computePassEncoder: GPUComputePassEncoder,
    trackFrom: AniTrack_GLTF,
    trackTo: AniTrack_GLTF
) {
    const PI_180 = 180 / Math.PI;
    switch (key) {
        case 'translation': {
            const fromX = poseFrom[0], fromY = poseFrom[1], fromZ = poseFrom[2];
            const toX = poseTo[0], toY = poseTo[1], toZ = poseTo[2];
            mesh.x = fromX + blendWeight * (toX - fromX);
            mesh.y = fromY + blendWeight * (toY - fromY);
            mesh.z = fromZ + blendWeight * (toZ - fromZ);
            break;
        }
        case 'rotation': {
            const q1x = poseFrom[0], q1y = poseFrom[1], q1z = poseFrom[2], q1w = poseFrom[3];
            let q2x = poseTo[0], q2y = poseTo[1], q2z = poseTo[2], q2w = poseTo[3];

            let cosHalftheta = q1x * q2x + q1y * q2y + q1z * q2z + q1w * q2w;
            if (cosHalftheta < 0) {
                cosHalftheta = -cosHalftheta;
                q2x = -q2x;
                q2y = -q2y;
                q2z = -q2z;
                q2w = -q2w;
            }

            let scale0, scale1;
            if ((1 - cosHalftheta) > 0.000001) {
                const halfTheta = Math.acos(cosHalftheta);
                const sinHalftheta = Math.sin(halfTheta);
                scale0 = Math.sin((1 - blendWeight) * halfTheta) / sinHalftheta;
                scale1 = Math.sin(blendWeight * halfTheta) / sinHalftheta;
            } else {
                scale0 = 1 - blendWeight;
                scale1 = blendWeight;
            }

            const tempX = scale0 * q1x + scale1 * q2x;
            const tempY = scale0 * q1y + scale1 * q2y;
            const tempZ = scale0 * q1z + scale1 * q2z;
            const tempW = scale0 * q1w + scale1 * q2w;

            // [quatToEuler inline]
            const x2 = tempX + tempX, y2 = tempY + tempY, z2 = tempZ + tempZ;
            const xx = tempX * x2, xy = tempX * y2, xz = tempX * z2;
            const yy = tempY * y2, yz = tempY * z2, zz = tempZ * z2;
            const wx = tempW * x2, wy = tempW * y2, wz = tempW * z2;
            const m13 = xz + wy;
            const m11 = 1 - (yy + zz);
            const m12 = xy - wz;
            const m23 = yz - wx;
            const m33 = 1 - (xx + yy);
            const m32 = yz + wx;
            const m22 = 1 - (xx + zz);
            let rotY = Math.asin(Math.max(-1, Math.min(1, m13)));
            let rotX, rotZ;
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
        case 'scale': {
            const fromX = poseFrom[0], fromY = poseFrom[1], fromZ = poseFrom[2];
            const toX = poseTo[0], toY = poseTo[1], toZ = poseTo[2];
            mesh.scaleX = fromX + blendWeight * (toX - fromX);
            mesh.scaleY = fromY + blendWeight * (toY - fromY);
            mesh.scaleZ = fromZ + blendWeight * (toZ - fromZ);
            break;
        }
        case 'weights': {
            const selectedTrack = blendWeight < 0.5 ? trackFrom : trackTo;
            const weightMeshes = selectedTrack.weightMeshes;
            let animationTargetIndex = weightMeshes.length;
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
 * [KO] glTF 애니메이션 모션 블렌딩 메인 진입 함수
 * [EN] Main entry function for glTF animation motion blending
 */
export default function gltfAnimationMotionBlending(
    redGPUContext: RedGPUContext,
    timestamp: number,
    computePassEncoder: GPUComputePassEncoder,
    targetPlayAnimationInfo: PlayAnimationInfo
) {
    const fromClip = targetPlayAnimationInfo.fromClip!;
    const toClip = targetPlayAnimationInfo.toClip!;
    const blendWeight = targetPlayAnimationInfo.blendWeight ?? 0.5;

    const maxTimeFrom = fromClip['maxTime'];
    const startTimeFrom = targetPlayAnimationInfo.startTimeFrom!;
    const timeFrom = ((timestamp - startTimeFrom) % (maxTimeFrom * 1000)) / 1000;

    const maxTimeTo = toClip['maxTime'];
    const startTimeTo = targetPlayAnimationInfo.startTimeTo!;
    const timeTo = ((timestamp - startTimeTo) % (maxTimeTo * 1000)) / 1000;

    // fromClip을 주축으로 돌며 동일 조인트 트랙 매칭 보간
    for (let i = 0; i < fromClip.length; i++) {
        const trackFrom = fromClip[i];

        // 룩업 캐싱
        const mesh = trackFrom.animationTargetMesh;
        const key = trackFrom.key;

        const trackTo = toClip.find(t => t.animationTargetMesh === mesh && t.key === key);

        if (trackTo) {
            const poseFrom = sampleTrackPose(trackFrom, timeFrom);
            const poseTo = sampleTrackPose(trackTo, timeTo);

            if (poseFrom && poseTo) {
                mesh.dirtyTransform = true;
                applyBlendedPose(
                    mesh,
                    key,
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
            const poseFrom = sampleTrackPose(trackFrom, timeFrom);
            if (poseFrom) {
                mesh.dirtyTransform = true;
                applySinglePose(
                    mesh,
                    key,
                    poseFrom,
                    redGPUContext,
                    computePassEncoder,
                    trackFrom
                );
            }
        }
    }

    // toClip에만 있고 fromClip에는 없는 독자 조인트 트랙 처리
    for (let j = 0; j < toClip.length; j++) {
        const trackTo = toClip[j];

        // 룩업 캐싱
        const mesh = trackTo.animationTargetMesh;
        const key = trackTo.key;

        const trackFrom = fromClip.find(t => t.animationTargetMesh === mesh && t.key === key);

        if (!trackFrom) {
            const poseTo = sampleTrackPose(trackTo, timeTo);
            if (poseTo) {
                mesh.dirtyTransform = true;
                applySinglePose(
                    mesh,
                    key,
                    poseTo,
                    redGPUContext,
                    computePassEncoder,
                    trackTo
                );
            }
        }
    }
}
