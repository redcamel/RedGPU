import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import AniTrack_GLTF from "../cls/anitrack/AniTrack_GLTF";
import {PlayAnimationInfo} from "../GLTFLoader";
import {
    applyQuatToMeshRotation,
    computeInterpolationParams,
    findKeyframeSegment,
    sampleQuatTrack,
    sampleVec3Track,
    slerpQuat
} from "./gltfAnimationMath";

const EMPTY_MORPH_POSE = new Float32Array(0);
const SEGMENT_INDICES_BUF = new Int32Array(2);
const CUBIC_PARAMS_BUF = new Float32Array(4);
const POSE_FROM_BUF = new Float32Array(4);
const POSE_TO_BUF = new Float32Array(4);
const BLENDED_QUAT_BUF = new Float32Array(4);

/**
 * [KO] 지정된 시간에서 단일 애니메이션 트랙의 키프레임 포즈를 샘플링하여 출력 버퍼에 기록합니다.
 * [EN] Samples the keyframe pose of a single animation track at the specified time and writes it into the output buffer.
 *
 * @param track -
 * [KO] 샘플링할 대상 애니메이션 트랙
 * [EN] Target animation track to sample
 * @param time -
 * [KO] 샘플링할 애니메이션 시간 (초)
 * [EN] Animation time to sample (in seconds)
 * @param out -
 * [KO] 결과를 기록할 재사용 `Float32Array(4)` 버퍼
 * [EN] Reusable `Float32Array(4)` buffer to store the sampled pose
 * @returns
 * [KO] 샘플링된 포즈 데이터 또는 `null`
 * [EN] Sampled pose data or `null`
 */
function sampleTrackPose(track: AniTrack_GLTF, time: number, out: Float32Array): Float32Array | null {
    const interpolationType = track.interpolationType;
    const isCUBICSPLINE = interpolationType === 2;
    const targetTimeDataList = track.timeAnimationInfo.dataList;
    const targetAnimationDataList = track.aniDataAnimationInfo.dataList;
    const targetTimeDataListLength = targetTimeDataList.length;

    findKeyframeSegment(targetTimeDataList, time, track.lastPrevIdx || 0, SEGMENT_INDICES_BUF);
    const previousTimeDataIDX = SEGMENT_INDICES_BUF[0];
    const nextTimeDataIDX = SEGMENT_INDICES_BUF[1];

    track.lastPrevIdx = previousTimeDataIDX;
    track.lastNextIdx = nextTimeDataIDX;

    const interpolationValue = computeInterpolationParams(
        time,
        targetTimeDataList[previousTimeDataIDX],
        targetTimeDataList[nextTimeDataIDX],
        interpolationType,
        CUBIC_PARAMS_BUF
    );
    track.lastInterpolationValue = interpolationValue;

    switch (track.keyType) {
        case 1:
            sampleQuatTrack(
                track,
                targetAnimationDataList,
                previousTimeDataIDX,
                nextTimeDataIDX,
                targetTimeDataListLength,
                isCUBICSPLINE,
                interpolationValue,
                CUBIC_PARAMS_BUF,
                out
            );
            return out;
        case 2:
        case 3:
            sampleVec3Track(
                targetAnimationDataList,
                previousTimeDataIDX,
                nextTimeDataIDX,
                targetTimeDataListLength,
                isCUBICSPLINE,
                interpolationValue,
                CUBIC_PARAMS_BUF,
                out
            );
            return out;
        case 4:
            return EMPTY_MORPH_POSE;
    }
    return null;
}

/**
 * [KO] 샘플링된 단일 포즈를 대상 메쉬 또는 모프 타겟에 적용합니다.
 * [EN] Applies a sampled single pose to the target mesh or morph target.
 */
