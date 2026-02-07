import {mat4} from "gl-matrix";

const tempMTX = mat4.create();
/**
 * [KO] 프로젝션 및 카메라 행렬로부터 6개의 뷰 프러스텀 평면을 계산합니다.
 * [EN] Computes 6 view frustum planes from projection and camera matrices.
 *
 * [KO] 각 평면의 방정식을 [A, B, C, D] 형태로 정규화하여 반환합니다.
 * [EN] Returns equations of each plane normalized in [A, B, C, D] format.
 *
 * ### Example
 * ```typescript
 * const planes = RedGPU.math.computeViewFrustumPlanes(projectionMTX, cameraMTX);
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
const computeViewFrustumPlanes = (projectionMatrix: mat4, cameraMatrix: mat4): number[][] => {
    mat4.multiply(tempMTX, projectionMatrix, cameraMatrix);
    const planes = [
        [tempMTX[3] - tempMTX[0], tempMTX[7] - tempMTX[4], tempMTX[11] - tempMTX[8], tempMTX[15] - tempMTX[12]],
        [tempMTX[3] + tempMTX[0], tempMTX[7] + tempMTX[4], tempMTX[11] + tempMTX[8], tempMTX[15] + tempMTX[12]],
        [tempMTX[3] + tempMTX[1], tempMTX[7] + tempMTX[5], tempMTX[11] + tempMTX[9], tempMTX[15] + tempMTX[13]],
        [tempMTX[3] - tempMTX[1], tempMTX[7] - tempMTX[5], tempMTX[11] - tempMTX[9], tempMTX[15] - tempMTX[13]],
        [tempMTX[3] - tempMTX[2], tempMTX[7] - tempMTX[6], tempMTX[11] - tempMTX[10], tempMTX[15] - tempMTX[14]],
        [tempMTX[3] + tempMTX[2], tempMTX[7] + tempMTX[6], tempMTX[11] + tempMTX[10], tempMTX[15] + tempMTX[14]]
    ];
    for (let i = 0; i < 6; i++) {
        const plane = planes[i];
        const norm = Math.sqrt(plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2]);
        plane[0] /= norm;
        plane[1] /= norm;
        plane[2] /= norm;
        plane[3] /= norm;
    }
    return planes;
}
export default computeViewFrustumPlanes