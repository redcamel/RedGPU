import { mat4 } from "gl-matrix";
/**
 * [KO] 프로젝션 및 카메라 행렬로부터 6개의 뷰 프러스텀 평면을 계산합니다.
 * [EN] Computes 6 view frustum planes from projection and camera matrices.
 *
 * [KO] 각 평면의 방정식을 [A, B, C, D] 형태로 정규화하여 반환합니다.
 * [EN] Returns equations of each plane normalized in [A, B, C, D] format.
 *
 * * ### Example
 * ```typescript
 * const planes = RedGPU.Util.computeViewFrustumPlanes(projectionMTX, cameraMTX);
 * ```
 *
 * @param projectionMatrix -
 * [KO] 프로젝션 행렬
 * [EN] Projection matrix
 * @param cameraMatrix -
 * [KO] 카메라 행렬
 * [EN] Camera matrix
 * @returns
 * [KO] 6개 평면의 [A, B, C, D] 배열
 * [EN] Array of [A, B, C, D] for 6 planes
 * @category Math
 */
declare const computeViewFrustumPlanes: (projectionMatrix: mat4, cameraMatrix: mat4) => number[][];
export default computeViewFrustumPlanes;
