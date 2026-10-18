import Mesh from "../../display/mesh/Mesh";
import AABB from "../AABB";

/**
 * [KO] 메시의 로컬 지오메트리 볼륨에 `modelMatrix`를 적용하여 월드 공간 축 정렬 경계 상자(`AABB`)를 계산합니다.
 * [EN] Calculates the world-space Axis-Aligned Bounding Box (`AABB`) by applying `modelMatrix` to the local geometry volume of a mesh.
 *
 * ### Example
 * ```typescript
 * const meshAABB = RedGPU.Bound.calculateMeshAABB(mesh);
 * ```
 *
 * @param mesh -
 * [KO] 월드 `AABB`를 계산할 대상 `Mesh` 인스턴스
 * [EN] Target `Mesh` instance to calculate the world-space `AABB` from
 * @param targetAABB -
 * [KO] 결과를 제자리(In-place)에 저장할 대상 `AABB` 인스턴스 (생략 시 새 인스턴스 생성)
 * [EN] Target `AABB` instance to store the result in-place (creates a new instance if omitted)
 * @returns
 * [KO] 계산된 월드 공간 `AABB` 인스턴스
 * [EN] Calculated world-space `AABB` instance
 * @category Bound
 */
const calculateMeshAABB = (mesh: Mesh, targetAABB?: AABB): AABB => {
    if (!mesh || !mesh._geometry) {
        if (mesh && mesh.modelMatrix) {
            const m = mesh.modelMatrix;
            const worldX = m[12];
            const worldY = m[13];
            const worldZ = m[14];

            if (targetAABB) {
                return targetAABB.set(worldX, worldX, worldY, worldY, worldZ, worldZ);
            }
            return new AABB(worldX, worldX, worldY, worldY, worldZ, worldZ);
        }
        if (targetAABB) {
            return targetAABB.set(0, 0, 0, 0, 0, 0);
        }
        return new AABB(0, 0, 0, 0, 0, 0);
    }

    const geometryVolume = mesh._geometry.volume;
    const {minX, maxX, minY, maxY, minZ, maxZ} = geometryVolume;

    let worldMinX = Infinity, worldMinY = Infinity, worldMinZ = Infinity;
    let worldMaxX = -Infinity, worldMaxY = -Infinity, worldMaxZ = -Infinity;

    const m = mesh.modelMatrix;
    for (let i = 0; i < 8; i++) {
        const x = (i & 1) ? maxX : minX;
        const y = (i & 2) ? maxY : minY;
        const z = (i & 4) ? maxZ : minZ;

        const wx = m[0] * x + m[4] * y + m[8] * z + m[12];
        const wy = m[1] * x + m[5] * y + m[9] * z + m[13];
        const wz = m[2] * x + m[6] * y + m[10] * z + m[14];

        if (wx < worldMinX) worldMinX = wx;
        if (wy < worldMinY) worldMinY = wy;
        if (wz < worldMinZ) worldMinZ = wz;
        if (wx > worldMaxX) worldMaxX = wx;
        if (wy > worldMaxY) worldMaxY = wy;
        if (wz > worldMaxZ) worldMaxZ = wz;
    }

    if (targetAABB) {
        return targetAABB.set(worldMinX, worldMaxX, worldMinY, worldMaxY, worldMinZ, worldMaxZ);
    }
    return new AABB(worldMinX, worldMaxX, worldMinY, worldMaxY, worldMinZ, worldMaxZ);
};
export default calculateMeshAABB;