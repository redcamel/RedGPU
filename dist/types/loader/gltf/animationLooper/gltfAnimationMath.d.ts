import AniTrack_GLTF from "../cls/anitrack/AniTrack_GLTF";
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
export declare const findKeyframeSegment: (timeList: Float32Array, time: number, lastHint: number, outIndices: Int32Array) => void;
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
export declare const computeInterpolationParams: (time: number, prevTime: number, nextTime: number, interpolationType: number, outCubicParams: Float32Array) => number;
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
export declare const sampleQuatTrack: (track: AniTrack_GLTF, dataList: Float32Array, prevTimeIdx: number, nextTimeIdx: number, timeLength: number, isCubicSpline: boolean, interpolationValue: number, cubicParams: Float32Array, outQuat: Float32Array) => void;
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
export declare const sampleVec3Track: (dataList: Float32Array, prevTimeIdx: number, nextTimeIdx: number, timeLength: number, isCubicSpline: boolean, interpolationValue: number, cubicParams: Float32Array, outVec3: Float32Array) => void;
/**
 * [KO] 두 쿼터니언을 최단 호(Shortest Arc) SLERP로 보간하여 `outQuat[0..3]`에 기록합니다.
 * [EN] Performs shortest-arc SLERP between two quaternions and writes `[x, y, z, w]` into `outQuat[0..3]`.
 *
 * @param q1x -
 * [KO] 시작 쿼터니언 X
 * [EN] Source quaternion X
 * @param q1y -
 * [KO] 시작 쿼터니언 Y
 * [EN] Source quaternion Y
 * @param q1z -
 * [KO] 시작 쿼터니언 Z
 * [EN] Source quaternion Z
 * @param q1w -
 * [KO] 시작 쿼터니언 W
 * [EN] Source quaternion W
 * @param q2x -
 * [KO] 목표 쿼터니언 X
 * [EN] Target quaternion X
 * @param q2y -
 * [KO] 목표 쿼터니언 Y
 * [EN] Target quaternion Y
 * @param q2z -
 * [KO] 목표 쿼터니언 Z
 * [EN] Target quaternion Z
 * @param q2w -
 * [KO] 목표 쿼터니언 W
 * [EN] Target quaternion W
 * @param weight -
 * [KO] 블렌딩 가중치 (`0.0 ~ 1.0`)
 * [EN] Blend weight (`0.0` to `1.0`)
 * @param outQuat -
 * [KO] 결과를 기록할 `Float32Array(4)` 버퍼
 * [EN] Reusable `Float32Array(4)` buffer
 * @category GLTF
 */
export declare const slerpQuat: (q1x: number, q1y: number, q1z: number, q1w: number, q2x: number, q2y: number, q2z: number, q2w: number, weight: number, outQuat: Float32Array) => void;
/**
 * [KO] 쿼터니언을 오일러 각도(Degree)로 변환하여 `outEuler[0..2]`(`[rotX, rotY, rotZ]`)에 기록합니다.
 * [EN] Converts a quaternion to Euler angles in degrees and writes `[rotX, rotY, rotZ]` into `outEuler[0..2]`.
 *
 * @param rX -
 * [KO] 쿼터니언 X
 * [EN] Quaternion X
 * @param rY -
 * [KO] 쿼터니언 Y
 * [EN] Quaternion Y
 * @param rZ -
 * [KO] 쿼터니언 Z
 * [EN] Quaternion Z
 * @param rW -
 * [KO] 쿼터니언 W
 * [EN] Quaternion W
 * @param outEuler -
 * [KO] 오일러 각도(Degree)를 기록할 `Float32Array(3)` 버퍼
 * [EN] Reusable `Float32Array(3)` buffer
 * @category GLTF
 */
export declare const quatToEulerDeg: (rX: number, rY: number, rZ: number, rW: number, outEuler: Float32Array) => void;
/**
 * [KO] 쿼터니언을 오일러 각도(Degree)로 변환하여 대상 메쉬의 `rotationX/Y/Z`에 직접 적용합니다.
 * [EN] Converts a quaternion to Euler angles in degrees and assigns them directly to `mesh.rotationX/Y/Z`.
 *
 * @param mesh -
 * [KO] 회전을 적용할 대상 메쉬
 * [EN] Target mesh to apply rotation to
 * @param rX -
 * [KO] 쿼터니언 X
 * [EN] Quaternion X
 * @param rY -
 * [KO] 쿼터니언 Y
 * [EN] Quaternion Y
 * @param rZ -
 * [KO] 쿼터니언 Z
 * [EN] Quaternion Z
 * @param rW -
 * [KO] 쿼터니언 W
 * [EN] Quaternion W
 * @category GLTF
 */
export declare const applyQuatToMeshRotation: (mesh: {
    rotationX: number;
    rotationY: number;
    rotationZ: number;
}, rX: number, rY: number, rZ: number, rW: number) => void;
