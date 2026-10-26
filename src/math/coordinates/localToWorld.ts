import {mat4} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";

const temp_matrix0 = mat4.create();
/**
 * [KO] 4x4 변환 행렬(`targetMatrix`)을 사용하여 로컬 좌표(`[x, y, z]`)를 3D 월드 좌표(`[x, y, z]`)로 변환합니다.
 * [EN] Transforms local coordinates (`[x, y, z]`) into 3D world coordinates (`[x, y, z]`) using a 4x4 transformation matrix (`targetMatrix`).
 *
 * ### Example
 * ```typescript
 * const [worldX, worldY, worldZ] = RedGPU.Math.localToWorld(mesh.modelMatrix, 0, 1, 0);
 * ```
 *
 * @param targetMatrix -
 * [KO] 기준 객체의 4x4 월드 변환 행렬 (`mat4`, 열 우선)
 * [EN] 4x4 world transformation matrix of the target object (`mat4`, column-major)
 * @param x -
 * [KO] 변환할 로컬 X 좌표
 * [EN] Local X coordinate to transform
 * @param y -
 * [KO] 변환할 로컬 Y 좌표
 * [EN] Local Y coordinate to transform
 * @param z -
 * [KO] 변환할 로컬 Z 좌표
 * [EN] Local Z coordinate to transform
 * @returns
 * [KO] 변환된 3D 월드 좌표 튜플 (`[x, y, z]`)
 * [EN] Transformed 3D world coordinate tuple (`[x, y, z]`)
 * @throws
 * [KO] `x`, `y`, `z` 중 하나라도 유효한 숫자가 아닐 경우 에러 발생
 * [EN] Throws an error if any of `x`, `y`, or `z` is not a valid number
 * @see [World to Local example](/RedGPU/examples/3d/coordinateTransformation/worldToLocal/)
 * @category Math
 */
const localToWorld = (targetMatrix: mat4, x: number, y: number, z: number): [number, number, number] => {
    validateNumber(x)
    validateNumber(y)
    validateNumber(z)
    mat4.identity(temp_matrix0);
    mat4.translate(temp_matrix0, temp_matrix0, [x, y, z]);
    mat4.multiply(temp_matrix0, targetMatrix, temp_matrix0);
    return [
        temp_matrix0[12],
        temp_matrix0[13],
        temp_matrix0[14]
    ]
}
export default localToWorld