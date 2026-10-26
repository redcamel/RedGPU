import { mat4 } from "gl-matrix";
/**
 * [KO] 4x4 변환 행렬(`targetMatrix`)의 역행렬을 사용하여 3D 월드 좌표(`[x, y, z]`)를 로컬 좌표(`[x, y, z]`)로 변환합니다.
 * [EN] Transforms 3D world coordinates (`[x, y, z]`) into local coordinates (`[x, y, z]`) using the inverse of a 4x4 transformation matrix (`targetMatrix`).
 *
 * ### Example
 * ```typescript
 * const [localX, localY, localZ] = RedGPU.Math.worldToLocal(mesh.modelMatrix, 10, 5, 0);
 * ```
 *
 * @param targetMatrix -
 * [KO] 기준 객체의 4x4 월드 변환 행렬 (`mat4`, 열 우선)
 * [EN] 4x4 world transformation matrix of the target object (`mat4`, column-major)
 * @param x -
 * [KO] 변환할 월드 X 좌표
 * [EN] World X coordinate to transform
 * @param y -
 * [KO] 변환할 월드 Y 좌표
 * [EN] World Y coordinate to transform
 * @param z -
 * [KO] 변환할 월드 Z 좌표
 * [EN] World Z coordinate to transform
 * @returns
 * [KO] 변환된 로컬 좌표 튜플 (`[x, y, z]`)
 * [EN] Transformed local coordinate tuple (`[x, y, z]`)
 * @throws
 * [KO] `x`, `y`, `z` 중 하나라도 유효한 숫자가 아닐 경우 에러 발생
 * [EN] Throws an error if any of `x`, `y`, or `z` is not a valid number
 * @see [World to Local example](/RedGPU/examples/3d/coordinateTransformation/worldToLocal/)
 * @category Math
 */
declare const worldToLocal: (targetMatrix: mat4, x: number, y: number, z: number) => [number, number, number];
export default worldToLocal;
