import Mesh from "../../../display/mesh/Mesh";
import AABB from "./AABB";
/**
 * 주어진 메시와 모든 자식 메시의 AABB를 통합하여 전체를 감싸는 3차원 Axis-Aligned Bounding Box(AABB)를 계산합니다.
 *
 * 메시 계층 구조 내 모든 메시의 boundingAABB를 재귀적으로 수집하여,
 * 전체를 감싸는 최소/최대값을 계산한 새로운 AABB를 반환합니다.
 *
 * 메시 또는 자식 메시가 없거나, 유효한 AABB가 하나도 없으면 (0,0,0,0,0,0) AABB를 반환합니다.
 *
 * @category Bound
 * @param {Mesh} mesh AABB를 계산할 루트 메시 객체
 * @returns {AABB} 전체 메시 계층을 감싸는 통합 AABB 인스턴스
 */
declare const calculateMeshCombinedAABB: (mesh: Mesh) => AABB;
export default calculateMeshCombinedAABB;
