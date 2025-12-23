/**
 * MikkTSpace 알고리즘을 기반으로 탄젠트 벡터를 계산합니다.
 * @param vertices - 정점 위치 배열 [x,y,z, x,y,z, ...]
 * @param normals - 노멀 벡터 배열 [x,y,z, x,y,z, ...]
 * @param uvs - UV 좌표 배열 [u,v, u,v, ...]
 * @param indices - 인덱스 배열 (삼각형 단위, 빈 배열이면 non-indexed)
 * @param existingTangents - 기존 탄젠트 배열 (선택적)
 * @returns 탄젠트 배열 [x,y,z,w, x,y,z,w, ...] (w는 handedness)
 */
declare const calculateTangents: (vertices: number[], normals: number[], uvs: number[], indices: number[], existingTangents?: number[]) => number[];
export default calculateTangents;
