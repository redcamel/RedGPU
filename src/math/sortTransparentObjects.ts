/**
 * [KO] 카메라 거리를 기준으로 투명 객체를 원근 거리 내림차순 정렬합니다.
 * [EN] Sorts transparent objects by distance from camera (descending).
 *
 * ### Example
 * ```typescript
 * const sorted = RedGPU.math.sortTransparentObjects(camera.position, transparentObjects);
 * ```
 *
 * @param cameraPos -
 * [KO] 카메라 위치 {x, y, z}
 * [EN] Camera position {x, y, z}
 * @param objects -
 * [KO] 정렬할 `GPURenderBundle` 배열
 * [EN] Array of `GPURenderBundle` objects
 * @returns
 * [KO] 정렬된 `GPURenderBundle` 배열
 * [EN] Sorted `GPURenderBundle` array
 * @category Math
 */
function sortTransparentObjects(cameraPos: {
    x: number,
    y: number,
    z: number
}, objects: GPURenderBundle[]): GPURenderBundle[] {
    const distanceCache = {};
    const {x: cameraX, y: cameraY, z: cameraZ} = cameraPos;
    return objects.sort((a: any, b: any) => {
        a = a.mesh
        b = b.mesh
        // 거리 계산에 대한 중복을 방지하기 위해서 캐시 활용
        if (!distanceCache[a.uuid]) {
            const diffX = a.x - cameraX;
            const diffY = a.y - cameraY;
            const diffZ = a.z - cameraZ;
            distanceCache[a.uuid] = diffX * diffX + diffY * diffY + diffZ * diffZ;
        }
        if (!distanceCache[b.uuid]) {
            const diffX = b.x - cameraX;
            const diffY = b.y - cameraY;
            const diffZ = b.z - cameraZ;
            distanceCache[b.uuid] = diffX * diffX + diffY * diffY + diffZ * diffZ;
        }
        return distanceCache[b.uuid] - distanceCache[a.uuid];
    });
}

export default sortTransparentObjects;