import { mat4 } from "gl-matrix";
/**
 * 주어진 프로젝션 행렬과 카메라 행렬로부터 뷰 프러스텀 평면(6개)을 계산합니다.
 *
 * 프로젝션 행렬과 카메라 행렬을 곱한 뒤, 각 평면(좌, 우, 상, 하, 근, 원)의 방정식 계수를 추출하여
 *
 * [A, B, C, D] 형태로 반환합니다. 각 평면은 정규화되어 있습니다.
 *
 * @param {mat4} projectionMatrix 프로젝션 행렬
 * @param {mat4} cameraMatrix 카메라 행렬
 * @returns {number[][]} 6개 뷰 프러스텀 평면의 [A, B, C, D] 배열 (총 6개)
 */
declare const computeViewFrustumPlanes: (projectionMatrix: mat4, cameraMatrix: mat4) => number[][];
export default computeViewFrustumPlanes;
