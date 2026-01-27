import Mesh from "../../display/mesh/Mesh";
import AABB from "../AABB";
/**
 * [KO] 메시와 모든 자식 메시의 AABB를 통합하여 계산합니다.
 * [EN] Calculates a combined AABB encompassing the mesh and all its children.
 *
 * [KO] 메시 계층 구조를 순회하며 모든 바운딩 볼륨을 통합한 새로운 AABB를 반환합니다.
 * [EN] Traverses the mesh hierarchy and returns a new AABB combining all bounding volumes.
 *
 * * ### Example
 * ```typescript
 * const combinedAABB = RedGPU.Bound.calculateMeshCombinedAABB(rootMesh);
 * ```
 *
 * @param mesh -
 * [KO] AABB를 계산할 루트 메시 객체
 * [EN] Root mesh object to calculate AABB from
 * @returns
 * [KO] 통합된 AABB 인스턴스
 * [EN] Combined AABB instance
 * @category Bound
 */
declare const calculateMeshCombinedAABB: (mesh: Mesh) => AABB;
export default calculateMeshCombinedAABB;
