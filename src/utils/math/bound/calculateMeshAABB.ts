import {vec3} from "gl-matrix";
import Mesh from "../../../display/mesh/Mesh";
import AABB from "./AABB";

const tempLocalVertex = vec3.create();
const tempWorldVertex = vec3.create();
/**
 * [KO] 메시의 로컬 AABB를 월드 공간 AABB로 변환하여 계산합니다.
 * [EN] Calculates mesh world-space AABB from its local AABB.
 *
 * [KO] 메시의 지오메트리 볼륨을 modelMatrix로 변환하여 월드 기준 AABB를 반환합니다.
 * [EN] Transforms the geometry volume using modelMatrix and returns a world-space AABB.
 *
 * * ### Example
 * ```typescript
 * const meshAABB = calculateMeshAABB(mesh);
 * ```
 *
 * @param mesh -
 * [KO] AABB를 계산할 메시 객체
 * [EN] Mesh object to calculate AABB from
 * @returns
 * [KO] 계산된 월드 기준 AABB 인스턴스
 * [EN] Calculated world-space AABB instance
 * @category Bound
 */
const calculateMeshAABB = (mesh: Mesh): AABB => {
    // 메시나 지오메트리가 없는 경우
    if (!mesh || !mesh._geometry) {
        // 모델 매트릭스에서 월드 위치 추출
        const m = mesh.modelMatrix;
        const worldX = m[12];
        const worldY = m[13];
        const worldZ = m[14];

        // 점 AABB 반환 (크기가 0인 박스)
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

    return new AABB(worldMinX, worldMaxX, worldMinY, worldMaxY, worldMinZ, worldMaxZ);
};
export default calculateMeshAABB;