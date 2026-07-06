import {glMatrix} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import AniTrack_GLTF from "../cls/anitrack/AniTrack_GLTF";
import {PlayAnimationInfo} from "../GLTFLoader";

import {ClipAnimState} from "./AnimStateMachine";
import gltfAnimationMotionBlending from "./gltfAnimationMotionBlending";

// 최적화: 매 프레임 산술 연산 및 변수 생성을 방지하기 위해 상수를 파일 모듈 스코프로 승격
const PI_180 = 180 / Math.PI;

/**
 * [KO] GLTF 애니메이션 재생을 프레임 단위로 처리하는 매니저 클래스입니다.
 * [EN] Manager class that processes GLTF animation playback on a per-frame basis.
 *
 * [KO] 단일 재생 및 모션 블렌딩 두 가지 모드를 지원하며, 쿼터니언 보간(SLERP/CUBICSPLINE) 및 번역·스케일 보간을 최적화된 방식으로 수행합니다.
 * [EN] Supports both single playback and motion blending modes, performing quaternion interpolation (SLERP/CUBICSPLINE) and translation/scale interpolation in an optimized manner.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Loader
 */
class GltfAnimationLooperManager {
    /**
     * [KO] 애니메이션 목표 프레임레이트(FPS)
     * [EN] Target frame rate (FPS) for animation
     */
    #targetFps: number = 60;
    /**
     * [KO] 단일 프레임의 목표 경과 시간 (ms). `1000 / targetFps` 로 계산됩니다.
     * [EN] Target elapsed time per frame (ms). Calculated as `1000 / targetFps`.
     */
    #frameTime: number = 1000 / this.#targetFps; // 16.67ms
    /**
     * [KO] 마지막으로 프레임이 처리된 시각의 타임스탬프 (ms)
     * [EN] Timestamp (ms) of the last frame that was processed
     */
    #lastUpdateTime: number = 0;
    /**
     * [KO] 누적 처리된 프레임 수
     * [EN] Accumulated number of processed frames
     */
    #frameCount: number = 0;

    /**
     * [KO] 매 프레임 애니메이션을 처리하고 대상 메시의 변환 정보를 갱신합니다.
     * [EN] Processes animation every frame and updates the transform information of target meshes.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param timestamp -
     * [KO] 현재 프레임의 타임스탬프 (ms)
     * [EN] Current frame timestamp (ms)
     * @param computePassEncoder -
     * [KO] GPU 컴퓨트 패스 인코더 (Morph target 가중치 렌더링에 사용)
     * [EN] GPU compute pass encoder (used for morph target weight rendering)
     * @param playAnimationInfoList -
     * [KO] 현재 재생 중인 애니메이션 정보 목록
     * [EN] List of currently playing animation information
     */
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

        // ==========================================
        // [최적화] 함수 초입으로 변수 선언 호이스팅 (VM 레지스터 스필 소거)
        // ==========================================
        let playAnimationInfoIDX: number = playAnimationInfoList.length;
        let targetPlayAnimationInfo: PlayAnimationInfo;
        let animStateMachine;
        let isBlending: boolean;

        let fromClip: ClipAnimState;
        let maxTimeFrom: number;
        let startTime: number;
        let timeFrom: number;
        let targetAniTrackIDX: number;

        let trackFrom: AniTrack_GLTF;
        let mesh: any;
        let timeAnimationInfo: any;
        let aniDataAnimationInfo: any;
        let weightMeshes: any[];

        let targetTimeDataList: Float32Array;
        let targetAnimationDataList: Float32Array;
        let targetTimeDataListLength: number;

        let previousTimeDataIDX: number;
        let nextTimeDataIDX: number;
        let lastHint: number;
        let previousTimeFrame: number;
        let nextTimeFrame: number;

        let interpolationValue: number;
        let p: number, pp: number, ppp: number;
        let s0: number, s1: number, s2: number, s3: number;

        let interpolationType: number;
        let isCUBICSPLINE: boolean;

        let prevIdx: number;
        let nextIdx: number;
        let rX: number, rY: number, rZ: number, rW: number;
        let numericCacheKey: number;

        let cached: any;
        let cosomVal: number;
        let prevX: number, prevY: number, prevZ: number, prevW: number;
        let nextX: number, nextY: number, nextZ: number, nextW: number;
        let scale0: number, scale1: number;

        let x2: number, y2: number, z2: number;
        let xx: number, xy: number, xz: number;
        let yy: number, yz: number, zz: number;
        let wx: number, wy: number, wz: number;
        let m11: number, m12: number, m13: number;
        let m22: number, m23: number;
        let m32: number, m33: number;
        let rotY: number, rotX: number, rotZ: number;

        let nX: number, nY: number, nZ: number;
        let pX: number, pY: number, pZ: number;
        let pXOut: number, pYOut: number, pZOut: number;
        let nXOut: number, nYOut: number, nZOut: number;

