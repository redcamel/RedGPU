import {glMatrix} from "gl-matrix";
import AniTrack_GLTF from "../cls/anitrack/AniTrack_GLTF";

const PI_180 = 180 / Math.PI;
const SLERP_EPSILON = glMatrix.EPSILON;

const normalizeQuatInto = (
    x: number,
    y: number,
    z: number,
    w: number,
    out: Float32Array,
    offset: number
): void => {
    const lenSq = x * x + y * y + z * z + w * w;
    if (lenSq > 0) {
        const invLen = 1 / Math.sqrt(lenSq);
        out[offset] = x * invLen;
        out[offset + 1] = y * invLen;
        out[offset + 2] = z * invLen;
        out[offset + 3] = w * invLen;
    } else {
        out[offset] = 0;
        out[offset + 1] = 0;
        out[offset + 2] = 0;
        out[offset + 3] = 1;
    }
};

const TEMP_CUBIC_QUATS = new Float32Array(16);

/**
 * [KO] 키프레임 타임스탬프 배열에서 현재 시간에 해당하는 `[prevIdx, nextIdx]` 구간을 O(1) 힌트 검사 및 O(log N) 이진 탐색으로 찾아 `outIndices`에 기록합니다.
 * [EN] Finds the `[prevIdx, nextIdx]` keyframe segment for the given time via O(1) hint check and O(log N) binary search, writing the result into `outIndices`.
 *
 * @param timeList -
 * [KO] 오름차순 정렬된 키프레임 시간 `Float32Array`
 * [EN] Ascending keyframe timestamp `Float32Array`
 * @param time -
 * [KO] 조회할 애니메이션 시간 (초)
 * [EN] Target animation time in seconds
 * @param lastHint -
 * [KO] 직전 프레임의 시작 키프레임 인덱스 힌트
 * [EN] Previous frame's starting keyframe index hint
 * @param outIndices -
 * [KO] `[prevIdx, nextIdx]` 결과를 기록할 `Int32Array(2)` 버퍼
 * [EN] Reusable `Int32Array(2)` buffer receiving `[prevIdx, nextIdx]`
 * @category GLTF
 */
export const findKeyframeSegment = (
    timeList: Float32Array,
    time: number,
    lastHint: number,
    outIndices: Int32Array
): void => {
    const lastIdx = timeList.length - 1;
    if (lastHint < lastIdx) {
        if (timeList[lastHint] <= time && time < timeList[lastHint + 1]) {
            outIndices[0] = lastHint;
            outIndices[1] = lastHint + 1;
            return;
        }
        if (lastHint + 1 < lastIdx && timeList[lastHint + 1] <= time && time < timeList[lastHint + 2]) {
            outIndices[0] = lastHint + 1;
            outIndices[1] = lastHint + 2;
            return;
        }
    }

    if (time <= timeList[0] || time >= timeList[lastIdx]) {
        outIndices[0] = lastIdx;
        outIndices[1] = 0;
        return;
    }

    let left = 0;
    let right = lastIdx;
    while (left < right - 1) {
        const mid = (left + right) >> 1;
        if (timeList[mid] <= time) {
            left = mid;
        } else {
            right = mid;
        }
    }
    outIndices[0] = left;
    outIndices[1] = right;
};

