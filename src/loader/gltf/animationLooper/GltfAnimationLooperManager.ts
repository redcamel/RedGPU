import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import AniTrack_GLTF from "../cls/anitrack/AniTrack_GLTF";
import {PlayAnimationInfo} from "../GLTFLoader";
import {ClipAnimState} from "./AnimStateMachine";
import {
    applyQuatToMeshRotation,
    computeInterpolationParams,
    findKeyframeSegment,
    sampleQuatTrack,
    sampleVec3Track
} from "./gltfAnimationMath";
import gltfAnimationMotionBlending from "./gltfAnimationMotionBlending";

const SEGMENT_INDICES_BUF = new Int32Array(2);
const CUBIC_PARAMS_BUF = new Float32Array(4);
const POSE_BUF = new Float32Array(4);

/**
 * [KO] GLTF 애니메이션의 단일 재생 및 모션 블렌딩을 프레임 단위로 처리하고 회전·이동·스케일·모프 가중치 보간을 수행하는 매니저 클래스입니다.
 * [EN] Manager class that processes single playback and motion blending of GLTF animations per frame and interpolates rotation, translation, scale, and morph weights.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Loader
 */
class GltfAnimationLooperManager {
    #lastUpdateTime: number = 0;

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
        this.#lastUpdateTime = now;

        let playAnimationInfoIDX: number = playAnimationInfoList.length;
        let targetPlayAnimationInfo: PlayAnimationInfo;
        let animStateMachine;
        let fromClip: ClipAnimState;
        let timeFrom: number;
        let targetAniTrackIDX: number;
        let trackFrom: AniTrack_GLTF;
        let mesh: Mesh;
        let targetTimeDataList: Float32Array;
        let targetAnimationDataList: Float32Array;
        let targetTimeDataListLength: number;
        let previousTimeDataIDX: number;
        let nextTimeDataIDX: number;
        let interpolationType: number;
        let isCUBICSPLINE: boolean;
        let interpolationValue: number;
        let weightMeshes: Mesh[];
        let animationTargetIndex: number;

