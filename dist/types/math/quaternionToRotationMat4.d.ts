/**
 * [KO] 쿼터니언(`[x, y, z, w]`)을 열 우선(Column-major) 4x4 회전 행렬로 변환합니다.
 * [EN] Converts a quaternion (`[x, y, z, w]`) into a column-major 4x4 rotation matrix.
 *
 * ### Example
 * ```typescript
 * RedGPU.Math.quaternionToRotationMat4([0, 0, 0, 1], outMatrix);
 * ```
 *
 * @param q -
 * [KO] 쿼터니언 배열 (`[x, y, z, w]`)
 * [EN] Quaternion array (`[x, y, z, w]`)
 * @param m -
 * [KO] 결과를 기록할 4x4 행렬 버퍼
 * [EN] Target 4x4 matrix buffer to store the result
 * @returns
 * [KO] 변환된 4x4 회전 행렬 (`m`)
 * [EN] Converted 4x4 rotation matrix (`m`)
 * @category Math
 */
declare const quaternionToRotationMat4: (q: any, m: any) => any;
export default quaternionToRotationMat4;