/**
 * [KO] 보간 타입(`0: STEP`, `1: LINEAR`, `2: CUBICSPLINE`)에 따라 보간 계수를 계산합니다. `CUBICSPLINE`인 경우 `outCubicParams[0..3]`에 `s0..s3`를 기록하고 `dt`를 반환합니다.
 * [EN] Computes interpolation parameters for the given interpolation type (`0: STEP`, `1: LINEAR`, `2: CUBICSPLINE`). For `CUBICSPLINE`, writes `s0..s3` into `outCubicParams[0..3]` and returns `dt`.
 *
 * @param time -
 * [KO] 현재 애니메이션 시간 (초)
 * [EN] Current animation time in seconds
 * @param prevTime -
 * [KO] 이전 키프레임 시간 (초)
 * [EN] Previous keyframe time in seconds
 * @param nextTime -
 * [KO] 다음 키프레임 시간 (초)
 * [EN] Next keyframe time in seconds
 * @param interpolationType -
 * [KO] 보간 타입 코드 (`0: STEP`, `1: LINEAR`, `2: CUBICSPLINE`)
 * [EN] Interpolation type code (`0: STEP`, `1: LINEAR`, `2: CUBICSPLINE`)
 * @param outCubicParams -
 * [KO] `CUBICSPLINE` 기저 계수 `[s0, s1, s2, s3]`를 기록할 `Float32Array(4)` 버퍼
 * [EN] Reusable `Float32Array(4)` buffer receiving cubic Hermite coefficients `[s0, s1, s2, s3]`
 * @returns
 * [KO] 보간 값 (`CUBICSPLINE`은 `dt`, `STEP`은 `0`, `LINEAR`는 정규화 비율 `t`)
 * [EN] Interpolation value (`dt` for `CUBICSPLINE`, `0` for `STEP`, normalized `t` for `LINEAR`)
 * @category GLTF
 */
export const computeInterpolationParams = (
    time: number,
    prevTime: number,
    nextTime: number,
    interpolationType: number,
    outCubicParams: Float32Array
): number => {
    if (interpolationType === 2) {
        const timeDiff = nextTime - prevTime;
        const dt = timeDiff === timeDiff ? timeDiff : 0;
        const timeRatio = (time - prevTime) / dt;
        const p = timeRatio === timeRatio ? timeRatio : 0;
        const pp = p * p;
        const ppp = pp * p;
        const s2 = -2 * ppp + 3 * pp;
        const s3 = ppp - pp;
        outCubicParams[0] = 1 - s2;
        outCubicParams[1] = s3 - pp + p;
        outCubicParams[2] = s2;
        outCubicParams[3] = s3;
        return dt;
    }
    if (interpolationType === 0) {
        return 0;
    }
    const timeRatio = (time - prevTime) / (nextTime - prevTime);
    return timeRatio === timeRatio ? timeRatio : 0;
};

/**
 * [KO] 회전(Quaternion) 트랙의 키프레임을 샘플링하여 `outQuat[0..3]`에 기록합니다.
 * [EN] Samples a quaternion rotation track and writes `[x, y, z, w]` into `outQuat[0..3]`.
 *
 * @param track -
 * [KO] SLERP 구간 캐시를 보유한 대상 `AniTrack_GLTF` 인스턴스
 * [EN] Target `AniTrack_GLTF` instance holding the SLERP segment cache
 * @param dataList -
 * [KO] 애니메이션 회전 키프레임 `Float32Array`
 * [EN] Animation rotation keyframe `Float32Array`
 * @param prevTimeIdx -
 * [KO] 이전 키프레임 인덱스
 * [EN] Previous keyframe index
 * @param nextTimeIdx -
 * [KO] 다음 키프레임 인덱스
 * [EN] Next keyframe index
 * @param timeLength -
 * [KO] 전체 키프레임 개수
 * [EN] Total number of keyframes
 * @param isCubicSpline -
 * [KO] `CUBICSPLINE` 보간 여부
 * [EN] Whether interpolation is `CUBICSPLINE`
 * @param interpolationValue -
 * [KO] `computeInterpolationParams`가 반환한 보간 값
 * [EN] Interpolation value returned by `computeInterpolationParams`
 * @param cubicParams -
 * [KO] `CUBICSPLINE` 기저 계수 `[s0, s1, s2, s3]`
 * [EN] Cubic Hermite coefficients `[s0, s1, s2, s3]`
 * @param outQuat -
 * [KO] 결과 쿼터니언 `[x, y, z, w]`를 기록할 `Float32Array(4)` 버퍼
 * [EN] Reusable `Float32Array(4)` buffer receiving the sampled quaternion `[x, y, z, w]`
 * @category GLTF
 */
