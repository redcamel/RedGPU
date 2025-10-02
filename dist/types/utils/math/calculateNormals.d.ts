/**
 * 주어진 정점(vertex) 배열과 인덱스 배열을 기반으로 각 정점의 노멀 벡터(normals)를 계산합니다.
 *
 * 삼각형 단위로 각 면의 노멀을 구한 뒤, 해당 면에 속한 정점의 노멀에 누적하여 평균화합니다.
 *
 * 마지막에 각 정점의 노멀을 정규화하여 반환합니다.
 *
 * @param {number[]} vertexArray 정점 위치 배열 (x, y, z 순서로 3개씩)
 * @param {number[]} indexArray 삼각형을 구성하는 정점 인덱스 배열
 * @returns {number[]} 계산된 정점 노멀 배열 (x, y, z 순서로 3개씩)
 */
declare const calculateNormals: (vertexArray: any, indexArray: any) => any[];
export default calculateNormals;
