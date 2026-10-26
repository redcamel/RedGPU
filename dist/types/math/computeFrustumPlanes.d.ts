import { mat4 } from "gl-matrix";
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
declare const computeFrustumPlanes: (projectionMatrix: mat4, viewMatrix: mat4, out?: number[][]) => number[][];
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
declare const computeFrustumPlanesFlat: (projectionMatrix: mat4, viewMatrix: mat4, out?: Float32Array) => Float32Array;
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
declare const computeFrustumPlanesFromPVMatrix: (m: mat4, out?: number[][]) => number[][];
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
declare const computeFrustumPlanesFromPVMatrixFlat: (m: mat4, out?: Float32Array) => Float32Array;
export { computeFrustumPlanes, computeFrustumPlanesFlat, computeFrustumPlanesFromPVMatrix, computeFrustumPlanesFromPVMatrixFlat };
export default computeFrustumPlanes;