export const sampleQuatTrack = (
    track: AniTrack_GLTF,
    dataList: Float32Array,
    prevTimeIdx: number,
    nextTimeIdx: number,
    timeLength: number,
    isCubicSpline: boolean,
    interpolationValue: number,
    cubicParams: Float32Array,
    outQuat: Float32Array
): void => {
    if (prevTimeIdx === timeLength - 1) {
        const idx = prevTimeIdx << 2;
        outQuat[0] = dataList[idx];
        outQuat[1] = dataList[idx + 1];
        outQuat[2] = dataList[idx + 2];
        outQuat[3] = dataList[idx + 3];
        return;
    }

    if (isCubicSpline) {
        const prevIdx = prevTimeIdx * 12;
        const nextIdx = nextTimeIdx * 12;
        normalizeQuatInto(dataList[prevIdx + 4], dataList[prevIdx + 5], dataList[prevIdx + 6], dataList[prevIdx + 7], TEMP_CUBIC_QUATS, 0);
        normalizeQuatInto(dataList[prevIdx + 8], dataList[prevIdx + 9], dataList[prevIdx + 10], dataList[prevIdx + 11], TEMP_CUBIC_QUATS, 4);
        normalizeQuatInto(dataList[nextIdx], dataList[nextIdx + 1], dataList[nextIdx + 2], dataList[nextIdx + 3], TEMP_CUBIC_QUATS, 8);
        normalizeQuatInto(dataList[nextIdx + 4], dataList[nextIdx + 5], dataList[nextIdx + 6], dataList[nextIdx + 7], TEMP_CUBIC_QUATS, 12);

        const s0 = cubicParams[0];
        const s1Dt = cubicParams[1] * interpolationValue;
        const s2 = cubicParams[2];
        const s3Dt = cubicParams[3] * interpolationValue;

        outQuat[0] = s0 * TEMP_CUBIC_QUATS[0] + s1Dt * TEMP_CUBIC_QUATS[4] + s2 * TEMP_CUBIC_QUATS[12] + s3Dt * TEMP_CUBIC_QUATS[8];
        outQuat[1] = s0 * TEMP_CUBIC_QUATS[1] + s1Dt * TEMP_CUBIC_QUATS[5] + s2 * TEMP_CUBIC_QUATS[13] + s3Dt * TEMP_CUBIC_QUATS[9];
        outQuat[2] = s0 * TEMP_CUBIC_QUATS[2] + s1Dt * TEMP_CUBIC_QUATS[6] + s2 * TEMP_CUBIC_QUATS[14] + s3Dt * TEMP_CUBIC_QUATS[10];
        outQuat[3] = s0 * TEMP_CUBIC_QUATS[3] + s1Dt * TEMP_CUBIC_QUATS[7] + s2 * TEMP_CUBIC_QUATS[15] + s3Dt * TEMP_CUBIC_QUATS[11];
        return;
    }

    const prevIdx = prevTimeIdx << 2;
    const nextIdx = nextTimeIdx << 2;
    const numericCacheKey = (prevIdx << 16) | nextIdx;

    let cached = track.lastCachedItem;
    if (!cached || track.lastCachedKey !== numericCacheKey) {
        cached = track.cacheTable[numericCacheKey];
        if (!cached) {
            cached = new Float32Array(9);
            normalizeQuatInto(dataList[prevIdx], dataList[prevIdx + 1], dataList[prevIdx + 2], dataList[prevIdx + 3], cached, 1);
            normalizeQuatInto(dataList[nextIdx], dataList[nextIdx + 1], dataList[nextIdx + 2], dataList[nextIdx + 3], cached, 5);

            let cosom = cached[1] * cached[5] + cached[2] * cached[6] + cached[3] * cached[7] + cached[4] * cached[8];
            if (cosom < 0) {
                cosom = -cosom;
                cached[5] = -cached[5];
                cached[6] = -cached[6];
                cached[7] = -cached[7];
                cached[8] = -cached[8];
            }
            cached[0] = cosom;
            track.cacheTable[numericCacheKey] = cached;
        }
        track.lastCachedKey = numericCacheKey;
        track.lastCachedItem = cached;
    }

    const cosomVal = cached[0];
    let scale0: number;
    let scale1: number;
    if ((1 - cosomVal) > SLERP_EPSILON) {
        const omega = Math.acos(cosomVal);
        const sinom = Math.sin(omega);
        scale0 = Math.sin((1 - interpolationValue) * omega) / sinom;
        scale1 = Math.sin(interpolationValue * omega) / sinom;
    } else {
        scale0 = 1 - interpolationValue;
        scale1 = interpolationValue;
    }

    outQuat[0] = scale0 * cached[1] + scale1 * cached[5];
    outQuat[1] = scale0 * cached[2] + scale1 * cached[6];
    outQuat[2] = scale0 * cached[3] + scale1 * cached[7];
    outQuat[3] = scale0 * cached[4] + scale1 * cached[8];
};

