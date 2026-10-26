/**
 * [KO] 열 우선(Column-major) 4x4 회전 행렬의 상위 3x3 성분에서 라디안(Radian) 단위의 오일러 각도를 추출합니다.
 * [EN] Extracts Euler angles in radians from the upper 3x3 components of a column-major 4x4 rotation matrix.
 *
 * ### Example
 * ```typescript
 * const euler = RedGPU.Math.matToEuler(matrix, [0, 0, 0], 'XYZ');
 * ```
 *
 * @param mat -
 * [KO] 스케일이 제거된 4x4 회전 행렬 (열 우선)
 * [EN] Unscaled 4x4 rotation matrix (column-major)
 * @param dest -
 * [KO] 결과를 저장할 배열 (기본값: `[0, 0, 0]`)
 * [EN] Destination array to store the result (default: `[0, 0, 0]`)
 * @param order -
 * [KO] 회전 축 순서 (`'XYZ'`, `'YXZ'`, `'ZXY'`, `'ZYX'`, `'YZX'`, `'XZY'`, 기본값: `'XYZ'`)
 * [EN] Rotation axis order (`'XYZ'`, `'YXZ'`, `'ZXY'`, `'ZYX'`, `'YZX'`, `'XZY'`, default: `'XYZ'`)
 * @returns
 * [KO] 라디안 단위의 오일러 회전 각도 배열 (`[x, y, z]`)
 * [EN] Euler rotation angle array in radians (`[x, y, z]`)
 * @category Math
 */
declare const mat4ToEuler: (mat: any, dest: any, order?: any) => any;
export default mat4ToEuler;
