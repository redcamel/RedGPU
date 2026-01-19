/**
 * [KO] 4x4 행렬에서 오일러 각도를 추출합니다.
 * [EN] Extracts Euler angles from a 4x4 matrix.
 *
 * * ### Example
 * ```typescript
 * const euler = RedGPU.Util.mat4ToEuler(matrix, [0, 0, 0], 'XYZ');
 * ```
 *
 * @param mat -
 * [KO] 4x4 행렬
 * [EN] 4x4 matrix
 * @param dest -
 * [KO] 결과를 저장할 배열
 * [EN] Destination array to store result
 * @param order -
 * [KO] 회전 순서 (기본값: 'XYZ')
 * [EN] Rotation order (Default: 'XYZ')
 * @returns
 * [KO] 오일러 각도가 저장된 배열 [x, y, z]
 * [EN] Array containing Euler angles [x, y, z]
 * @category Math
 */
declare const mat4ToEuler: (mat: any, dest: any, order?: any) => any;
export default mat4ToEuler;