/**
 * [KO] 이동/스케일(`Vec3`) 트랙의 키프레임을 샘플링하여 `outVec3[0..2]`에 기록합니다.
 * [EN] Samples a `Vec3` translation/scale track and writes `[x, y, z]` into `outVec3[0..2]`.
 *
 * @param dataList -
 * [KO] 애니메이션 Vec3 키프레임 `Float32Array`
 * [EN] Animation Vec3 keyframe `Float32Array`
 * @param prevTimeIdx -
 * [KO] 이전 키프레임 인덱스
 * [EN] Previous keyframe index
 * @param nextTimeIdx -
 * [KO] 다음 키프레임 인덱스
 * [EN] Next keyframe index
 * @param timeLength -
 * [KO] 전체 키프레임 개수
 * [EN] Total number of keyframes
 * @param isCubicSpline -
 * [KO] `CUBICSPLINE` 보간 여부
 * [EN] Whether interpolation is `CUBICSPLINE`
 * @param interpolationValue -
 * [KO] `computeInterpolationParams`가 반환한 보간 값
 * [EN] Interpolation value returned by `computeInterpolationParams`
 * @param cubicParams -
 * [KO] `CUBICSPLINE` 기저 계수 `[s0, s1, s2, s3]`
 * [EN] Cubic Hermite coefficients `[s0, s1, s2, s3]`
 * @param outVec3 -
 * [KO] 결과 벡터 `[x, y, z]`를 기록할 `Float32Array(3)` 이상 버퍼
 * [EN] Reusable `Float32Array` (length >= 3) receiving the sampled vector `[x, y, z]`
 * @category GLTF
 */
