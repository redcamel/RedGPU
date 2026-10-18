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
const calculateMeshCombinedAABB = (mesh: Mesh): AABB => {
    const allAABBs = []
    collectRecursive(mesh, allAABBs);
    if (allAABBs.length === 0) return new AABB(0, 0, 0, 0, 0, 0);
    return calculateCombinedAABBFromAABBs(allAABBs);
};
/**
 * [KO] 대상 메시와 자식 메시들의 AABB를 재귀적으로 수집합니다.
 * [EN] Recursively collects AABBs of the target mesh and its child meshes.
 *
 * @param mesh -
 * [KO] AABB를 수집할 메시 객체
 * [EN] Mesh object to collect AABB from
 * @param aabbs -
 * [KO] 수집된 AABB가 저장될 배열
 * [EN] Array to store collected AABBs
 */
const collectRecursive = (mesh: Mesh, aabbs: AABB[]) => {
    if (mesh._geometry) {
        const aabb = mesh.boundingAABB
        aabbs.push(aabb);
    }
    if (mesh.children) {
        for (let i = 0; i < mesh.children.length; i++) {
            const child = mesh.children[i];
            if (child.isInstanceofMesh) {
                collectRecursive(child, aabbs);
            }
        }
    }
};
/**
 * [KO] 여러 AABB 배열로부터 전체 영역을 포함하는 단일 AABB를 계산합니다.
 * [EN] Calculates a single AABB encompassing all AABBs in the array.
 *
 * @param aabbs -
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