import PerspectiveCamera from "./PerspectiveCamera";
/**
 * 직교 투영 카메라(OrthographicCamera) 클래스입니다.
 * 투영 범위(top, bottom, left, right)와 이름을 관리합니다.
 * PerspectiveCamera를 상속하며, near/far 클리핑 기본값을 재정의합니다.
 *
 * @category Camera
 *
 * @example
 * ```javascript
 * const camera = new RedGPU.Camera.OrthographicCamera();
 * camera.top = 10;
 * camera.bottom = -10;
 * camera.left = -20;
 * camera.right = 20;
 * camera.name = '2D 카메라';
 * ```
 */
declare class OrthographicCamera extends PerspectiveCamera {
    #private;
    constructor();
    /** 투영 상단 반환 */
    get top(): number;
    /** 투영 상단 설정 */
    set top(value: number);
    /** 투영 하단 반환 */
    get bottom(): number;
    /** 투영 하단 설정 */
    set bottom(value: number);
    /** 투영 좌측 반환 */
    get left(): number;
    /** 투영 좌측 설정 */
    set left(value: number);
    /** 투영 우측 반환 */
    get right(): number;
    /** 투영 우측 설정 */
    set right(value: number);
    /** 줌 레벨 반환 */
    get zoom(): number;
    /** 줌 레벨 설정 */
    set zoom(value: number);
    /** 최소 줌 반환 */
    get minZoom(): number;
    /** 최소 줌 설정 */
    set minZoom(value: number);
    /** 최대 줌 반환 */
    get maxZoom(): number;
    /** 최대 줌 설정 */
    set maxZoom(value: number);
    /** 카메라 이름 반환 */
    get name(): string;
    /** 카메라 이름 설정 */
    set name(value: string);
    /**
     * 줌을 설정합니다
     * @param zoom - 줌 레벨 (0.1 ~ 10)
     */
    setZoom(zoom: number): void;
}
export default OrthographicCamera;