function applySinglePose(
    mesh: Mesh,
    keyType: number,
    pose: Float32Array,
    redGPUContext: RedGPUContext,
    computePassEncoder: GPUComputePassEncoder,
    track: AniTrack_GLTF
) {
    switch (keyType) {
        case 2:
            mesh.x = pose[0];
            mesh.y = pose[1];
            mesh.z = pose[2];
            break;
        case 1:
            applyQuatToMeshRotation(mesh, pose[0], pose[1], pose[2], pose[3]);
            break;
        case 3:
            mesh.scaleX = pose[0];
            mesh.scaleY = pose[1];
            mesh.scaleZ = pose[2];
            break;
        case 4: {
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
 * [KO] 두 개의 샘플링된 포즈를 가중치에 따라 보간(LERP/SLERP)하여 대상 메쉬에 적용합니다.
 * [EN] Interpolates (LERP/SLERP) two sampled poses according to the blend weight and applies them to the target mesh.
 */
function applyBlendedPose(
    mesh: Mesh,
    keyType: number,
    poseFrom: Float32Array,
    poseTo: Float32Array,
    blendWeight: number,
    redGPUContext: RedGPUContext,
    computePassEncoder: GPUComputePassEncoder,
    trackFrom: AniTrack_GLTF,
    trackTo: AniTrack_GLTF
) {
    switch (keyType) {
        case 2: {
            const fromX = poseFrom[0];
            const fromY = poseFrom[1];
            const fromZ = poseFrom[2];
            mesh.x = fromX + blendWeight * (poseTo[0] - fromX);
            mesh.y = fromY + blendWeight * (poseTo[1] - fromY);
            mesh.z = fromZ + blendWeight * (poseTo[2] - fromZ);
            break;
        }
        case 1: {
            slerpQuat(
                poseFrom[0], poseFrom[1], poseFrom[2], poseFrom[3],
                poseTo[0], poseTo[1], poseTo[2], poseTo[3],
                blendWeight,
                BLENDED_QUAT_BUF
            );
            applyQuatToMeshRotation(
                mesh,
                BLENDED_QUAT_BUF[0],
                BLENDED_QUAT_BUF[1],
                BLENDED_QUAT_BUF[2],
                BLENDED_QUAT_BUF[3]
            );
            break;
        }
        case 3: {
            const fromX = poseFrom[0];
            const fromY = poseFrom[1];
            const fromZ = poseFrom[2];
            mesh.scaleX = fromX + blendWeight * (poseTo[0] - fromX);
            mesh.scaleY = fromY + blendWeight * (poseTo[1] - fromY);
            mesh.scaleZ = fromZ + blendWeight * (poseTo[2] - fromZ);
            break;
        }
        case 4: {
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
 * [KO] 두 glTF 애니메이션 클립 간의 모션 블렌딩을 계산하고 대상 메쉬들에 적용합니다.
 * [EN] Computes motion blending between two glTF animation clips and applies it to the target meshes.
 *
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트
 * [EN] RedGPU context
 * @param timestamp -
 * [KO] 현재 프레임 타임스탬프 (밀리초)
 * [EN] Current frame timestamp (in milliseconds)
 * @param computePassEncoder -
 * [KO] 컴퓨트 패스 인코더
 * [EN] Compute pass encoder
 * @param targetPlayAnimationInfo -
 * [KO] 블렌딩할 애니메이션 재생 정보
 * [EN] Animation playback information to blend
 * @category GLTF
 */
export default function gltfAnimationMotionBlending(
    redGPUContext: RedGPUContext,
    timestamp: number,
    computePassEncoder: GPUComputePassEncoder,
    targetPlayAnimationInfo: PlayAnimationInfo
) {
    const fromClip = targetPlayAnimationInfo.fromClip;
    const toClip = targetPlayAnimationInfo.toClip;
    if (!fromClip || !toClip) return;
    const blendWeight = targetPlayAnimationInfo.blendWeight ?? 0.5;

    const maxTimeFrom = fromClip.clip.maxTime;
    const startTimeFrom = targetPlayAnimationInfo.startTimeFrom ?? timestamp;
    const timeFrom = ((timestamp - startTimeFrom) % (maxTimeFrom * 1000)) / 1000;

    const maxTimeTo = toClip.clip.maxTime;
    const startTimeTo = targetPlayAnimationInfo.startTimeTo ?? timestamp;
    const timeTo = ((timestamp - startTimeTo) % (maxTimeTo * 1000)) / 1000;

    const fromTracks = fromClip.clip.tracks;
    for (let i = 0, len = fromTracks.length; i < len; i++) {
        const trackFrom = fromTracks[i];
        const mesh = trackFrom.animationTargetMesh;
        const keyType = trackFrom.keyType;
        const trackTo = toClip.clip.findTrack(mesh, keyType);

        if (trackTo) {
            const poseFrom = sampleTrackPose(trackFrom, timeFrom, POSE_FROM_BUF);
            const poseTo = sampleTrackPose(trackTo, timeTo, POSE_TO_BUF);

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
            const poseFrom = sampleTrackPose(trackFrom, timeFrom, POSE_FROM_BUF);
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

    const toTracks = toClip.clip.tracks;
    for (let j = 0, len = toTracks.length; j < len; j++) {
        const trackToSingle = toTracks[j];
        const meshSingle = trackToSingle.animationTargetMesh;
        const keyTypeSingle = trackToSingle.keyType;
        const trackFromSingle = fromClip.clip.findTrack(meshSingle, keyTypeSingle);

        if (!trackFromSingle) {
            const poseToSingle = sampleTrackPose(trackToSingle, timeTo, POSE_TO_BUF);
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
