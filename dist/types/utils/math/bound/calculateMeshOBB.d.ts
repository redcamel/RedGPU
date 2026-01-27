import Mesh from "../../../display/mesh/Mesh";
import OBB from "./OBB";
/**
 * [KO] 메시의 modelMatrix를 적용한 월드 공간 OBB를 계산합니다.
 * [EN] Calculates world-space OBB by applying mesh modelMatrix.
 *
 * [KO] 지오메트리 볼륨 정보를 기반으로 중심점, 반치수, 방향 행렬이 포함된 OBB를 반환합니다.
 * [EN] Returns an OBB with center, half-extents, and orientation based on geometry volume.
 *
 * * ### Example
 * ```typescript
 * const meshOBB = RedGPU.Util.calculateMeshOBB(mesh);
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
