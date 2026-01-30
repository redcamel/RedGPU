import {mat4, vec3} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";

const temp_matrix = mat4.create();
const temp_vector = vec3.create();
/**
 * [KO] 월드 좌표를 로컬 좌표로 변환합니다.
 * [EN] Converts world coordinates to local coordinates.
 *
 * * ### Example
 * ```typescript
 * const localPos = RedGPU.Util.worldToLocal(mesh.modelMatrix, 10, 5, 0);
 * ```
 *
 * @param targetMatrix -
 * [KO] 변환에 사용할 4x4 행렬
 * [EN] 4x4 matrix to use for transformation
 * @param x -
 * [KO] 월드 x 좌표
 * [EN] World x coordinate
 * @param y -
 * [KO] 월드 y 좌표
 * [EN] World y coordinate
 * @param z -
 * [KO] 월드 z 좌표
 * [EN] World z coordinate
 * @returns
 * [KO] 변환된 로컬 좌표 [x, y, z]
 * [EN] Converted local coordinates [x, y, z]
 * @throws
 * [KO] 입력 좌표가 숫자가 아니면 Error 발생
 * [EN] Throws Error if coordinates are not numbers
 * @category Coordinates
 */
const worldToLocal = (targetMatrix: mat4, x: number, y: number, z: number): [number, number, number] => {
    validateNumber(x)
    validateNumber(y)
    validateNumber(z)
    // targetMatrix의 역행렬 계산
    mat4.invert(temp_matrix, targetMatrix);
    // 월드 좌표 벡터 설정
    vec3.set(temp_vector, x, y, z);
    // 역변환 적용
    vec3.transformMat4(temp_vector, temp_vector, temp_matrix);
    return [temp_vector[0], temp_vector[1], temp_vector[2]]
}
export default worldToLocal