export const sampleVec3Track = (
    dataList: Float32Array,
    prevTimeIdx: number,
    nextTimeIdx: number,
    timeLength: number,
    isCubicSpline: boolean,
    interpolationValue: number,
    cubicParams: Float32Array,
    outVec3: Float32Array
): void => {
    if (prevTimeIdx === timeLength - 1) {
        const idx = prevTimeIdx * 3;
        outVec3[0] = dataList[idx];
        outVec3[1] = dataList[idx + 1];
        outVec3[2] = dataList[idx + 2];
        return;
    }

    if (isCubicSpline) {
        const prevIdx = prevTimeIdx * 9;
        const nX = dataList[prevIdx + 3];
        const nY = dataList[prevIdx + 4];
        const nZ = dataList[prevIdx + 5];
        const pXOut = dataList[prevIdx + 6];
        const pYOut = dataList[prevIdx + 7];
        const pZOut = dataList[prevIdx + 8];

        const nextIdx = nextTimeIdx * 9;
        const nXOut = dataList[nextIdx];
        const nYOut = dataList[nextIdx + 1];
        const nZOut = dataList[nextIdx + 2];
        const pX = dataList[nextIdx + 3];
        const pY = dataList[nextIdx + 4];
        const pZ = dataList[nextIdx + 5];

        const s0 = cubicParams[0];
        const s1Dt = cubicParams[1] * interpolationValue;
        const s2 = cubicParams[2];
        const s3Dt = cubicParams[3] * interpolationValue;

        outVec3[0] = s0 * pX + s1Dt * pXOut + s2 * nX + s3Dt * nXOut;
        outVec3[1] = s0 * pY + s1Dt * pYOut + s2 * nY + s3Dt * nYOut;
        outVec3[2] = s0 * pZ + s1Dt * pZOut + s2 * nZ + s3Dt * nZOut;
        return;
    }

    const prevIdx = prevTimeIdx * 3;
    const nextIdx = nextTimeIdx * 3;
    const pX = dataList[prevIdx];
    const pY = dataList[prevIdx + 1];
    const pZ = dataList[prevIdx + 2];

    outVec3[0] = pX + interpolationValue * (dataList[nextIdx] - pX);
    outVec3[1] = pY + interpolationValue * (dataList[nextIdx + 1] - pY);
    outVec3[2] = pZ + interpolationValue * (dataList[nextIdx + 2] - pZ);
};

/**
 * [KO] 두 쿼터니언을 최단 호(Shortest Arc) SLERP로 보간하여 `outQuat[0..3]`에 기록합니다.
 * [EN] Performs shortest-arc SLERP between two quaternions and writes `[x, y, z, w]` into `outQuat[0..3]`.
 *
 * @param q1x - [KO] 시작 쿼터니언 X [EN] Source quaternion X
 * @param q1y - [KO] 시작 쿼터니언 Y [EN] Source quaternion Y
 * @param q1z - [KO] 시작 쿼터니언 Z [EN] Source quaternion Z
 * @param q1w - [KO] 시작 쿼터니언 W [EN] Source quaternion W
 * @param q2x - [KO] 목표 쿼터니언 X [EN] Target quaternion X
 * @param q2y - [KO] 목표 쿼터니언 Y [EN] Target quaternion Y
 * @param q2z - [KO] 목표 쿼터니언 Z [EN] Target quaternion Z
 * @param q2w - [KO] 목표 쿼터니언 W [EN] Target quaternion W
 * @param weight - [KO] 블렌딩 가중치 (`0.0 ~ 1.0`) [EN] Blend weight (`0.0` to `1.0`)
 * @param outQuat - [KO] 결과를 기록할 `Float32Array(4)` 버퍼 [EN] Reusable `Float32Array(4)` buffer
 * @category GLTF
 */
export const slerpQuat = (
    q1x: number,
    q1y: number,
    q1z: number,
    q1w: number,
    q2x: number,
    q2y: number,
    q2z: number,
    q2w: number,
    weight: number,
    outQuat: Float32Array
): void => {
    let cosHalftheta = q1x * q2x + q1y * q2y + q1z * q2z + q1w * q2w;
    if (cosHalftheta < 0) {
        cosHalftheta = -cosHalftheta;
        q2x = -q2x;
        q2y = -q2y;
        q2z = -q2z;
        q2w = -q2w;
    }

    let scale0: number;
    let scale1: number;
    if ((1 - cosHalftheta) > SLERP_EPSILON) {
        const halfTheta = Math.acos(cosHalftheta);
        const sinHalftheta = Math.sin(halfTheta);
        scale0 = Math.sin((1 - weight) * halfTheta) / sinHalftheta;
        scale1 = Math.sin(weight * halfTheta) / sinHalftheta;
    } else {
        scale0 = 1 - weight;
        scale1 = weight;
    }

    outQuat[0] = scale0 * q1x + scale1 * q2x;
    outQuat[1] = scale0 * q1y + scale1 * q2y;
    outQuat[2] = scale0 * q1z + scale1 * q2z;
    outQuat[3] = scale0 * q1w + scale1 * q2w;
};

