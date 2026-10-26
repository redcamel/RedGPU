import Mesh from "../../display/mesh/Mesh";
import AABB from "../AABB";
/**
 * [KO] 메시와 모든 자식 메시의 바운딩 볼륨을 통합한 AABB를 계산합니다.
 * [EN] Calculates a combined AABB encompassing the mesh and all its child meshes.
 *
 * ### Example
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
