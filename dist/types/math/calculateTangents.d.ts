/**
 * [KO] MikkTSpace 알고리즘 기반으로 정점 탄젠트 벡터를 계산합니다. (고성능 인터리브 버퍼 전용)
 * [EN] Calculates vertex tangent vectors using MikkTSpace algorithm. (High-performance interleaved buffer only)
 *
 * @param interleaveData - [KO] 인터리브 형식의 정점 데이터 [EN] Interleaved vertex data
 * @param indices - [KO] 인덱스 데이터 [EN] Index data
 * @param stride - [KO] 정점당 데이터 개수 [EN] Floats per vertex
 * @param posOffset - [KO] 위치 데이터 오프셋 [EN] Position data offset
 * @param normalOffset - [KO] 노멀 데이터 오프셋 [EN] Normal data offset
 * @param uvOffset - [KO] UV 데이터 오프셋 [EN] UV data offset
 * @param tangentOffset - [KO] 결과 탄젠트가 기록될 오프셋 [EN] Offset where the result tangents will be written
 */
export declare const calculateTangentsInterleaved: (interleaveData: Float32Array | number[], indices: Uint32Array | number[], stride: number, posOffset: number, normalOffset: number, uvOffset: number, tangentOffset: number) => void;
/**
 * [KO] MikkTSpace 알고리즘 기반으로 정점 탄젠트 벡터를 계산하여 새로운 배열로 반환합니다. (순수 수학 유틸리티)
 * [EN] Calculates vertex tangent vectors and returns them as a new array. (Pure math utility)
 *
 * @param vertices - [KO] 정점 위치 배열 [EN] Vertex position array
 * @param normals - [KO] 노멀 벡터 배열 [EN] Normal vector array
 * @param uvs - [KO] UV 좌표 배열 [EN] UV coordinate array
 * @param indices - [KO] 인덱스 데이터 [EN] Index data
 * @returns [KO] 계산된 탄젠트 배열 [EN] Calculated tangent array [x, y, z, w, ...]
 * @category Math
 */
declare const calculateTangents: (vertices: number[] | Float32Array, normals: number[] | Float32Array, uvs: number[] | Float32Array, indices: number[] | Uint32Array) => Float32Array;
export default calculateTangents;
