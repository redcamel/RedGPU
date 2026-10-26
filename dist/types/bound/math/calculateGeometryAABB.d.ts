import VertexBuffer from "../../resources/buffer/vertexBuffer/VertexBuffer";
import AABB from "../AABB";
/**
 * [KO] `VertexBuffer`의 정점 위치 데이터를 순회하여 로컬 축 정렬 경계 상자(`AABB`)를 계산합니다.
 * [EN] Calculates a local Axis-Aligned Bounding Box (`AABB`) by iterating over the vertex position data of a `VertexBuffer`.
 *
 * ### Example
 * ```typescript
 * const geometryAABB = RedGPU.Bound.calculateGeometryAABB(vertexBuffer);
 * ```
 *
 * @param vertexBuffer -
 * [KO] `AABB`를 계산할 대상 `VertexBuffer` 인스턴스
 * [EN] Target `VertexBuffer` instance to calculate the `AABB` from
 * @returns
 * [KO] 계산된 로컬 `AABB` 인스턴스
 * [EN] Calculated local `AABB` instance
 * @category Bound
 */
declare const calculateGeometryAABB: (vertexBuffer: VertexBuffer) => AABB;
export default calculateGeometryAABB;
