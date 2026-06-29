import {glMatrix} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import {PlayAnimationInfo} from "../GLTFLoader";
import gltfAnimationMotionBlending from "./gltfAnimationMotionBlending";

class GltfAnimationLooperManager {
    #targetFps: number = 60;
    #frameTime: number = 1000 / this.#targetFps; // 16.67ms
    #lastUpdateTime: number = 0;
    #frameCount: number = 0;

    render = (
        redGPUContext: RedGPUContext,
        timestamp: number,
        computePassEncoder: GPUComputePassEncoder,
        playAnimationInfoList: PlayAnimationInfo[],
    ) => {
        const now = timestamp;
        const deltaTime = now - this.#lastUpdateTime;
        if (deltaTime < this.#frameTime) {
            // return;
        }
        this.#lastUpdateTime = now;
        this.#frameCount++;

        const PI_180 = 180 / Math.PI;
        let playAnimationInfoIDX: number = playAnimationInfoList.length;
        let targetPlayAnimationInfo: PlayAnimationInfo;

        while (playAnimationInfoIDX--) {
            targetPlayAnimationInfo = playAnimationInfoList[playAnimationInfoIDX];

            // 상태 머신 업데이트 위임
            if (targetPlayAnimationInfo.animStateMachine) {
                targetPlayAnimationInfo.animStateMachine.update(deltaTime, timestamp, targetPlayAnimationInfo);
            }

            if (targetPlayAnimationInfo.isBlending) {
                // 블렌딩 재생 모드 (외부 파일 모듈 위임)
                gltfAnimationMotionBlending(redGPUContext, timestamp, computePassEncoder, targetPlayAnimationInfo);
            } else {
                // ==========================================
                // 1. 단일 재생 모드 (씬 대다수의 액티브 애니메이션 오브젝트 - 초고속 인라인 유지)
                // ==========================================
                const fromClip = targetPlayAnimationInfo.targetGLTFParsedSingleClip;
                const maxTimeFrom = fromClip['maxTime'];
                const timeFrom = ((timestamp - targetPlayAnimationInfo.startTime) % (maxTimeFrom * 1000)) / 1000;
                let targetAniTrackIDX = fromClip.length;

                while (targetAniTrackIDX--) {
                    const trackFrom = fromClip[targetAniTrackIDX];
                    let poseFrom: Float32Array | null = null;

                    // [Inline sampleTrackPose for trackFrom with timeFrom]
                    {
                        const {timeAnimationInfo, aniDataAnimationInfo, interpolation} = trackFrom;
                        const targetTimeDataList = timeAnimationInfo.dataList;
                        const targetAnimationDataList = aniDataAnimationInfo.dataList;
                        const targetTimeDataListLength = targetTimeDataList.length;

                        let previousTimeDataIDX: number;
                        let nextTimeDataIDX: number;
                        const lastHint = trackFrom.lastPrevIdx || 0;

                        if (lastHint < targetTimeDataListLength - 1) {
                            if (targetTimeDataList[lastHint] <= timeFrom && timeFrom < targetTimeDataList[lastHint + 1]) {
                                previousTimeDataIDX = lastHint;
                                nextTimeDataIDX = lastHint + 1;
                            } else if (lastHint + 1 < targetTimeDataListLength - 1 &&
                                targetTimeDataList[lastHint + 1] <= timeFrom &&
                                timeFrom < targetTimeDataList[lastHint + 2]) {
                                previousTimeDataIDX = lastHint + 1;
                                nextTimeDataIDX = lastHint + 2;
                            } else {
                                if (timeFrom <= targetTimeDataList[0]) {
                                    previousTimeDataIDX = targetTimeDataListLength - 1;
                                    nextTimeDataIDX = 0;
                                } else if (timeFrom >= targetTimeDataList[targetTimeDataListLength - 1]) {
                                    previousTimeDataIDX = targetTimeDataListLength - 1;
                                    nextTimeDataIDX = 0;
                                } else {
                                    let left = 0;
                                    let right = targetTimeDataListLength - 1;
                                    while (left < right - 1) {
                                        const mid = (left + right) >> 1;
                                        if (targetTimeDataList[mid] <= timeFrom) {
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
                            if (timeFrom <= targetTimeDataList[0]) {
                                previousTimeDataIDX = targetTimeDataListLength - 1;
                                nextTimeDataIDX = 0;
                            } else if (timeFrom >= targetTimeDataList[targetTimeDataListLength - 1]) {
                                previousTimeDataIDX = targetTimeDataListLength - 1;
                                nextTimeDataIDX = 0;
                            } else {
                                let left = 0;
                                let right = targetTimeDataListLength - 1;
                                while (left < right - 1) {
                                    const mid = (left + right) >> 1;
                                    if (targetTimeDataList[mid] <= timeFrom) {
                                        left = mid;
                                    } else {
                                        right = mid;
                                    }
                                }
                                previousTimeDataIDX = left;
                                nextTimeDataIDX = right;
                            }
                        }

                        trackFrom.lastPrevIdx = previousTimeDataIDX;
                        trackFrom.lastNextIdx = nextTimeDataIDX;
                        const previousTimeFrame = targetTimeDataList[previousTimeDataIDX];
                        const nextTimeFrame = targetTimeDataList[nextTimeDataIDX];

                        let interpolationValue: number;
                        let p: number, pp: number, ppp: number;
                        let s0: number, s1: number, s2: number, s3: number;
                        const isCUBICSPLINE = interpolation === 'CUBICSPLINE';

                        if (isCUBICSPLINE) {
                            const timeDiff = nextTimeFrame - previousTimeFrame;
                            interpolationValue = timeDiff === timeDiff ? timeDiff : 0;
                            const timeRatio = (timeFrom - previousTimeFrame) / interpolationValue;
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
                                const timeRatio = (timeFrom - previousTimeFrame) / (nextTimeFrame - previousTimeFrame);
                                interpolationValue = timeRatio === timeRatio ? timeRatio : 0;
                            }
                        }

                        trackFrom.lastInterpolationValue = interpolationValue;
                        let prevIdx: number, nextIdx: number;

                        switch (trackFrom.key) {
                            case 'rotation': {
                                poseFrom = new Float32Array(4);
                                if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                                    const idx = previousTimeDataIDX << 2;
                                    poseFrom[0] = targetAnimationDataList[idx];
                                    poseFrom[1] = targetAnimationDataList[idx + 1];
                                    poseFrom[2] = targetAnimationDataList[idx + 2];
                                    poseFrom[3] = targetAnimationDataList[idx + 3];
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

                                    poseFrom[0] = s0 * prevX + s1 * prevOutX * interpolationValue + s2 * nextX + s3 * nextInX * interpolationValue;
                                    poseFrom[1] = s0 * prevY + s1 * prevOutY * interpolationValue + s2 * nextY + s3 * nextInY * interpolationValue;
                                    poseFrom[2] = s0 * prevZ + s1 * prevOutZ * interpolationValue + s2 * nextX + s3 * nextInX * interpolationValue;
                                    poseFrom[3] = s0 * prevW + s1 * prevOutW * interpolationValue + s2 * nextW + s3 * nextInW * interpolationValue;
                                } else {
                                    prevIdx = previousTimeDataIDX << 2;
                                    nextIdx = nextTimeDataIDX << 2;
                                    const numericCacheKey = (prevIdx << 16) | nextIdx;
                                    let cached = trackFrom.cacheTable[numericCacheKey];
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
                                        trackFrom.cacheTable[numericCacheKey] = cached;
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

                                    poseFrom[0] = scale0 * prevX + scale1 * nextX;
                                    poseFrom[1] = scale0 * prevY + scale1 * nextY;
                                    poseFrom[2] = scale0 * prevZ + scale1 * nextZ;
                                    poseFrom[3] = scale0 * prevW + scale1 * nextW;
                                }
                                break;
                            }
                            case 'translation':
                            case 'scale': {
                                poseFrom = new Float32Array(3);
                                if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                                    const idx = previousTimeDataIDX * 3;
                                    poseFrom[0] = targetAnimationDataList[idx];
                                    poseFrom[1] = targetAnimationDataList[idx + 1];
                                    poseFrom[2] = targetAnimationDataList[idx + 2];
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

                                    poseFrom[0] = s0 * pX + s1 * pXOut * interpolationValue + s2 * nX + s3 * nXOut * interpolationValue;
                                    poseFrom[1] = s0 * pY + s1 * pYOut * interpolationValue + s2 * nY + s3 * nYOut * interpolationValue;
                                    poseFrom[2] = s0 * pZ + s1 * pZOut * interpolationValue + s2 * nZ + s3 * nZOut * interpolationValue;
                                } else {
                                    prevIdx = nextTimeDataIDX * 3;
                                    let nX = targetAnimationDataList[prevIdx];
                                    let nY = targetAnimationDataList[prevIdx + 1];
                                    let nZ = targetAnimationDataList[prevIdx + 2];

                                    nextIdx = previousTimeDataIDX * 3;
                                    let pX = targetAnimationDataList[nextIdx];
                                    let pY = targetAnimationDataList[nextIdx + 1];
                                    let pZ = targetAnimationDataList[nextIdx + 2];

                                    poseFrom[0] = pX + interpolationValue * (nX - pX);
                                    poseFrom[1] = pY + interpolationValue * (nY - pY);
                                    poseFrom[2] = pZ + interpolationValue * (nZ - pZ);
                                }
                                break;
                            }
                            case 'weights': {
                                const morphLength = trackFrom.weightMeshes[0]?.animationInfo.morphInfo.morphInfoDataList.length || 0;
                                poseFrom = new Float32Array(morphLength);
                                if (morphLength > 0) {
                                    for (let i = 0; i < morphLength; i++) {
                                        const prevW = targetAnimationDataList[previousTimeDataIDX * morphLength + i];
                                        const nextW = targetAnimationDataList[nextTimeDataIDX * morphLength + i];
                                        poseFrom[i] = prevW + interpolationValue * (nextW - prevW);
                                    }
                                }
                                break;
                            }
                        }
                    }

                    if (poseFrom) {
                        trackFrom.animationTargetMesh.dirtyTransform = true;
                        switch (trackFrom.key) {
                            case 'translation': {
                                trackFrom.animationTargetMesh.x = poseFrom[0];
                                trackFrom.animationTargetMesh.y = poseFrom[1];
                                trackFrom.animationTargetMesh.z = poseFrom[2];
                                break;
                            }
                            case 'rotation': {
                                // [quatToEuler inline]
                                const tempX = poseFrom[0], tempY = poseFrom[1], tempZ = poseFrom[2],
                                    tempW = poseFrom[3];
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

                                trackFrom.animationTargetMesh.rotationX = rotX * PI_180;
                                trackFrom.animationTargetMesh.rotationY = rotY * PI_180;
                                trackFrom.animationTargetMesh.rotationZ = rotZ * PI_180;
                                break;
                            }
                            case 'scale': {
                                trackFrom.animationTargetMesh.scaleX = poseFrom[0];
                                trackFrom.animationTargetMesh.scaleY = poseFrom[1];
                                trackFrom.animationTargetMesh.scaleZ = poseFrom[2];
                                break;
                            }
                            case 'weights': {
                                let animationTargetIndex = trackFrom.weightMeshes.length;
                                while (animationTargetIndex--) {
                                    trackFrom.renderWeight(
                                        redGPUContext,
                                        computePassEncoder,
                                        trackFrom.weightMeshes[animationTargetIndex],
                                        trackFrom.lastInterpolationValue,
                                        trackFrom.lastPrevIdx,
                                        trackFrom.lastNextIdx
                                    );
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    };
}

export default GltfAnimationLooperManager;
