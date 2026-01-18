import Mesh from "../../../display/mesh/Mesh";
import AABB from "./AABB";

/**
 * [KO] 주어진 메시와 모든 자식 메시의 AABB를 통합하여 전체를 감싸는 축 정렬 경계 상자(AABB)를 계산합니다.
 * [EN] Calculates a combined Axis-Aligned Bounding Box (AABB) that encompasses the given mesh and all its children.
 *
 * [KO] 메시 계층 구조를 순회하며 모든 메시의 바운딩 볼륨을 통합한 새로운 AABB를 반환합니다.
 * [EN] Traverses the mesh hierarchy and returns a new AABB that combines the bounding volumes of all meshes.
 *
 * * ### Example
 * ```typescript
 * const combinedAABB = calculateMeshCombinedAABB(rootMesh);
 * ```
 *
 * @param mesh
 * [KO] AABB를 계산할 루트 메시 객체
 * [EN] Root mesh object to calculate AABB from
 *
 * @returns
 * [KO] 전체 메시 계층을 감싸는 통합 AABB 인스턴스
 * [EN] Combined AABB instance encompassing the entire mesh hierarchy
 *
 * @category Bound
 */
const calculateMeshCombinedAABB = (mesh: Mesh): AABB => {
    const allAABBs = []
    collectRecursive(mesh, allAABBs);
    if (allAABBs.length === 0) return new AABB(0, 0, 0, 0, 0, 0);
    return calculateCombinedAABBFromAABBs(allAABBs);
};
/**
 * [KO] 재귀적으로 모든 자식 메시의 AABB를 수집하는 헬퍼 함수
 * [EN] Helper function to recursively collect AABBs of all child meshes
 *
 * @param mesh
 * [KO] AABB를 수집할 메시 객체
 * [EN] Mesh object to collect AABB from
 * @param aabbs
 * [KO] 수집된 AABB 배열
 * [EN] Array of collected AABBs
 */
const collectRecursive = (mesh: Mesh, aabbs: AABB[]) => {
    // 지오메트리가 있는 경우에만 AABB 계산 및 추가
    if (mesh._geometry) {
        const aabb = mesh.boundingAABB
        aabbs.push(aabb);
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
 * [KO] 여러 AABB 배열을 통합하여 전체를 감싸는 AABB를 계산합니다.
 * [EN] Calculates an AABB that encompasses multiple AABBs in an array.
 *
 * @param aabbs
 * [KO] 통합할 AABB 배열
 * [EN] Array of AABBs to combine
 * @returns
 * [KO] 통합된 AABB 인스턴스
 * [EN] Combined AABB instance
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