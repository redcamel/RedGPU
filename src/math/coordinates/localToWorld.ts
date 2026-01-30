import {mat4} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";

const temp_matrix0 = mat4.create();
/**
 * [KO] 로컬 좌표를 월드 좌표로 변환합니다.
 * [EN] Converts local coordinates to world coordinates.
 *
 * * ### Example
 * ```typescript
 * const worldPos = RedGPU.Util.localToWorld(mesh.modelMatrix, 0, 1, 0);
 * ```
 *
 * @param targetMatrix -
 * [KO] 변환에 사용할 4x4 행렬
 * [EN] 4x4 matrix to use for transformation
 * @param x -
 * [KO] 로컬 x 좌표
 * [EN] Local x coordinate
 * @param y -
 * [KO] 로컬 y 좌표
 * [EN] Local y coordinate
 * @param z -
 * [KO] 로컬 z 좌표
 * [EN] Local z coordinate
 * @returns
 * [KO] 변환된 월드 좌표 [x, y, z]
 * [EN] Converted world coordinates [x, y, z]
 * @throws
 * [KO] 입력 좌표가 숫자가 아니면 Error 발생
 * [EN] Throws Error if coordinates are not numbers
 * @category Coordinates
 */
const localToWorld = (targetMatrix: mat4, x: number, y: number, z: number): [number, number, number] => {
    validateNumber(x)
    validateNumber(y)
    validateNumber(z)
    // 변환 행렬 초기화
    mat4.identity(temp_matrix0);
    mat4.translate(temp_matrix0, temp_matrix0, [x, y, z]);
    // 올바른 순서: targetMatrix * translate
    mat4.multiply(temp_matrix0, targetMatrix, temp_matrix0);
    // 변환된 월드 좌표 반환
    return [
        temp_matrix0[12],
        temp_matrix0[13],
        temp_matrix0[14]
    ]
}
export default localToWorld