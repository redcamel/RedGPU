import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import AABB from "./AABB";
/**
 * 주어진 VertexBuffer의 모든 정점 정보를 기반으로 3차원 Axis-Aligned Bounding Box(AABB)를 계산합니다.
 *
 * 버텍스 버퍼의 각 정점(x, y, z)에 대해 최소/최대값을 찾아 AABB를 생성합니다.
 *
 * 버텍스 버퍼가 없거나 데이터가 없으면 (0,0,0,0,0,0) AABB를 반환합니다.
 *
 * @category Bound
 * @param {VertexBuffer} vertexBuffer AABB를 계산할 버텍스 버퍼 객체
 * @returns {AABB} 계산된 AABB 인스턴스
 */
declare const calculateGeometryAABB: (vertexBuffer: VertexBuffer) => AABB;
export default calculateGeometryAABB;