        let animationTargetIndex: number;

        while (playAnimationInfoIDX--) {
            targetPlayAnimationInfo = playAnimationInfoList[playAnimationInfoIDX];

            // 룩업 최소화: 상태 머신 로컬 캐싱
            animStateMachine = targetPlayAnimationInfo.animStateMachine;
            if (animStateMachine) {
                animStateMachine.update(deltaTime, timestamp, targetPlayAnimationInfo);
            }

            // 룩업 최소화: 블렌딩 여부 로컬 캐싱
            isBlending = targetPlayAnimationInfo.isBlending;
            if (isBlending) {
                // 블렌딩 재생 모드 (외부 파일 모듈 위임)
                gltfAnimationMotionBlending(redGPUContext, timestamp, computePassEncoder, targetPlayAnimationInfo);
            } else {
                // ==========================================
                // 1. 단일 재생 모드 (씬 대다수의 액티브 애니메이션 오브젝트 - 초고속 다이렉트 핫 패스)
                // ==========================================
                fromClip = targetPlayAnimationInfo.targetGLTFParsedSingleClip;
                maxTimeFrom = fromClip.clip.maxTime;
                startTime = targetPlayAnimationInfo.startTime;
                timeFrom = ((timestamp - startTime) % (maxTimeFrom * 1000)) / 1000;
                targetAniTrackIDX = fromClip.clip.tracks.length;

                while (targetAniTrackIDX--) {
                    trackFrom = fromClip.clip.tracks[targetAniTrackIDX];

                    // 최적화: 구조 분해 할당을 대입문으로 해제하여 미세 임시 객체 생성을 회피
                    mesh = trackFrom.animationTargetMesh;
                    timeAnimationInfo = trackFrom.timeAnimationInfo;
                    aniDataAnimationInfo = trackFrom.aniDataAnimationInfo;
                    weightMeshes = trackFrom.weightMeshes;

                    mesh.dirtyTransform = true;

                    targetTimeDataList = timeAnimationInfo.dataList;
                    targetAnimationDataList = aniDataAnimationInfo.dataList;
                    targetTimeDataListLength = targetTimeDataList.length;

                    lastHint = trackFrom.lastPrevIdx || 0;

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
                    previousTimeFrame = targetTimeDataList[previousTimeDataIDX];
                    nextTimeFrame = targetTimeDataList[nextTimeDataIDX];

                    // 최적화: 정수형 보간 타입(interpolationType)으로 문자열 비교 회피 (2: CUBICSPLINE)
                    interpolationType = trackFrom.interpolationType;
                    isCUBICSPLINE = interpolationType === 2;

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
                        // 0: STEP
                        if (interpolationType === 0) {
                            interpolationValue = 0;
                        } else {
                            const timeRatio = (timeFrom - previousTimeFrame) / (nextTimeFrame - previousTimeFrame);
                            interpolationValue = timeRatio === timeRatio ? timeRatio : 0;
                        }
                    }

                    // 최적화: 정수형 키 타입(keyType) 점프 테이블 분기로 문자열 매칭 회피 (1: rotation, 2: translation, 3: scale, 4: weights)
                    switch (trackFrom.keyType) {
                        case 1: { // rotation
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
                                numericCacheKey = (prevIdx << 16) | nextIdx;

                                // 최적화: 해시 테이블 탐색 우회 바인딩 캐싱 가동
                                cached = trackFrom.lastCachedItem;
                                if (!cached || trackFrom.lastCachedKey !== numericCacheKey) {
                                    cached = trackFrom.cacheTable[numericCacheKey];
                                    if (!cached) {
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
                                        trackFrom.cacheTable[numericCacheKey] = cached;
                                    }
                                    trackFrom.lastCachedKey = numericCacheKey;
                                    trackFrom.lastCachedItem = cached;
                                }

                                cosomVal = cached[0];
                                prevX = cached[1];
                                prevY = cached[2];
                                prevZ = cached[3];
                                prevW = cached[4];
                                nextX = cached[5];
                                nextY = cached[6];
                                nextZ = cached[7];
                                nextW = cached[8];

                                if ((1 - cosomVal) > glMatrix.EPSILON) {
                                    const omega = Math.acos(cosomVal);
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
                            x2 = rX + rX;
                            y2 = rY + rY;
                            z2 = rZ + rZ;
                            xx = rX * x2;
                            xy = rX * y2;
                            xz = rX * z2;
                            yy = rY * y2;
                            yz = rY * z2;
                            zz = rZ * z2;
                            wx = rW * x2;
                            wy = rW * y2;
                            wz = rW * z2;
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
                        case 2: { // translation
                            if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                                const idx = previousTimeDataIDX * 3;
                                mesh.x = targetAnimationDataList[idx];
                                mesh.y = targetAnimationDataList[idx + 1];
                                mesh.z = targetAnimationDataList[idx + 2];
                            } else if (isCUBICSPLINE) {
                                prevIdx = previousTimeDataIDX * 9;
                                nX = targetAnimationDataList[prevIdx + 3];
                                nY = targetAnimationDataList[prevIdx + 4];
                                nZ = targetAnimationDataList[prevIdx + 5];
                                pXOut = targetAnimationDataList[prevIdx + 6];
                                pYOut = targetAnimationDataList[prevIdx + 7];
                                pZOut = targetAnimationDataList[prevIdx + 8];

                                nextIdx = nextTimeDataIDX * 9;
                                nXOut = targetAnimationDataList[nextIdx];
                                nYOut = targetAnimationDataList[nextIdx + 1];
                                nZOut = targetAnimationDataList[nextIdx + 2];
                                pX = targetAnimationDataList[nextIdx + 3];
                                pY = targetAnimationDataList[nextIdx + 4];
                                pZ = targetAnimationDataList[nextIdx + 5];

                                mesh.x = s0 * pX + s1 * pXOut * interpolationValue + s2 * nX + s3 * nXOut * interpolationValue;
                                mesh.y = s0 * pY + s1 * pYOut * interpolationValue + s2 * nY + s3 * nYOut * interpolationValue;
                                mesh.z = s0 * pZ + s1 * pZOut * interpolationValue + s2 * nZ + s3 * nZOut * interpolationValue;
                            } else {
                                prevIdx = nextTimeDataIDX * 3;
                                nX = targetAnimationDataList[prevIdx];
                                nY = targetAnimationDataList[prevIdx + 1];
                                nZ = targetAnimationDataList[prevIdx + 2];

                                nextIdx = previousTimeDataIDX * 3;
                                pX = targetAnimationDataList[nextIdx];
                                pY = targetAnimationDataList[nextIdx + 1];
                                pZ = targetAnimationDataList[nextIdx + 2];

                                mesh.x = pX + interpolationValue * (nX - pX);
                                mesh.y = pY + interpolationValue * (nY - pY);
                                mesh.z = pZ + interpolationValue * (nZ - pZ);
                            }
                            break;
                        }
                        case 3: { // scale
                            if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                                const idx = previousTimeDataIDX * 3;
                                mesh.scaleX = targetAnimationDataList[idx];
                                mesh.scaleY = targetAnimationDataList[idx + 1];
                                mesh.scaleZ = targetAnimationDataList[idx + 2];
                            } else if (isCUBICSPLINE) {
                                prevIdx = previousTimeDataIDX * 9;
                                nX = targetAnimationDataList[prevIdx + 3];
                                nY = targetAnimationDataList[prevIdx + 4];
                                nZ = targetAnimationDataList[prevIdx + 5];
                                pXOut = targetAnimationDataList[prevIdx + 6];
                                pYOut = targetAnimationDataList[prevIdx + 7];
                                pZOut = targetAnimationDataList[prevIdx + 8];

                                nextIdx = nextTimeDataIDX * 9;
                                nXOut = targetAnimationDataList[nextIdx];
                                nYOut = targetAnimationDataList[nextIdx + 1];
                                nZOut = targetAnimationDataList[nextIdx + 2];
                                pX = targetAnimationDataList[nextIdx + 3];
                                pY = targetAnimationDataList[nextIdx + 4];
                                pZ = targetAnimationDataList[nextIdx + 5];

                                mesh.scaleX = s0 * pX + s1 * pXOut * interpolationValue + s2 * nX + s3 * nXOut * interpolationValue;
                                mesh.scaleY = s0 * pY + s1 * pYOut * interpolationValue + s2 * nY + s3 * nYOut * interpolationValue;
                                mesh.scaleZ = s0 * pZ + s1 * pZOut * interpolationValue + s2 * nZ + s3 * nZOut * interpolationValue;
                            } else {
                                prevIdx = nextTimeDataIDX * 3;
                                nX = targetAnimationDataList[prevIdx];
                                nY = targetAnimationDataList[prevIdx + 1];
                                nZ = targetAnimationDataList[prevIdx + 2];

                                nextIdx = previousTimeDataIDX * 3;
                                pX = targetAnimationDataList[nextIdx];
                                pY = targetAnimationDataList[nextIdx + 1];
                                pZ = targetAnimationDataList[nextIdx + 2];

                                mesh.scaleX = pX + interpolationValue * (nX - pX);
                                mesh.scaleY = pY + interpolationValue * (nY - pY);
                                mesh.scaleZ = pZ + interpolationValue * (nZ - pZ);
                            }
                            break;
                        }
                        case 4: { // weights
                            animationTargetIndex = weightMeshes.length;
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
