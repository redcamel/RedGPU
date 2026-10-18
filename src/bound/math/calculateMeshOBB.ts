import {mat4, vec3} from "gl-matrix";
import Mesh from "../../display/mesh/Mesh";
import OBB from "../OBB";

/**
 * [KO] 메시의 `modelMatrix`를 적용하여 월드 공간 기준 OBB를 계산합니다.
 * [EN] Calculates the world-space OBB by applying the mesh's `modelMatrix`.
 *
 * [KO] 지오메트리 볼륨 정보를 기반으로 변환된 중심점, 반치수, 방향 행렬을 포함하는 OBB를 반환합니다.
 * [EN] Returns an OBB containing the transformed center, half-extents, and orientation matrix based on geometry volume.
 *
 * ### Example
 * ```typescript
 * const meshOBB = RedGPU.Bound.calculateMeshOBB(mesh);
 * ```
 *
 * @param mesh -
 * [KO] OBB를 계산할 메시 객체
 * [EN] Mesh object to calculate OBB from
 * @returns
 * [KO] 계산된 월드 기준 OBB 인스턴스
 * [EN] Calculated world-space OBB instance
 * @category Bound
 */
const calculateMeshOBB = (mesh: Mesh): OBB => {
    if (!mesh || !mesh._geometry) {
        const identityMatrix = mat4.create();
        if (mesh && mesh.modelMatrix) {
            const m = mesh.modelMatrix;
            return new OBB([m[12], m[13], m[14]], [0, 0, 0], identityMatrix);
        }
        return new OBB([0, 0, 0], [0, 0, 0], identityMatrix);
    }
    const geometryVolume = mesh._geometry.volume;
    if (geometryVolume.minX === 0 && geometryVolume.maxX === 0 &&
        geometryVolume.minY === 0 && geometryVolume.maxY === 0 &&
        geometryVolume.minZ === 0 && geometryVolume.maxZ === 0) {
        const identityMatrix = mat4.create();
        return new OBB([0, 0, 0], [0, 0, 0], identityMatrix);
    }
    const originalCenter = [
        geometryVolume.centerX,
        geometryVolume.centerY,
        geometryVolume.centerZ
    ] as [number, number, number];
    const originalHalfExtents = [
        (geometryVolume.maxX - geometryVolume.minX) / 2,
        (geometryVolume.maxY - geometryVolume.minY) / 2,
        (geometryVolume.maxZ - geometryVolume.minZ) / 2
    ] as [number, number, number];
    const transformedCenter = vec3.create();
    vec3.transformMat4(transformedCenter, originalCenter as vec3, mesh.modelMatrix);
    const rotationScaleMatrix = mat4.create();
    mat4.copy(rotationScaleMatrix, mesh.modelMatrix);
    rotationScaleMatrix[12] = 0;
    rotationScaleMatrix[13] = 0;
    rotationScaleMatrix[14] = 0;
    const axes = [
        vec3.create(),
        vec3.create(),
        vec3.create()
    ];
    const transformedHalfExtents = [0, 0, 0] as [number, number, number];
    for (let i = 0; i < 3; i++) {
        const originalAxis = [0, 0, 0];
        originalAxis[i] = originalHalfExtents[i];
        vec3.transformMat4(axes[i], originalAxis as vec3, rotationScaleMatrix);
        transformedHalfExtents[i] = vec3.length(axes[i]);
        vec3.normalize(axes[i], axes[i]);
    }
    const orientationMatrix = mat4.create();
    orientationMatrix[0] = axes[0][0];
    orientationMatrix[1] = axes[0][1];
    orientationMatrix[2] = axes[0][2];
    orientationMatrix[3] = 0;
    orientationMatrix[4] = axes[1][0];
    orientationMatrix[5] = axes[1][1];
    orientationMatrix[6] = axes[1][2];
    orientationMatrix[7] = 0;
    orientationMatrix[8] = axes[2][0];
    orientationMatrix[9] = axes[2][1];
    orientationMatrix[10] = axes[2][2];
    orientationMatrix[11] = 0;
    orientationMatrix[12] = 0;
    orientationMatrix[13] = 0;
    orientationMatrix[14] = 0;
    orientationMatrix[15] = 1;
    return new OBB([transformedCenter[0], transformedCenter[1], transformedCenter[2]], transformedHalfExtents, orientationMatrix);
}
export default calculateMeshOBB;