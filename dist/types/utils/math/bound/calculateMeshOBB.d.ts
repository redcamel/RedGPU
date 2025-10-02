import Mesh from "../../../display/mesh/Mesh";
import OBB from "./OBB";
/**
 * 메시의 로컬 AABB를 기반으로 메시의 modelMatrix를 적용한 3차원 Oriented Bounding Box(OBB)를 계산합니다.
 *
 * 메시의 지오메트리 볼륨(AABB) 정보를 가져와 중심점, 반치수, 방향 행렬을 메시의 modelMatrix로 변환하여
 *
 * 월드 기준의 OBB를 반환합니다. 메시 또는 지오메트리가 없거나, 지오메트리 볼륨이 비어 있으면 (0,0,0) 중심/반치수, 단위행렬 OBB를 반환합니다.
 *
 * @category Bound
 * @param {Mesh} mesh OBB를 계산할 메시 객체
 * @returns {OBB} 계산된 월드 기준 OBB 인스턴스
 */
declare const calculateMeshOBB: (mesh: Mesh) => OBB;
export default calculateMeshOBB;
