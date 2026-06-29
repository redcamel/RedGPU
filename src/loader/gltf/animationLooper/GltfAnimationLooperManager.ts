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

            // 룩업 최소화: 상태 머신 로컬 캐싱
            const animStateMachine = targetPlayAnimationInfo.animStateMachine;
            if (animStateMachine) {
                animStateMachine.update(deltaTime, timestamp, targetPlayAnimationInfo);
            }

            // 룩업 최소화: 블렌딩 여부 로컬 캐싱
            const isBlending = targetPlayAnimationInfo.isBlending;
            if (isBlending) {
                // 블렌딩 재생 모드 (외부 파일 모듈 위임)
                gltfAnimationMotionBlending(redGPUContext, timestamp, computePassEncoder, targetPlayAnimationInfo);
            } else {
                // ==========================================
                // 1. 단일 재생 모드 (씬 대다수의 액티브 애니메이션 오브젝트 - 초고속 다이렉트 핫 패스)
                // ==========================================
                const fromClip = targetPlayAnimationInfo.targetGLTFParsedSingleClip;
                const maxTimeFrom = fromClip['maxTime'];
                const startTime = targetPlayAnimationInfo.startTime;
                const timeFrom = ((timestamp - startTime) % (maxTimeFrom * 1000)) / 1000;
                let targetAniTrackIDX = fromClip.length;

                while (targetAniTrackIDX--) {
                    const trackFrom = fromClip[targetAniTrackIDX];
                    const {animationTargetMesh, timeAnimationInfo, aniDataAnimationInfo, weightMeshes} = trackFrom;

                    // 룩업 최소화: 뼈대 타깃 메쉬 변수 캐싱
                    const mesh = animationTargetMesh;
                    mesh.dirtyTransform = true;

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
                    const previousTimeFrame = targetTimeDataList[previousTimeDataIDX];
                    const nextTimeFrame = targetTimeDataList[nextTimeDataIDX];

                    let interpolationValue: number;
                    let p: number, pp: number, ppp: number;
                    let s0: number, s1: number, s2: number, s3: number;
                    const interpolation = trackFrom.interpolation;
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

                    let prevIdx: number, nextIdx: number;

                    switch (trackFrom.key) {
                        case 'rotation': {
                            let rX, rY, rZ, rW;
                            if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                                const idx = previousTimeDataIDX << 2;
                                rX = targetAnimationDataList[idx];
                                rY = targetAnimationDataList[idx + 1];
                                rZ = targetAnimationDataList[idx + 2];
                                rW = targetAnimationDataList[idx + 3];
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

                                rX = s0 * prevX + s1 * prevOutX * interpolationValue + s2 * nextX + s3 * nextInX * interpolationValue;
                                rY = s0 * prevY + s1 * prevOutY * interpolationValue + s2 * nextY + s3 * nextInY * interpolationValue;
                                rZ = s0 * prevZ + s1 * prevOutZ * interpolationValue + s2 * nextX + s3 * nextInX * interpolationValue;
                                rW = s0 * prevW + s1 * prevOutW * interpolationValue + s2 * nextW + s3 * nextInW * interpolationValue;
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

                                rX = scale0 * prevX + scale1 * nextX;
                                rY = scale0 * prevY + scale1 * nextY;
                                rZ = scale0 * prevZ + scale1 * nextZ;
                                rW = scale0 * prevW + scale1 * nextW;
                            }

                            // [quatToEuler inline with rX, rY, rZ, rW]
                            const x2 = rX + rX, y2 = rY + rY, z2 = rZ + rZ;
                            const xx = rX * x2, xy = rX * y2, xz = rX * z2;
                            const yy = rY * y2, yz = rY * z2, zz = rZ * z2;
                            const wx = rW * x2, wy = rW * y2, wz = rW * z2;
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
                        case 'translation': {
                            if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                                const idx = previousTimeDataIDX * 3;
                                mesh.x = targetAnimationDataList[idx];
                                mesh.y = targetAnimationDataList[idx + 1];
                                mesh.z = targetAnimationDataList[idx + 2];
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

                                mesh.x = s0 * pX + s1 * pXOut * interpolationValue + s2 * nX + s3 * nXOut * interpolationValue;
                                mesh.y = s0 * pY + s1 * pYOut * interpolationValue + s2 * nY + s3 * nYOut * interpolationValue;
                                mesh.z = s0 * pZ + s1 * pZOut * interpolationValue + s2 * nZ + s3 * nZOut * interpolationValue;
                            } else {
                                prevIdx = nextTimeDataIDX * 3;
                                let nX = targetAnimationDataList[prevIdx];
                                let nY = targetAnimationDataList[prevIdx + 1];
                                let nZ = targetAnimationDataList[prevIdx + 2];

                                nextIdx = previousTimeDataIDX * 3;
                                let pX = targetAnimationDataList[nextIdx];
                                let pY = targetAnimationDataList[nextIdx + 1];
                                let pZ = targetAnimationDataList[nextIdx + 2];

                                mesh.x = pX + interpolationValue * (nX - pX);
                                mesh.y = pY + interpolationValue * (nY - pY);
                                mesh.z = pZ + interpolationValue * (nZ - pZ);
                            }
                            break;
                        }
                        case 'scale': {
                            if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                                const idx = previousTimeDataIDX * 3;
                                mesh.scaleX = targetAnimationDataList[idx];
                                mesh.scaleY = targetAnimationDataList[idx + 1];
                                mesh.scaleZ = targetAnimationDataList[idx + 2];
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

                                mesh.scaleX = s0 * pX + s1 * pXOut * interpolationValue + s2 * nX + s3 * nXOut * interpolationValue;
                                mesh.scaleY = s0 * pY + s1 * pYOut * interpolationValue + s2 * nY + s3 * nYOut * interpolationValue;
                                mesh.scaleZ = s0 * pZ + s1 * pZOut * interpolationValue + s2 * nZ + s3 * nZOut * interpolationValue;
                            } else {
                                prevIdx = nextTimeDataIDX * 3;
                                let nX = targetAnimationDataList[prevIdx];
                                let nY = targetAnimationDataList[prevIdx + 1];
                                let nZ = targetAnimationDataList[prevIdx + 2];

                                nextIdx = previousTimeDataIDX * 3;
                                let pX = targetAnimationDataList[nextIdx];
                                let pY = targetAnimationDataList[nextIdx + 1];
                                let pZ = targetAnimationDataList[nextIdx + 2];

                                mesh.scaleX = pX + interpolationValue * (nX - pX);
                                mesh.scaleY = pY + interpolationValue * (nY - pY);
                                mesh.scaleZ = pZ + interpolationValue * (nZ - pZ);
                            }
                            break;
                        }
                        case 'weights': {
                            let animationTargetIndex = weightMeshes.length;
                            while (animationTargetIndex--) {
                                trackFrom.renderWeight(
                                    redGPUContext,
                                    computePassEncoder,
                                    weightMeshes[animationTargetIndex],
                                    interpolationValue,
                                    previousTimeDataIDX,
                                    nextTimeDataIDX
                                );
                            }
                            break;
                        }
                    }
                }
            }
        }
    };
}

export default GltfAnimationLooperManager;
