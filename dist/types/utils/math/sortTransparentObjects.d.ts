/**
 * [KO] 카메라 거리를 기준으로 투명 객체를 원근 거리 내림차순 정렬합니다.
 * [EN] Sorts transparent objects by distance from camera (descending).
 *
 * * ### Example
 * ```typescript
 * const sorted = RedGPU.Util.sortTransparentObjects(camera.position, transparentObjects);
 * ```
 *
 * @param cameraPos -
 * [KO] 카메라 위치 {x, y, z}
 * [EN] Camera position {x, y, z}
 * @param objects -
 * [KO] 정렬할 GPURenderBundle 배열
 * [EN] Array of GPURenderBundle objects
 * @returns
 * [KO] 정렬된 GPURenderBundle 배열
 * [EN] Sorted GPURenderBundle array
 * @category Math
 */
declare function sortTransparentObjects(cameraPos: {
    x: number;
    y: number;
    z: number;
}, objects: GPURenderBundle[]): GPURenderBundle[];
export default sortTransparentObjects;
