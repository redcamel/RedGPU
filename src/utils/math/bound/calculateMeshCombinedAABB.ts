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
const calculateMeshCombinedAABB = (mesh: Mesh): AABB => {
    const allAABBs = []
    collectRecursive(mesh, allAABBs);
    if (allAABBs.length === 0) return new AABB(0, 0, 0, 0, 0, 0);
    return calculateCombinedAABBFromAABBs(allAABBs);
};
/**
 * 재귀적으로 모든 자식 메시의 AABB를 수집하는 헬퍼 함수
 *
 * @param {Mesh} mesh AABB를 수집할 메시 객체
 * @param {AABB[]} aabbs 수집된 AABB 배열
 */
const collectRecursive = (mesh: Mesh, aabbs: AABB[]) => {
    // 지오메트리가 있는 경우에만 AABB 계산 및 추가
    if (mesh._geometry) {
        const aabb = mesh.boundingAABB
        // 빈 AABB인지 확인 (모든 값이 0인 경우는 제외)
        if (!(aabb.minX === 0 && aabb.maxX === 0 && aabb.minY === 0 &&
            aabb.maxY === 0 && aabb.minZ === 0 && aabb.maxZ === 0)) {
            aabbs.push(aabb);
        }
    }
    // 지오메트리가 없어도 자식들은 처리해야 함
    if (mesh.children) {
        for (let i = 0; i < mesh.children.length; i++) {
            const child = mesh.children[i];
            if (child instanceof Mesh) {
                collectRecursive(child, aabbs);
            }
        }
    }
};
/**
 * 여러 AABB 배열을 통합하여 전체를 감싸는 AABB를 계산합니다.
 *
 * @param {AABB[]} aabbs 통합할 AABB 배열
 * @returns {AABB} 통합된 AABB 인스턴스
 */
const calculateCombinedAABBFromAABBs = (aabbs: AABB[]): AABB => {
    if (aabbs.length === 0) return new AABB(0, 0, 0, 0, 0, 0);
    if (aabbs.length === 1) return aabbs[0];
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let i = 0; i < aabbs.length; i++) {
        const aabb = aabbs[i];
        if (aabb.minX < minX) minX = aabb.minX;
        if (aabb.minY < minY) minY = aabb.minY;
        if (aabb.minZ < minZ) minZ = aabb.minZ;
        if (aabb.maxX > maxX) maxX = aabb.maxX;
        if (aabb.maxY > maxY) maxY = aabb.maxY;
        if (aabb.maxZ > maxZ) maxZ = aabb.maxZ;
    }
    return new AABB(minX, maxX, minY, maxY, minZ, maxZ);
};
export default calculateMeshCombinedAABB;
