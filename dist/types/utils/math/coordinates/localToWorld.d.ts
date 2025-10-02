import { mat4 } from "gl-matrix";
/**
 * 로컬 좌표(x, y, z)를 주어진 변환 행렬(targetMatrix)로 변환하여 월드 좌표로 반환합니다.
 *
 * 입력 좌표(x, y, z)에 대해 targetMatrix를 적용한 결과를 [x, y, z] 배열로 반환합니다.
 *
 * 각 좌표값은 숫자인지 검증하며, 행렬 곱셈 순서는 targetMatrix * translate입니다.
 *
 * @category Coordinates
 * @param {mat4} targetMatrix 변환에 사용할 4x4 행렬
 * @param {number} x 변환할 로컬 x 좌표
 * @param {number} y 변환할 로컬 y 좌표
 * @param {number} z 변환할 로컬 z 좌표
 * @returns {[number, number, number]} 변환된 월드 좌표 [x, y, z]
 * @throws {Error} x, y, z가 숫자가 아니면 예외 발생
 */
declare const localToWorld: (targetMatrix: mat4, x: number, y: number, z: number) => [number, number, number];
export default localToWorld;
