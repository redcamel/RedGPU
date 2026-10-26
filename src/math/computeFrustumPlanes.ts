import {mat4} from "gl-matrix";

const tempMTX = mat4.create();

/**
 * [KO] 투영 행렬과 뷰 행렬을 곱하여 정규화된 6개의 뷰 프러스텀 평면 방정식(`[A, B, C, D]`) 배열을 계산합니다.
 * [EN] Multiplies the projection and view matrices to compute an array of 6 normalized view frustum plane equations (`[A, B, C, D]`).
 *
 * ### Example
 * ```typescript
 * const planes = RedGPU.Math.computeFrustumPlanes(projectionMatrix, viewMatrix);
 * ```
 *
 * @param projectionMatrix -
 * [KO] 4x4 투영 행렬 (`mat4`, 열 우선)
 * [EN] 4x4 projection matrix (`mat4`, column-major)
 * @param viewMatrix -
 * [KO] 4x4 뷰 행렬 (`mat4`, 열 우선)
 * [EN] 4x4 view matrix (`mat4`, column-major)
 * @param out -
 * [KO] 결과를 기록할 재사용 2차원 배열 버퍼 (선택 사항, 미지정 시 새 배열 할당)
 * [EN] Reusable 2D array buffer to write the result (optional, allocates a new array if omitted)
 * @returns
 * [KO] 6개 평면의 정규화된 계수 배열 (`Array<Array<number>>`, 각 요소는 `[A, B, C, D]`)
 * [EN] Array of normalized coefficients for 6 planes (`Array<Array<number>>`, each element is `[A, B, C, D]`)
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
 * [KO] 투영 행렬과 뷰 행렬로부터 정규화된 6개의 뷰 프러스텀 평면을 1차원 `Float32Array`(길이 24)로 계산합니다.
 * [EN] Computes 6 normalized view frustum planes as a 1D `Float32Array` (length 24) from projection and view matrices.
 *
 * ### Example
 * ```typescript
 * const planesFlat = RedGPU.Math.computeFrustumPlanesFlat(projectionMatrix, viewMatrix);
 * ```
 *
 * @param projectionMatrix -
 * [KO] 4x4 투영 행렬 (`mat4`, 열 우선)
 * [EN] 4x4 projection matrix (`mat4`, column-major)
 * @param viewMatrix -
 * [KO] 4x4 뷰 행렬 (`mat4`, 열 우선)
 * [EN] 4x4 view matrix (`mat4`, column-major)
 * @param out -
 * [KO] 결과를 기록할 재사용 `Float32Array(24)` 버퍼 (선택 사항, 미지정 시 새 버퍼 할당)
 * [EN] Reusable `Float32Array(24)` buffer to write the result (optional, allocates a new buffer if omitted)
 * @returns
 * [KO] 평탄화된 6개 평면 계수 버퍼 (`Float32Array`, `[A0, B0, C0, D0, ..., A5, B5, C5, D5]`)
 * [EN] Flattened 6-plane coefficient buffer (`Float32Array`, `[A0, B0, C0, D0, ..., A5, B5, C5, D5]`)
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
    mat4.multiply(tempMTX, projectionMatrix, viewMatrix);
    const m = tempMTX;

    out[0] = m[3] - m[0];
    out[1] = m[7] - m[4];
    out[2] = m[11] - m[8];
    out[3] = m[15] - m[12];

    out[4] = m[3] + m[0];
    out[5] = m[7] + m[4];
    out[6] = m[11] + m[8];
    out[7] = m[15] + m[12];

    out[8] = m[3] + m[1];
    out[9] = m[7] + m[5];
    out[10] = m[11] + m[9];
    out[11] = m[15] + m[13];

    out[12] = m[3] - m[1];
    out[13] = m[7] - m[5];
    out[14] = m[11] - m[9];
    out[15] = m[15] - m[13];

    out[16] = m[3] - m[2];
    out[17] = m[7] - m[6];
    out[18] = m[11] - m[10];
    out[19] = m[15] - m[14];

    out[20] = m[3] + m[2];
    out[21] = m[7] + m[6];
    out[22] = m[11] + m[10];
    out[23] = m[15] + m[14];

    for (let i = 0; i < 6; i++) {
        const offset = i * 4;
        const x = out[offset], y = out[offset + 1], z = out[offset + 2];
        const lenSq = x * x + y * y + z * z;
        const norm = lenSq > 0 ? 1.0 / Math.sqrt(lenSq) : 1.0;
        out[offset] *= norm;
        out[offset + 1] *= norm;
        out[offset + 2] *= norm;
        out[offset + 3] *= norm;
    }
    return out;
};

/**
 * [KO] 투영-뷰 결합 행렬(WebGPU `[0, 1]` 깊이 규격)로부터 6개 프러스텀 평면(Left, Right, Bottom, Top, Near, Far)을 추출 및 정규화합니다.
 * [EN] Extracts and normalizes 6 frustum planes (Left, Right, Bottom, Top, Near, Far) from a combined projection-view matrix (WebGPU `[0, 1]` depth standard).
 *
 * ### Example
 * ```typescript
 * const planes = RedGPU.Math.computeFrustumPlanesFromPVMatrix(pvMatrix);
 * ```
 *
 * @param m -
 * [KO] 투영-뷰 결합 4x4 행렬 (`mat4`, 열 우선)
 * [EN] Combined projection-view 4x4 matrix (`mat4`, column-major)
 * @param out -
 * [KO] 결과를 기록할 재사용 2차원 배열 버퍼 (선택 사항, 미지정 시 새 배열 할당)
 * [EN] Reusable 2D array buffer to write the result (optional, allocates a new array if omitted)
 * @returns
 * [KO] 6개 평면의 정규화된 계수 배열 (`Array<Array<number>>`, 각 요소는 `[A, B, C, D]`)
 * [EN] Array of normalized coefficients for 6 planes (`Array<Array<number>>`, each element is `[A, B, C, D]`)
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

    p0[0] = m[3] + m[0];
    p0[1] = m[7] + m[4];
    p0[2] = m[11] + m[8];
    p0[3] = m[15] + m[12];

    p1[0] = m[3] - m[0];
    p1[1] = m[7] - m[4];
    p1[2] = m[11] - m[8];
    p1[3] = m[15] - m[12];

    p2[0] = m[3] + m[1];
    p2[1] = m[7] + m[5];
    p2[2] = m[11] + m[9];
    p2[3] = m[15] + m[13];

    p3[0] = m[3] - m[1];
    p3[1] = m[7] - m[5];
    p3[2] = m[11] - m[9];
    p3[3] = m[15] - m[13];

    p4[0] = m[2];
    p4[1] = m[6];
    p4[2] = m[10];
    p4[3] = m[14];

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
 * [KO] 투영-뷰 결합 행렬(WebGPU `[0, 1]` 깊이 규격)로부터 6개 프러스텀 평면(Left, Right, Bottom, Top, Near, Far)을 1차원 `Float32Array`(길이 24)로 계산합니다.
 * [EN] Computes 6 frustum planes (Left, Right, Bottom, Top, Near, Far) as a 1D `Float32Array` (length 24) from a combined projection-view matrix (WebGPU `[0, 1]` depth standard).
 *
 * ### Example
 * ```typescript
 * const planesFlat = RedGPU.Math.computeFrustumPlanesFromPVMatrixFlat(pvMatrix);
 * ```
 *
 * @param m -
 * [KO] 투영-뷰 결합 4x4 행렬 (`mat4`, 열 우선)
 * [EN] Combined projection-view 4x4 matrix (`mat4`, column-major)
 * @param out -
 * [KO] 결과를 기록할 재사용 `Float32Array(24)` 버퍼 (선택 사항, 미지정 시 새 버퍼 할당)
 * [EN] Reusable `Float32Array(24)` buffer to write the result (optional, allocates a new buffer if omitted)
 * @returns
 * [KO] 평탄화된 6개 평면 계수 버퍼 (`Float32Array`, `[A0, B0, C0, D0, ..., A5, B5, C5, D5]`)
 * [EN] Flattened 6-plane coefficient buffer (`Float32Array`, `[A0, B0, C0, D0, ..., A5, B5, C5, D5]`)
 * @category Math
 */
