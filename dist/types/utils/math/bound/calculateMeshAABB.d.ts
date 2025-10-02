import Mesh from "../../../display/mesh/Mesh";
import AABB from "./AABB";
/**
 * 메시의 로컬 AABB를 월드 좌표계로 변환하여 새로운 3차원 Axis-Aligned Bounding Box(AABB)를 계산합니다.
 *
 * 메시의 지오메트리 볼륨(AABB) 정보를 가져와 8개 꼭짓점을 메시의 modelMatrix로 변환한 뒤,
 *
 * 변환된 꼭짓점들의 최소/최대값을 계산하여 월드 기준의 AABB를 반환합니다.
 *
 * 메시 또는 지오메트리가 없거나, 지오메트리 볼륨이 비어 있으면 (0,0,0,0,0,0) AABB를 반환합니다.
 *
 * @category Bound
 * @param {Mesh} mesh AABB를 계산할 메시 객체
 * @returns {AABB} 계산된 월드 기준 AABB 인스턴스
 */
declare const calculateMeshAABB: (mesh: Mesh) => AABB;
export default calculateMeshAABB;
