import Mesh from "../../display/mesh/Mesh";
import AABB from "../AABB";
/**
 * [KO] 메시의 로컬 AABB를 월드 공간 AABB로 변환하여 계산합니다. (Zero-GC 지원)
 * [EN] Calculates mesh world-space AABB from its local AABB. (Zero-GC support)
 *
 * [KO] 메시의 지오메트리 볼륨을 modelMatrix로 변환하여 월드 기준 AABB를 반환합니다.
 * [EN] Transforms the geometry volume using modelMatrix and returns a world-space AABB.
 *
 * * ### Example
 * ```typescript
 * const meshAABB = RedGPU.Bound.calculateMeshAABB(mesh);
 * ```
 *
 * @param mesh -
 * [KO] AABB를 계산할 메시 객체
 * [EN] Mesh object to calculate AABB from
 * @param targetAABB -
 * [KO] 결과를 인플레이스로 저장할 대상 AABB 인스턴스 (선택, 미지정 시 신규 생성)
 * [EN] Target AABB instance to store the result in-place (optional, creates new if omitted)
 * @returns
 * [KO] 계산된 월드 기준 AABB 인스턴스
 * [EN] Calculated world-space AABB instance
 * @category Bound
 */
declare const calculateMeshAABB: (mesh: Mesh, targetAABB?: AABB) => AABB;
export default calculateMeshAABB;
