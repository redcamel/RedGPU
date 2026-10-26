/**
 * [KO] 인터리브 정점 버퍼에서 MikkTSpace 알고리즘 기반으로 정점 탄젠트 벡터(`[tx, ty, tz, w]`)를 계산하여 지정된 오프셋에 인플레이스(In-place)로 기록합니다.
 * [EN] Calculates vertex tangent vectors (`[tx, ty, tz, w]`) based on the MikkTSpace algorithm from an interleaved vertex buffer and writes them in-place at the specified offset.
 *
 * ### Example
 * ```typescript
 * RedGPU.Math.calculateTangentsInterleaved(interleaveData, indices, 12, 0, 3, 6, 8);
 * ```
 *
 * @param interleaveData -
 * [KO] 인터리브 정점 데이터 버퍼 (`Float32Array` 또는 `Array<number>`)
 * [EN] Interleaved vertex data buffer (`Float32Array` or `Array<number>`)
 * @param indices -
 * [KO] 삼각형 정점 인덱스 버퍼 (`Uint32Array` 또는 `Array<number>`)
 * [EN] Triangle vertex index buffer (`Uint32Array` or `Array<number>`)
 * @param stride -
 * [KO] 정점당 요소(float) 개수
 * [EN] Number of elements (floats) per vertex
 * @param posOffset -
 * [KO] 정점 내 위치(Position) 데이터의 시작 오프셋
 * [EN] Starting offset of position data within a vertex
 * @param normalOffset -
 * [KO] 정점 내 법선(Normal) 데이터의 시작 오프셋
 * [EN] Starting offset of normal data within a vertex
 * @param uvOffset -
 * [KO] 정점 내 UV 좌표 데이터의 시작 오프셋
 * [EN] Starting offset of UV coordinate data within a vertex
 * @param tangentOffset -
 * [KO] 계산된 탄젠트(`[tx, ty, tz, w]`)가 기록될 시작 오프셋
 * [EN] Starting offset where calculated tangents (`[tx, ty, tz, w]`) will be written
 * @category Math
 */
export declare const calculateTangentsInterleaved: (interleaveData: Float32Array | number[], indices: Uint32Array | number[], stride: number, posOffset: number, normalOffset: number, uvOffset: number, tangentOffset: number) => void;
/**
 * [KO] 정점 위치, 법선, UV, 인덱스 배열로부터 MikkTSpace 알고리즘 기반의 정점 탄젠트 벡터(`Float32Array`)를 계산하여 반환합니다.
 * [EN] Calculates and returns vertex tangent vectors (`Float32Array`) based on the MikkTSpace algorithm from vertex position, normal, UV, and index arrays.
 *
 * ### Example
 * ```typescript
 * const tangents = RedGPU.Math.calculateTangents(vertices, normals, uvs, indices);
 * ```
 *
 * @param vertices -
 * [KO] 정점 위치 배열 (`[x, y, z, ...]`)
 * [EN] Vertex position array (`[x, y, z, ...]`)
 * @param normals -
 * [KO] 정점 법선 벡터 배열 (`[nx, ny, nz, ...]`)
 * [EN] Vertex normal vector array (`[nx, ny, nz, ...]`)
 * @param uvs -
 * [KO] UV 텍스처 좌표 배열 (`[u, v, ...]`)
 * [EN] UV texture coordinate array (`[u, v, ...]`)
 * @param indices -
 * [KO] 삼각형 정점 인덱스 배열
 * [EN] Triangle vertex index array
 * @returns
 * [KO] 계산된 정점 탄젠트 배열 (`Float32Array`, `[tx, ty, tz, w, ...]`)
 * [EN] Calculated vertex tangent array (`Float32Array`, `[tx, ty, tz, w, ...]`)
 * @category Math
 */
declare const calculateTangents: (vertices: number[] | Float32Array, normals: number[] | Float32Array, uvs: number[] | Float32Array, indices: number[] | Uint32Array) => Float32Array;
export default calculateTangents;
