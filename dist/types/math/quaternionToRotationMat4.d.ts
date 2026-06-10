/**
 * [KO] 쿼터니언을 회전 행렬로 변환합니다.
 * [EN] Converts a quaternion to a rotation matrix.
 *
 * ### Example
 * ```typescript
 * RedGPU.math.quaternionToRotationMat4([0, 0, 0, 1], outMatrix);
 * ```
 *
 * @param q -
 * [KO] 쿼터니언 [x, y, z, w]
 * [EN] Quaternion [x, y, z, w]
 * @param m -
 * [KO] 결과를 저장할 4x4 행렬
 * [EN] Destination 4x4 matrix
 * @returns
 * [KO] 변환된 회전 행렬
 * [EN] Converted rotation matrix
 * @category Math
 */
declare const quaternionToRotationMat4: (q: any, m: any) => any;
export default quaternionToRotationMat4;
