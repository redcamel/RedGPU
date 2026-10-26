/**
 * [KO] 정점 위치 배열과 삼각형 인덱스 배열로부터 정규화된 정점 법선(Normal) 벡터 배열을 계산합니다.
 * [EN] Calculates a normalized vertex normal vector array from vertex position and triangle index arrays.
 *
 * ### Example
 * ```typescript
 * const normals = RedGPU.Math.calculateNormals(vertices, indices);
 * ```
 *
 * @param vertexArray -
 * [KO] 정점 위치 배열 (`[x, y, z, ...]`)
 * [EN] Vertex position array (`[x, y, z, ...]`)
 * @param indexArray -
 * [KO] 삼각형 정점 인덱스 배열 (비어 있을 경우 정점 순서대로 처리)
 * [EN] Triangle vertex index array (processed in vertex order if empty)
 * @returns
 * [KO] 정규화된 정점 법선 벡터 배열 (`[nx, ny, nz, ...]`)
 * [EN] Normalized vertex normal vector array (`[nx, ny, nz, ...]`)
 * @category Math
 */
declare const calculateNormals: (vertexArray: number[], indexArray: number[]) => number[];
export default calculateNormals;
