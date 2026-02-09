import PerspectiveCamera from "./PerspectiveCamera";
/**
 * [KO] 직교 투영을 사용하는 카메라입니다.
 * [EN] Camera that uses orthographic projection.
 *
 * [KO] 이 투영 모드에서는 객체의 크기가 카메라로부터의 거리에 관계없이 일정하게 유지됩니다. 주로 2D 뷰포트나 설계도면 같은 정투영 뷰를 구현할 때 사용됩니다.
 * [EN] In this projection mode, an object's size stays constant regardless of its distance from the camera. It is primarily used for implementing orthographic views such as 2D viewports or blueprints.
 *
 * ### Example
 * ```typescript
 * const camera = new RedGPU.OrthographicCamera();
 * camera.top = 10;
 * camera.bottom = -10;
 * camera.left = -20;
 * camera.right = 20;
 * ```
 * @category Camera
 */
declare class OrthographicCamera extends PerspectiveCamera {
    #private;
    /**
     * [KO] OrthographicCamera 인스턴스를 생성합니다.
     * [EN] Creates an instance of OrthographicCamera.
     *
     * ### Example
     * ```typescript
     * const camera = new RedGPU.OrthographicCamera();
     * ```
     */
    constructor();
    /**
     * [KO] 투영 상단 값을 반환합니다.
     * [EN] Returns the projection top value.
     *
     * @returns
     * [KO] 투영 상단 값
     * [EN] Projection top value
     */
    get top(): number;
    /**
     * [KO] 투영 상단 값을 설정합니다.
     * [EN] Sets the projection top value.
     *
     * @param value -
     * [KO] 설정할 상단 값
     * [EN] Top value to set
     */
    set top(value: number);
    /**
     * [KO] 투영 하단 값을 반환합니다.
     * [EN] Returns the projection bottom value.
     *
     * @returns
     * [KO] 투영 하단 값
     * [EN] Projection bottom value
     */
    get bottom(): number;
    /**
     * [KO] 투영 하단 값을 설정합니다.
     * [EN] Sets the projection bottom value.
     *
     * @param value -
     * [KO] 설정할 하단 값
     * [EN] Bottom value to set
     */
    set bottom(value: number);
    /**
     * [KO] 투영 좌측 값을 반환합니다.
     * [EN] Returns the projection left value.
     *
     * @returns
     * [KO] 투영 좌측 값
     * [EN] Projection left value
     */
    get left(): number;
    /**
     * [KO] 투영 좌측 값을 설정합니다.
     * [EN] Sets the projection left value.
     *
     * @param value -
     * [KO] 설정할 좌측 값
     * [EN] Left value to set
     */
    set left(value: number);
    /**
     * [KO] 투영 우측 값을 반환합니다.
     * [EN] Returns the projection right value.
     *
     * @returns
     * [KO] 투영 우측 값
     * [EN] Projection right value
     */
    get right(): number;
    /**
     * [KO] 투영 우측 값을 설정합니다.
     * [EN] Sets the projection right value.
     *
     * @param value -
     * [KO] 설정할 우측 값
     * [EN] Right value to set
     */
    set right(value: number);
    /**
     * [KO] 줌 레벨을 반환합니다.
     * [EN] Returns the zoom level.
     *
     * @returns
     * [KO] 줌 레벨
     * [EN] Zoom level
     */
    get zoom(): number;
    /**
     * [KO] 줌 레벨을 설정합니다.
     * [EN] Sets the zoom level.
     *
     * @param value -
     * [KO] 설정할 줌 레벨 (minZoom ~ maxZoom)
     * [EN] Zoom level to set (minZoom ~ maxZoom)
     */
    set zoom(value: number);
    /**
     * [KO] 최소 줌 레벨을 반환합니다.
     * [EN] Returns the minimum zoom level.
     *
     * @returns
     * [KO] 최소 줌 레벨
     * [EN] Minimum zoom level
     */
    get minZoom(): number;
    /**
     * [KO] 최소 줌 레벨을 설정합니다.
     * [EN] Sets the minimum zoom level.
     *
     * @param value -
     * [KO] 설정할 최소 줌 (0.01 이상)
     * [EN] Minimum zoom to set (min 0.01)
     */
    set minZoom(value: number);
    /**
     * [KO] 최대 줌 레벨을 반환합니다.
     * [EN] Returns the maximum zoom level.
     *
     * @returns
     * [KO] 최대 줌 레벨
     * [EN] Maximum zoom level
     */
    get maxZoom(): number;
    /**
     * [KO] 최대 줌 레벨을 설정합니다.
     * [EN] Sets the maximum zoom level.
     *
     * @param value -
     * [KO] 설정할 최대 줌 (0.01 이상)
     * [EN] Maximum zoom to set (min 0.01)
     */
    set maxZoom(value: number);
    /**
     * [KO] 카메라 이름을 반환합니다.
     * [EN] Returns the camera name.
     *
     * @returns
     * [KO] 카메라 이름
     * [EN] Camera name
     */
    get name(): string;
    /**
     * [KO] 카메라 이름을 설정합니다.
     * [EN] Sets the camera name.
     *
     * @param value -
     * [KO] 설정할 이름
     * [EN] Name to set
     */
    set name(value: string);
    /**
     * [KO] 줌을 설정합니다.
     * [EN] Sets the zoom level.
     *
     * ### Example
     * ```typescript
     * camera.setZoom(2.0);
     * ```
     *
     * @param zoom -
     * [KO] 줌 레벨 (0.1 ~ 10)
     * [EN] Zoom level (0.1 ~ 10)
     */
    setZoom(zoom: number): void;
}
export default OrthographicCamera;
