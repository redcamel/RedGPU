import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
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
 * const camera = new RedGPU.Camera.OrthographicCamera();
 * camera.top = 10;
 * camera.bottom = -10;
 * camera.left = -20;
 * camera.right = 20;
 * ```
 * @category Camera
 */
class OrthographicCamera extends PerspectiveCamera {
    #top: number = 1;
    #bottom: number = -1;
    #left: number = -1;
    #right: number = 1;
    #zoom: number = 1;
    #minZoom: number = 0.1;
    #maxZoom: number = 10;

    /**
     * [KO] OrthographicCamera 인스턴스를 생성합니다.
     * [EN] Creates an instance of OrthographicCamera.
     *
     * ### Example
     * ```typescript
     * const camera = new RedGPU.Camera.OrthographicCamera();
     * ```
     */
    constructor() {
        super();
        this.nearClipping = 0.01;
        this.farClipping = 10000;
    }

    /**
     * [KO] 투영 상단 값을 반환합니다.
     * [EN] Returns the projection top value.
     *
     * @returns
     * [KO] 투영 상단 값
     * [EN] Projection top value
     */
    get top(): number {
        return this.#top;
    }

    set top(value: number) {
        validateNumber(value);
        this.#top = value;
    }

    /**
     * [KO] 투영 하단 값을 반환합니다.
     * [EN] Returns the projection bottom value.
     *
     * @returns
     * [KO] 투영 하단 값
     * [EN] Projection bottom value
     */
    get bottom(): number {
        return this.#bottom;
    }

    set bottom(value: number) {
        validateNumber(value);
        this.#bottom = value;
    }

    /**
     * [KO] 투영 좌측 값을 반환합니다.
     * [EN] Returns the projection left value.
     *
     * @returns
     * [KO] 투영 좌측 값
     * [EN] Projection left value
     */
    get left(): number {
        return this.#left;
    }

    set left(value: number) {
        validateNumber(value);
        this.#left = value;
    }

    /**
     * [KO] 투영 우측 값을 반환합니다.
     * [EN] Returns the projection right value.
     *
     * @returns
     * [KO] 투영 우측 값
     * [EN] Projection right value
     */
    get right(): number {
        return this.#right;
    }

    set right(value: number) {
        validateNumber(value);
        this.#right = value;
    }

    /**
     * [KO] 줌 레벨을 반환합니다.
     * [EN] Returns the zoom level.
     *
     * @returns
     * [KO] 줌 레벨
     * [EN] Zoom level
     */
    get zoom(): number {
        return this.#zoom;
    }

    set zoom(value: number) {
        validateNumberRange(value, this.#minZoom, this.#maxZoom);
        this.#zoom = value;
    }

    /**
     * [KO] 최소 줌 레벨을 반환합니다.
     * [EN] Returns the minimum zoom level.
     *
     * @returns
     * [KO] 최소 줌 레벨
     * [EN] Minimum zoom level
     */
    get minZoom(): number {
        return this.#minZoom;
    }

    set minZoom(value: number) {
        validateNumberRange(value, 0.01);
        this.#minZoom = value;
    }

    /**
     * [KO] 최대 줌 레벨을 반환합니다.
     * [EN] Returns the maximum zoom level.
     *
     * @returns
     * [KO] 최대 줌 레벨
     * [EN] Maximum zoom level
     */
    get maxZoom(): number {
        return this.#maxZoom;
    }

    set maxZoom(value: number) {
        validateNumberRange(value, 0.01);
        this.#maxZoom = value;
    }

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
    setZoom(zoom: number): void {
        this.zoom = zoom;
    }
}

Object.freeze(OrthographicCamera);
export default OrthographicCamera;

