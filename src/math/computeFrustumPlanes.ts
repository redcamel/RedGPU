import {mat4} from "gl-matrix";

const tempMTX = mat4.create();
const tempPlanes2D: number[][] = [
    new Array(4), new Array(4), new Array(4),
    new Array(4), new Array(4), new Array(4)
];

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
const computeFrustumPlanes = (
    projectionMatrix: mat4,
    viewMatrix: mat4,
    out?: number[][]
): number[][] => {
    if (!out) {
        out = [
            new Array(4), new Array(4), new Array(4),
            new Array(4), new Array(4), new Array(4)
        ];
    }
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
const computeFrustumPlanesFlat = (
    projectionMatrix: mat4,
    viewMatrix: mat4,
    out?: Float32Array
): Float32Array => {
    if (!out) {
        out = new Float32Array(24);
    }
    computeFrustumPlanes(projectionMatrix, viewMatrix, tempPlanes2D);
    const p0 = tempPlanes2D[0], p1 = tempPlanes2D[1], p2 = tempPlanes2D[2],
        p3 = tempPlanes2D[3], p4 = tempPlanes2D[4], p5 = tempPlanes2D[5];

    out[0] = p0[0];
    out[1] = p0[1];
    out[2] = p0[2];
    out[3] = p0[3];
    out[4] = p1[0];
    out[5] = p1[1];
    out[6] = p1[2];
    out[7] = p1[3];
    out[8] = p2[0];
    out[9] = p2[1];
    out[10] = p2[2];
    out[11] = p2[3];
    out[12] = p3[0];
    out[13] = p3[1];
    out[14] = p3[2];
    out[15] = p3[3];
    out[16] = p4[0];
    out[17] = p4[1];
    out[18] = p4[2];
    out[19] = p4[3];
    out[20] = p5[0];
    out[21] = p5[1];
    out[22] = p5[2];
    out[23] = p5[3];

    return out;
};

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
const computeFrustumPlanesFromPVMatrix = (m: mat4, out?: number[][]): number[][] => {
    if (!out) {
        out = [
            new Array(4), new Array(4), new Array(4),
            new Array(4), new Array(4), new Array(4)
        ];
    }
    const p0 = out[0], p1 = out[1], p2 = out[2], p3 = out[3], p4 = out[4], p5 = out[5];

    // Left plane (m3 + m0)
    p0[0] = m[3] + m[0];
    p0[1] = m[7] + m[4];
    p0[2] = m[11] + m[8];
    p0[3] = m[15] + m[12];

    // Right plane (m3 - m0)
    p1[0] = m[3] - m[0];
    p1[1] = m[7] - m[4];
    p1[2] = m[11] - m[8];
    p1[3] = m[15] - m[12];

    // Bottom plane (m3 + m1)
    p2[0] = m[3] + m[1];
    p2[1] = m[7] + m[5];
    p2[2] = m[11] + m[9];
    p2[3] = m[15] + m[13];

    // Top plane (m3 - m1)
    p3[0] = m[3] - m[1];
    p3[1] = m[7] - m[5];
    p3[2] = m[11] - m[9];
    p3[3] = m[15] - m[13];

    // Near plane (m2) - WebGPU [0, 1] depth
    p4[0] = m[2];
    p4[1] = m[6];
    p4[2] = m[10];
    p4[3] = m[14];

    // Far plane (m3 - m2) - WebGPU [0, 1] depth
    p5[0] = m[3] - m[2];
    p5[1] = m[7] - m[6];
    p5[2] = m[11] - m[10];
    p5[3] = m[15] - m[14];

    for (let i = 0; i < 6; i++) {
        const plane = out[i];
        const norm = Math.sqrt(plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2]);
        if (norm > 0.000001) {
            const invNorm = 1.0 / norm;
            plane[0] *= invNorm;
            plane[1] *= invNorm;
            plane[2] *= invNorm;
            plane[3] *= invNorm;
        }
    }
    return out;
};

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
const computeFrustumPlanesFromPVMatrixFlat = (
    m: mat4,
    out?: Float32Array
): Float32Array => {
    if (!out) {
        out = new Float32Array(24);
    }
    computeFrustumPlanesFromPVMatrix(m, tempPlanes2D);
    const p0 = tempPlanes2D[0], p1 = tempPlanes2D[1], p2 = tempPlanes2D[2],
        p3 = tempPlanes2D[3], p4 = tempPlanes2D[4], p5 = tempPlanes2D[5];

    out[0] = p0[0];
    out[1] = p0[1];
    out[2] = p0[2];
    out[3] = p0[3];
    out[4] = p1[0];
    out[5] = p1[1];
    out[6] = p1[2];
    out[7] = p1[3];
    out[8] = p2[0];
    out[9] = p2[1];
    out[10] = p2[2];
    out[11] = p2[3];
    out[12] = p3[0];
    out[13] = p3[1];
    out[14] = p3[2];
    out[15] = p3[3];
    out[16] = p4[0];
    out[17] = p4[1];
    out[18] = p4[2];
    out[19] = p4[3];
    out[20] = p5[0];
    out[21] = p5[1];
    out[22] = p5[2];
    out[23] = p5[3];

    return out;
};

export {
    computeFrustumPlanes,
    computeFrustumPlanesFlat,
    computeFrustumPlanesFromPVMatrix,
    computeFrustumPlanesFromPVMatrixFlat
};
export default computeFrustumPlanes;