/**
 * [KO] 쿼터니언을 오일러 각도(Degree)로 변환하여 `outEuler[0..2]`(`[rotX, rotY, rotZ]`)에 기록합니다.
 * [EN] Converts a quaternion to Euler angles in degrees and writes `[rotX, rotY, rotZ]` into `outEuler[0..2]`.
 *
 * @param rX - [KO] 쿼터니언 X [EN] Quaternion X
 * @param rY - [KO] 쿼터니언 Y [EN] Quaternion Y
 * @param rZ - [KO] 쿼터니언 Z [EN] Quaternion Z
 * @param rW - [KO] 쿼터니언 W [EN] Quaternion W
 * @param outEuler - [KO] 오일러 각도(Degree)를 기록할 `Float32Array(3)` 버퍼 [EN] Reusable `Float32Array(3)` buffer
 * @category GLTF
 */
export const quatToEulerDeg = (
    rX: number,
    rY: number,
    rZ: number,
    rW: number,
    outEuler: Float32Array
): void => {
    const x2 = rX + rX;
    const y2 = rY + rY;
    const z2 = rZ + rZ;
    const xx = rX * x2;
    const xy = rX * y2;
    const xz = rX * z2;
    const yy = rY * y2;
    const yz = rY * z2;
    const zz = rZ * z2;
    const wx = rW * x2;
    const wy = rW * y2;
    const wz = rW * z2;
    const m13 = xz + wy;
    const m11 = 1 - (yy + zz);
    const m12 = xy - wz;
    const m23 = yz - wx;
    const m33 = 1 - (xx + yy);
    const m32 = yz + wx;
    const m22 = 1 - (xx + zz);
    const rotY = Math.asin(Math.max(-1, Math.min(1, m13)));
    let rotX: number;
    let rotZ: number;
    if (Math.abs(m13) < 0.99999) {
        rotX = Math.atan2(-m23, m33);
        rotZ = Math.atan2(-m12, m11);
    } else {
        rotX = Math.atan2(m32, m22);
        rotZ = 0;
    }
    outEuler[0] = rotX * PI_180;
    outEuler[1] = rotY * PI_180;
    outEuler[2] = rotZ * PI_180;
};

/**
 * [KO] 쿼터니언을 오일러 각도(Degree)로 변환하여 대상 메쉬의 `rotationX/Y/Z`에 직접 적용합니다.
 * [EN] Converts a quaternion to Euler angles in degrees and assigns them directly to `mesh.rotationX/Y/Z`.
 *
 * @param mesh - [KO] 회전을 적용할 대상 메쉬 [EN] Target mesh to apply rotation to
 * @param rX - [KO] 쿼터니언 X [EN] Quaternion X
 * @param rY - [KO] 쿼터니언 Y [EN] Quaternion Y
 * @param rZ - [KO] 쿼터니언 Z [EN] Quaternion Z
 * @param rW - [KO] 쿼터니언 W [EN] Quaternion W
 * @category GLTF
 */
export const applyQuatToMeshRotation = (
    mesh: any,
    rX: number,
    rY: number,
    rZ: number,
    rW: number
): void => {
    const x2 = rX + rX;
    const y2 = rY + rY;
    const z2 = rZ + rZ;
    const xx = rX * x2;
    const xy = rX * y2;
    const xz = rX * z2;
    const yy = rY * y2;
    const yz = rY * z2;
    const zz = rZ * z2;
    const wx = rW * x2;
    const wy = rW * y2;
    const wz = rW * z2;
    const m13 = xz + wy;
    const m11 = 1 - (yy + zz);
    const m12 = xy - wz;
    const m23 = yz - wx;
    const m33 = 1 - (xx + yy);
    const m32 = yz + wx;
    const m22 = 1 - (xx + zz);
    const rotY = Math.asin(Math.max(-1, Math.min(1, m13)));
    let rotX: number;
    let rotZ: number;
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
};
