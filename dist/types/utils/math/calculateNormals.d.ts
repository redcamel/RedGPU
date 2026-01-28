/**
 * [KO] 정점 배열과 인덱스 배열을 기반으로 노멀 벡터를 계산합니다.
 * [EN] Calculates vertex normals from vertex and index arrays.
 *
 * [KO] 삼각형 면 단위로 노멀을 구한 뒤 평균화 및 정규화하여 반환합니다.
 * [EN] Calculates face normals, then returns averaged and normalized vertex normals.
 *
 * * ### Example
 * ```typescript
 * const normals = RedGPU.Util.calculateNormals(vertices, indices);
 * ```
 *
 * @param vertexArray -
 * [KO] 정점 위치 배열 (x, y, z 순서)
 * [EN] Vertex position array (x, y, z order)
 * @param indexArray -
 * [KO] 삼각형 정점 인덱스 배열
 * [EN] Vertex index array defining triangles
 * @returns
 * [KO] 계산된 정점 노멀 배열
 * [EN] Calculated vertex normal array
 * @category Math
 */
declare const calculateNormals: (vertexArray: number[], indexArray: number[]) => number[];
export default calculateNormals;
