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
const mat4ToEuler = (mat: any, dest: any, order?: any) => {
    dest = dest || [0, 0, 0];
    order = order || 'XYZ';
    let m11 = mat[0], m12 = mat[4], m13 = mat[8];
    let m21 = mat[1], m22 = mat[5], m23 = mat[9];
    let m31 = mat[2], m32 = mat[6], m33 = mat[10];
    if (order === 'XYZ') {
        dest[1] = Math.asin(clamp(m13, -1, 1));
        if (Math.abs(m13) < 0.99999) {
            dest[0] = Math.atan2(-m23, m33);
            dest[2] = Math.atan2(-m12, m11);
        } else {
            dest[0] = Math.atan2(m32, m22);
            dest[2] = 0;
        }
    } else if (order === 'YXZ') {
        dest[0] = Math.asin(-clamp(m23, -1, 1));
        if (Math.abs(m23) < 0.99999) {
            dest[1] = Math.atan2(m13, m33);
            dest[2] = Math.atan2(m21, m22);
        } else {
            dest[1] = Math.atan2(-m31, m11);
            dest[2] = 0;
        }
    } else if (order === 'ZXY') {
        dest[0] = Math.asin(clamp(m32, -1, 1));
        if (Math.abs(m32) < 0.99999) {
            dest[1] = Math.atan2(-m31, m33);
            dest[2] = Math.atan2(-m12, m22);
        } else {
            dest[1] = 0;
            dest[2] = Math.atan2(m21, m11);
        }
    } else if (order === 'ZYX') {
        dest[1] = Math.asin(-clamp(m31, -1, 1));
        if (Math.abs(m31) < 0.99999) {
            dest[0] = Math.atan2(m32, m33);
            dest[2] = Math.atan2(m21, m11);
        } else {
            dest[0] = 0;
            dest[2] = Math.atan2(-m12, m22);
        }
    } else if (order === 'YZX') {
        dest[2] = Math.asin(clamp(m21, -1, 1));
        if (Math.abs(m21) < 0.99999) {
            dest[0] = Math.atan2(-m23, m22);
            dest[1] = Math.atan2(-m31, m11);
        } else {
            dest[0] = 0;
            dest[1] = Math.atan2(m13, m33);
        }
    } else if (order === 'XZY') {
        dest[2] = Math.asin(-clamp(m12, -1, 1));
        if (Math.abs(m12) < 0.99999) {
            dest[0] = Math.atan2(m32, m22);
            dest[1] = Math.atan2(m13, m11);
        } else {
            dest[0] = Math.atan2(-m23, m33);
            dest[1] = 0;
        }
    }
    return dest;
}
let clamp = function (value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
};
export default mat4ToEuler