/**
 * [KO] 카메라 위치로부터의 거리 제곱을 기준으로 투명 렌더링 번들(`GPURenderBundle`) 배열을 내림차순(먼 것부터 가까운 순서) 정렬합니다.
 * [EN] Sorts an array of transparent render bundles (`GPURenderBundle`) in descending order (back-to-front) by squared distance from the camera position.
 *
 * ### Example
 * ```typescript
 * const sortedBundles = RedGPU.Math.sortTransparentObjects(camera, transparentBundles);
 * ```
 *
 * @param cameraPos -
 * [KO] 카메라의 3D 월드 좌표 (`{ x: number, y: number, z: number }`)
 * [EN] 3D world coordinates of the camera (`{ x: number, y: number, z: number }`)
 * @param objects -
 * [KO] 정렬할 `Array<GPURenderBundle>` 배열
 * [EN] `Array<GPURenderBundle>` to sort
 * @returns
 * [KO] 카메라 거리 내림차순으로 정렬된 `Array<GPURenderBundle>` 배열
 * [EN] `Array<GPURenderBundle>` sorted in descending order of camera distance
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