const computeFrustumPlanesFromPVMatrixFlat = (
    m: mat4,
    out?: Float32Array
): Float32Array => {
    if (!out) {
        out = new Float32Array(24);
    }

    out[0] = m[3] + m[0];
    out[1] = m[7] + m[4];
    out[2] = m[11] + m[8];
    out[3] = m[15] + m[12];

    out[4] = m[3] - m[0];
    out[5] = m[7] - m[4];
    out[6] = m[11] - m[8];
    out[7] = m[15] - m[12];

    out[8] = m[3] + m[1];
    out[9] = m[7] + m[5];
    out[10] = m[11] + m[9];
    out[11] = m[15] + m[13];

    out[12] = m[3] - m[1];
    out[13] = m[7] - m[5];
    out[14] = m[11] - m[9];
    out[15] = m[15] - m[13];

    out[16] = m[2];
    out[17] = m[6];
    out[18] = m[10];
    out[19] = m[14];

    out[20] = m[3] - m[2];
    out[21] = m[7] - m[6];
    out[22] = m[11] - m[10];
    out[23] = m[15] - m[14];

    for (let i = 0; i < 6; i++) {
        const offset = i * 4;
        const x = out[offset], y = out[offset + 1], z = out[offset + 2];
        const norm = Math.sqrt(x * x + y * y + z * z);
        if (norm > 0.000001) {
            const invNorm = 1.0 / norm;
            out[offset] *= invNorm;
            out[offset + 1] *= invNorm;
            out[offset + 2] *= invNorm;
            out[offset + 3] *= invNorm;
        }
    }

    return out;
};

export {
    computeFrustumPlanes,
    computeFrustumPlanesFlat,
    computeFrustumPlanesFromPVMatrix,
    computeFrustumPlanesFromPVMatrixFlat
};
export default computeFrustumPlanes;