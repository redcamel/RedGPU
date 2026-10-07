import { mat4 } from "gl-matrix";
/**
 * [KO] 프로젝션 및 카메라 행렬로부터 6개의 뷰 프러스텀 평면을 계산합니다.
 * [EN] Computes 6 view frustum planes from projection and camera matrices.
 *
 * [KO] 각 평면의 방정식을 [A, B, C, D] 형태로 정규화하여 반환합니다. out 버퍼가 주어지면 해당 버퍼에 인플레이스로 기록(Zero-GC)합니다.
 * [EN] Returns equations of each plane normalized in [A, B, C, D] format. Records in-place if out buffer is provided (Zero-GC).
 *
 * ### Example
 * ```typescript
 * const planes = RedGPU.math.computeFrustumPlanes(projectionMatrix, cameraMTX);
 * ```
 *
 * @param projectionMatrix -
 * [KO] 프로젝션 행렬
 * [EN] Projection matrix
 * @param viewMatrix -
 * [KO] 카메라 행렬
 * [EN] Camera matrix
 * @param out -
 * [KO] 재사용할 프러스텀 평면 버퍼 (선택 사항, 미제공 시 독립된 새 배열 생성)
 * [EN] Reusable frustum planes buffer (optional, creates fresh array if omitted)
 * @returns
 * [KO] 6개 평면의 [A, B, C, D] 배열
 * [EN] Array of [A, B, C, D] for 6 planes
 * @category Math
 */
declare const computeFrustumPlanes: (projectionMatrix: mat4, viewMatrix: mat4, out?: number[][]) => number[][];
/**
 * [KO] 프로젝션 및 카메라 행렬로부터 6개의 뷰 프러스텀 평면을 계산하여 1차원 Float32Array(24)로 반환합니다.
 * [EN] Computes 6 view frustum planes from projection and camera matrices and returns them as a 1D Float32Array(24).
 *
 * [KO] GPU Uniform/Storage 버퍼 전송에 최적화된 평탄화(Flat) 형태([A0,B0,C0,D0, A1,B1,C1,D1, ...])입니다. out 버퍼가 주어지면 해당 버퍼에 인플레이스로 기록(Zero-GC)합니다.
 * [EN] Flattened format ([A0,B0,C0,D0, A1,B1,C1,D1, ...]) optimized for GPU Uniform/Storage buffer uploads. Records in-place if out buffer is provided (Zero-GC).
 *
 * ### Example
 * ```typescript
 * const planesFlat = RedGPU.math.computeFrustumPlanesFlat(projectionMatrix, cameraMTX);
 * ```
 *
 * @param projectionMatrix -
 * [KO] 프로젝션 행렬
 * [EN] Projection matrix
 * @param viewMatrix -
 * [KO] 카메라 행렬
 * [EN] Camera matrix
 * @param out -
 * [KO] 재사용할 프러스텀 평면 버퍼 (선택 사항, 미제공 시 독립된 새 Float32Array(24) 생성)
 * [EN] Reusable frustum planes buffer (optional, creates fresh Float32Array(24) if omitted)
 * @returns
 * [KO] 24개 float으로 구성된 1차원 평탄 버퍼
 * [EN] 1D flattened buffer of 24 floats
 * @category Math
 */
declare const computeFrustumPlanesFlat: (projectionMatrix: mat4, viewMatrix: mat4, out?: Float32Array) => Float32Array;
/**
 * [KO] 4x4 행렬(WebGPU [0, 1] depth 규격)로부터 6개 프러스텀 평면(Left, Right, Bottom, Top, Near, Far)을 정규화하여 out 배열에 인플레이스 기입합니다.
 * [EN] Extracts and normalizes 6 frustum planes (Left, Right, Bottom, Top, Near, Far) from 4x4 matrix (WebGPU [0, 1] depth standard) in-place.
 *
 * @param m -
 * [KO] 투영-뷰 결합 4x4 행렬
 * [EN] Projection-view combined 4x4 matrix
 * @param out -
 * [KO] 재사용할 프러스텀 평면 버퍼 (선택 사항, 미제공 시 독립된 새 배열 생성)
 * [EN] Reusable frustum planes buffer (optional, creates fresh array if omitted)
 * @returns
 * [KO] 6개 평면의 [A, B, C, D] 배열
 * [EN] Array of [A, B, C, D] for 6 planes
 * @category Math
 */
declare const computeFrustumPlanesFromPVMatrix: (m: mat4, out?: number[][]) => number[][];
/**
 * [KO] 4x4 결합 행렬(WebGPU [0, 1] depth 규격)로부터 6개 프러스텀 평면을 계산하여 1차원 Float32Array(24)로 반환합니다.
 * [EN] Computes 6 frustum planes from a 4x4 combined matrix (WebGPU [0, 1] depth standard) and returns them as a 1D Float32Array(24).
 *
 * @param m -
 * [KO] 투영-뷰 결합 4x4 행렬
 * [EN] Projection-view combined 4x4 matrix
 * @param out -
 * [KO] 재사용할 프러스텀 평면 버퍼 (선택 사항, 미제공 시 독립된 새 Float32Array(24) 생성)
 * [EN] Reusable frustum planes buffer (optional, creates fresh Float32Array(24) if omitted)
 * @returns
 * [KO] 24개 float으로 구성된 1차원 평탄 버퍼
 * [EN] 1D flattened buffer of 24 floats
 * @category Math
 */
declare const computeFrustumPlanesFromPVMatrixFlat: (m: mat4, out?: Float32Array) => Float32Array;
export { computeFrustumPlanes, computeFrustumPlanesFlat, computeFrustumPlanesFromPVMatrix, computeFrustumPlanesFromPVMatrixFlat };
export default computeFrustumPlanes;
