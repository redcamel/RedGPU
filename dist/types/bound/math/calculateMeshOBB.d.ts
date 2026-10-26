import Mesh from "../../display/mesh/Mesh";
import OBB from "../OBB";
/**
 * [KO] 메시의 `modelMatrix`를 적용하여 월드 공간 기준 OBB를 계산합니다.
 * [EN] Calculates the world-space OBB by applying the mesh's `modelMatrix`.
 *
 * [KO] 지오메트리 볼륨 정보를 기반으로 변환된 중심점, 반치수, 방향 행렬을 포함하는 OBB를 반환합니다.
 * [EN] Returns an OBB containing the transformed center, half-extents, and orientation matrix based on geometry volume.
 *
 * ### Example
 * ```typescript
 * const meshOBB = RedGPU.Bound.calculateMeshOBB(mesh);
 * ```
 *
 * @param mesh -
 * [KO] OBB를 계산할 메시 객체
 * [EN] Mesh object to calculate OBB from
 * @returns
 * [KO] 계산된 월드 기준 OBB 인스턴스
 * [EN] Calculated world-space OBB instance
 * @category Bound
 */
declare const calculateMeshOBB: (mesh: Mesh) => OBB;
export default calculateMeshOBB;
