import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import AABB from "../AABB";
/**
 * [KO] VertexBuffer 정보를 기반으로 AABB를 계산합니다.
 * [EN] Calculates AABB based on VertexBuffer information.
 *
 * [KO] 버텍스 버퍼의 각 정점 위치를 순회하며 최소/최대값을 찾아 AABB를 생성합니다.
 * [EN] Iterates through vertex positions to find min/max values and create an AABB.
 *
 * * ### Example
 * ```typescript
 * const geometryAABB = RedGPU.Bound.calculateGeometryAABB(vertexBuffer);
 * ```
 *
 * @param vertexBuffer -
 * [KO] AABB를 계산할 버텍스 버퍼 객체
 * [EN] Vertex buffer object to calculate AABB from
 * @returns
 * [KO] 계산된 AABB 인스턴스
 * [EN] Calculated AABB instance
 * @category Bound
 */
declare const calculateGeometryAABB: (vertexBuffer: VertexBuffer) => AABB;
export default calculateGeometryAABB;