        while (playAnimationInfoIDX--) {
            targetPlayAnimationInfo = playAnimationInfoList[playAnimationInfoIDX];

            animStateMachine = targetPlayAnimationInfo.animStateMachine;
            if (animStateMachine) {
                animStateMachine.update(deltaTime, timestamp, targetPlayAnimationInfo);
            }

            if (targetPlayAnimationInfo.isBlending) {
                gltfAnimationMotionBlending(redGPUContext, timestamp, computePassEncoder, targetPlayAnimationInfo);
            } else {
                fromClip = targetPlayAnimationInfo.targetGLTFParsedSingleClip;
                timeFrom = ((timestamp - targetPlayAnimationInfo.startTime) % (fromClip.clip.maxTime * 1000)) / 1000;
                targetAniTrackIDX = fromClip.clip.tracks.length;

                while (targetAniTrackIDX--) {
                    trackFrom = fromClip.clip.tracks[targetAniTrackIDX];
                    mesh = trackFrom.animationTargetMesh;
                    weightMeshes = trackFrom.weightMeshes;
                    mesh.dirtyTransform = true;

                    targetTimeDataList = trackFrom.timeAnimationInfo.dataList;
                    targetAnimationDataList = trackFrom.aniDataAnimationInfo.dataList;
                    targetTimeDataListLength = targetTimeDataList.length;

                    findKeyframeSegment(targetTimeDataList, timeFrom, trackFrom.lastPrevIdx || 0, SEGMENT_INDICES_BUF);
                    previousTimeDataIDX = SEGMENT_INDICES_BUF[0];
                    nextTimeDataIDX = SEGMENT_INDICES_BUF[1];
                    trackFrom.lastPrevIdx = previousTimeDataIDX;

                    interpolationType = trackFrom.interpolationType;
                    isCUBICSPLINE = interpolationType === 2;
                    interpolationValue = computeInterpolationParams(
                        timeFrom,
                        targetTimeDataList[previousTimeDataIDX],
                        targetTimeDataList[nextTimeDataIDX],
                        interpolationType,
                        CUBIC_PARAMS_BUF
                    );

                    switch (trackFrom.keyType) {
                        case 1: {
                            sampleQuatTrack(
                                trackFrom,
                                targetAnimationDataList,
                                previousTimeDataIDX,
                                nextTimeDataIDX,
                                targetTimeDataListLength,
                                isCUBICSPLINE,
                                interpolationValue,
                                CUBIC_PARAMS_BUF,
                                POSE_BUF
                            );
                            applyQuatToMeshRotation(mesh, POSE_BUF[0], POSE_BUF[1], POSE_BUF[2], POSE_BUF[3]);
                            break;
                        }
                        case 2: {
                            sampleVec3Track(
                                targetAnimationDataList,
                                previousTimeDataIDX,
                                nextTimeDataIDX,
                                targetTimeDataListLength,
                                isCUBICSPLINE,
                                interpolationValue,
                                CUBIC_PARAMS_BUF,
                                POSE_BUF
                            );
                            mesh.x = POSE_BUF[0];
                            mesh.y = POSE_BUF[1];
                            mesh.z = POSE_BUF[2];
                            break;
                        }
                        case 3: {
                            sampleVec3Track(
                                targetAnimationDataList,
                                previousTimeDataIDX,
                                nextTimeDataIDX,
                                targetTimeDataListLength,
                                isCUBICSPLINE,
                                interpolationValue,
                                CUBIC_PARAMS_BUF,
                                POSE_BUF
                            );
                            mesh.scaleX = POSE_BUF[0];
                            mesh.scaleY = POSE_BUF[1];
                            mesh.scaleZ = POSE_BUF[2];
                            break;
                        }
                        case 4: {
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
                        case 5: {
                            const binding = trackFrom.pointerBinding;
                            if (!binding) break;
                            const c = binding.componentCount;
                            let v0 = 0, v1 = 0, v2 = 0, v3 = 0;
                            if (previousTimeDataIDX === targetTimeDataListLength - 1) {
                                const base = isCUBICSPLINE ? (previousTimeDataIDX * c * 3 + c) : (previousTimeDataIDX * c);
                                v0 = targetAnimationDataList[base];
                                if (c > 1) v1 = targetAnimationDataList[base + 1];
                                if (c > 2) v2 = targetAnimationDataList[base + 2];
                                if (c > 3) v3 = targetAnimationDataList[base + 3];
                            } else if (isCUBICSPLINE) {
                                const stride = c * 3;
                                const pBase = previousTimeDataIDX * stride;
                                const nBase = nextTimeDataIDX * stride;
                                const dt = targetTimeDataList[nextTimeDataIDX] - targetTimeDataList[previousTimeDataIDX];
                                const s0 = CUBIC_PARAMS_BUF[0];
                                const s1 = CUBIC_PARAMS_BUF[1];
                                const s2 = CUBIC_PARAMS_BUF[2];
                                const s3 = CUBIC_PARAMS_BUF[3];
                                v0 = s0 * targetAnimationDataList[pBase + c] + s1 * targetAnimationDataList[pBase + c * 2] * dt + s2 * targetAnimationDataList[nBase + c] + s3 * targetAnimationDataList[nBase] * dt;
                                if (c > 1) v1 = s0 * targetAnimationDataList[pBase + c + 1] + s1 * targetAnimationDataList[pBase + c * 2 + 1] * dt + s2 * targetAnimationDataList[nBase + c + 1] + s3 * targetAnimationDataList[nBase + 1] * dt;
                                if (c > 2) v2 = s0 * targetAnimationDataList[pBase + c + 2] + s1 * targetAnimationDataList[pBase + c * 2 + 2] * dt + s2 * targetAnimationDataList[nBase + c + 2] + s3 * targetAnimationDataList[nBase + 2] * dt;
                                if (c > 3) v3 = s0 * targetAnimationDataList[pBase + c + 3] + s1 * targetAnimationDataList[pBase + c * 2 + 3] * dt + s2 * targetAnimationDataList[nBase + c + 3] + s3 * targetAnimationDataList[nBase + 3] * dt;
                            } else {
                                const pBase = previousTimeDataIDX * c;
                                const nBase = nextTimeDataIDX * c;
                                v0 = targetAnimationDataList[pBase] + interpolationValue * (targetAnimationDataList[nBase] - targetAnimationDataList[pBase]);
                                if (c > 1) v1 = targetAnimationDataList[pBase + 1] + interpolationValue * (targetAnimationDataList[nBase + 1] - targetAnimationDataList[pBase + 1]);
                                if (c > 2) v2 = targetAnimationDataList[pBase + 2] + interpolationValue * (targetAnimationDataList[nBase + 2] - targetAnimationDataList[pBase + 2]);
                                if (c > 3) v3 = targetAnimationDataList[pBase + 3] + interpolationValue * (targetAnimationDataList[nBase + 3] - targetAnimationDataList[pBase + 3]);
                            }
                            binding.apply(v0, v1, v2, v3);
                            break;
                        }
                    }
                }
            }
        }
    };
}

export default GltfAnimationLooperManager;
