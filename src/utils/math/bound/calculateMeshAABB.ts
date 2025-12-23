import {vec3} from "gl-matrix";
import Mesh from "../../../display/mesh/Mesh";
import AABB from "./AABB";

const tempLocalVertex = vec3.create();
const tempWorldVertex = vec3.create();
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
const calculateMeshAABB = (mesh: Mesh): AABB => {
    // 메시나 지오메트리가 없는 경우
    if (!mesh || !mesh._geometry) {
        // 모델 매트릭스에서 월드 위치 추출
        const m = mesh.modelMatrix;
        const worldX = m[12];
        const worldY = m[13];
        const worldZ = m[14];

        // 점 AABB 반환 (크기가 0인 박스)
        return new AABB(worldX, worldX, worldY, worldY, worldZ, worldZ);
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
