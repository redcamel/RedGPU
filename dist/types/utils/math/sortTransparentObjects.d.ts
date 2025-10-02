/**
 * 카메라 위치를 기준으로 투명 객체(GPURenderBundle)를 원근 거리 내림차순으로 정렬합니다.
 *
 * 각 객체의 mesh 위치(x, y, z)와 카메라 위치의 거리 제곱을 계산하여,
 *
 * 카메라에서 먼 객체가 먼저 오도록 정렬합니다. 거리 계산은 캐시를 활용해 중복 연산을 방지합니다.
 *
 * @param cameraPos 카메라 위치 객체 {x, y, z}
 * @param objects 정렬할 GPURenderBundle 배열 (각 객체는 .mesh 속성을 가짐)
 * @returns 카메라에서 먼 순서로 정렬된 GPURenderBundle 배열
 */
declare function sortTransparentObjects(cameraPos: {
    x: number;
    y: number;
    z: number;
}, objects: GPURenderBundle[]): GPURenderBundle[];
export default sortTransparentObjects;
