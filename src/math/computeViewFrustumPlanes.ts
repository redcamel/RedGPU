import {mat4} from "gl-matrix";

const tempMTX = mat4.create();
const defaultPlanes: number[][] = [
    new Array(4), new Array(4), new Array(4),
    new Array(4), new Array(4), new Array(4)
];

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
 * @param viewMatrix -
 * [KO] 카메라 행렬
 * [EN] Camera matrix
 * @param out -
 * [KO] 재사용할 프러스텀 평면 버퍼 (Zero-GC)
 * [EN] Reusable frustum planes buffer (Zero-GC)
 * @returns
 * [KO] 6개 평면의 [A, B, C, D] 배열
 * [EN] Array of [A, B, C, D] for 6 planes
 * @category Math
 */
const computeViewFrustumPlanes = (
    projectionMatrix: mat4,
    viewMatrix: mat4,
    out: number[][] = defaultPlanes
): number[][] => {
    mat4.multiply(tempMTX, projectionMatrix, viewMatrix);
    const m = tempMTX;

    const p0 = out[0], p1 = out[1], p2 = out[2], p3 = out[3], p4 = out[4], p5 = out[5];

    p0[0] = m[3] - m[0];
    p0[1] = m[7] - m[4];
    p0[2] = m[11] - m[8];
    p0[3] = m[15] - m[12];
    p1[0] = m[3] + m[0];
    p1[1] = m[7] + m[4];
    p1[2] = m[11] + m[8];
    p1[3] = m[15] + m[12];
    p2[0] = m[3] + m[1];
    p2[1] = m[7] + m[5];
    p2[2] = m[11] + m[9];
    p2[3] = m[15] + m[13];
    p3[0] = m[3] - m[1];
    p3[1] = m[7] - m[5];
    p3[2] = m[11] - m[9];
    p3[3] = m[15] - m[13];
    p4[0] = m[3] - m[2];
    p4[1] = m[7] - m[6];
    p4[2] = m[11] - m[10];
    p4[3] = m[15] - m[14];
    p5[0] = m[3] + m[2];
    p5[1] = m[7] + m[6];
    p5[2] = m[11] + m[10];
    p5[3] = m[15] + m[14];

    for (let i = 0; i < 6; i++) {
        const plane = out[i];
        const lenSq = plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2];
        const norm = lenSq > 0 ? 1.0 / Math.sqrt(lenSq) : 1.0;
        plane[0] *= norm;
        plane[1] *= norm;
        plane[2] *= norm;
        plane[3] *= norm;
    }
    return out;
};
export default computeViewFrustumPlanes;