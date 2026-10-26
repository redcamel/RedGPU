import Mesh from "../../display/mesh/Mesh";
import AABB from "../AABB";
/**
 * [KO] 메시의 로컬 지오메트리 볼륨에 `modelMatrix`를 적용하여 월드 공간 축 정렬 경계 상자(`AABB`)를 계산합니다.
 * [EN] Calculates the world-space Axis-Aligned Bounding Box (`AABB`) by applying `modelMatrix` to the local geometry volume of a mesh.
 *
 * ### Example
 * ```typescript
 * const meshAABB = RedGPU.Bound.calculateMeshAABB(mesh);
 * ```
 *
 * @param mesh -
 * [KO] 월드 `AABB`를 계산할 대상 `Mesh` 인스턴스
 * [EN] Target `Mesh` instance to calculate the world-space `AABB` from
 * @param targetAABB -
 * [KO] 결과를 제자리(In-place)에 저장할 대상 `AABB` 인스턴스 (생략 시 새 인스턴스 생성)
 * [EN] Target `AABB` instance to store the result in-place (creates a new instance if omitted)
 * @returns
 * [KO] 계산된 월드 공간 `AABB` 인스턴스
 * [EN] Calculated world-space `AABB` instance
 * @category Bound
 */
declare const calculateMeshAABB: (mesh: Mesh, targetAABB?: AABB) => AABB;
export default calculateMeshAABB;
