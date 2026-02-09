/**
 * [KO] MikkTSpace 알고리즘 기반으로 정점 탄젠트 벡터를 계산합니다.
 * [EN] Calculates vertex tangent vectors using MikkTSpace algorithm.
 *
 * ### Example
 * ```typescript
 * const tangents = RedGPU.math.calculateTangents(vertices, normals, uvs, indices);
 * ```
 *
 * @param vertices -
 * [KO] 정점 위치 배열
 * [EN] Vertex position array
 * @param normals -
 * [KO] 노멀 벡터 배열
 * [EN] Normal vector array
 * @param uvs -
 * [KO] UV 좌표 배열
 * [EN] UV coordinate array
 * @param indices -
 * [KO] 인덱스 배열
 * [EN] Index array
 * @param existingTangents -
 * [KO] 기존 탄젠트 배열 (선택적)
 * [EN] Existing tangent array (optional)
 * @returns
 * [KO] 계산된 탄젠트 배열 [x, y, z, w, ...]
 * [EN] Calculated tangent array [x, y, z, w, ...]
 * @category Math
 */
declare const calculateTangents: (vertices: number[], normals: number[], uvs: number[], indices: number[], existingTangents?: number[]) => number[];
export default calculateTangents;
