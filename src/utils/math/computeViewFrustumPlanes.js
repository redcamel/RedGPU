import { mat4 } from "gl-matrix";
const tempMTX = mat4.create();
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
const computeViewFrustumPlanes = (projectionMatrix, cameraMatrix) => {
    mat4.multiply(tempMTX, projectionMatrix, cameraMatrix);
    const planes = [
        [tempMTX[3] - tempMTX[0], tempMTX[7] - tempMTX[4], tempMTX[11] - tempMTX[8], tempMTX[15] - tempMTX[12]],
        [tempMTX[3] + tempMTX[0], tempMTX[7] + tempMTX[4], tempMTX[11] + tempMTX[8], tempMTX[15] + tempMTX[12]],
        [tempMTX[3] + tempMTX[1], tempMTX[7] + tempMTX[5], tempMTX[11] + tempMTX[9], tempMTX[15] + tempMTX[13]],
        [tempMTX[3] - tempMTX[1], tempMTX[7] - tempMTX[5], tempMTX[11] - tempMTX[9], tempMTX[15] - tempMTX[13]],
        [tempMTX[3] - tempMTX[2], tempMTX[7] - tempMTX[6], tempMTX[11] - tempMTX[10], tempMTX[15] - tempMTX[14]],
        [tempMTX[3] + tempMTX[2], tempMTX[7] + tempMTX[6], tempMTX[11] + tempMTX[10], tempMTX[15] + tempMTX[14]]
    ];
    for (let i = 0; i < 6; i++) {
        const plane = planes[i];
        const norm = Math.sqrt(plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2]);
        plane[0] /= norm;
        plane[1] /= norm;
        plane[2] /= norm;
        plane[3] /= norm;
    }
    return planes;
};
export default computeViewFrustumPlanes;
