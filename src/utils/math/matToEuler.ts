/**
 * [KO] 4x4 행렬에서 오일러 각도(Euler angles)를 추출합니다.
 * [EN] Extracts Euler angles from a 4x4 matrix.
 *
 * @param mat
 * [KO] 4x4 행렬 (배열 형태)
 * [EN] 4x4 matrix (array format)
 * @param dest
 * [KO] 결과를 저장할 배열 (선택)
 * [EN] Destination array to store result (optional)
 * @param order
 * [KO] 회전 순서 (기본값: 'XYZ')
 * [EN] Rotation order (default: 'XYZ')
 * @returns
 * [KO] 오일러 각도가 저장된 배열 [x, y, z]
 * [EN] Array containing Euler angles [x, y, z]
 * @category Math
 */
const mat4ToEuler = (mat: any, dest: any, order?: any) => {
    dest = dest || [0, 0, 0];
    order = order || 'XYZ';
    // Assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
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