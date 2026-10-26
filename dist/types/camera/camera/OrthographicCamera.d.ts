import PerspectiveCamera from "./PerspectiveCamera";
/**
 * [KO] 거리에 따른 원근 왜곡 없이 일정한 크기로 객체를 렌더링하는 직교 투영 카메라 클래스입니다.
 * [EN] Orthographic projection camera class that renders objects at a constant size without distance-based perspective distortion.
 *
 * ### Example
 * ```typescript
 * const camera = new RedGPU.Camera.OrthographicCamera();
 * camera.top = 10;
 * camera.bottom = -10;
 * camera.left = -20;
 * camera.right = 20;
 * ```
 *
 * @see [IsometricController example](/RedGPU/examples/3d/controller/isometricController/)
 * @category Camera
 */
declare class OrthographicCamera extends PerspectiveCamera {
    #private;
    /**
     * [KO] OrthographicCamera 인스턴스를 생성합니다.
     * [EN] Creates an OrthographicCamera instance.
     *
     * ### Example
     * ```typescript
     * const camera = new RedGPU.Camera.OrthographicCamera();
     * ```
     */
    constructor();
    /**
     * [KO] 직교 투영 영역의 상단 경계 값을 가져오거나 설정합니다.
     * [EN] Gets or sets the top boundary value of the orthographic projection volume.
     *
     * @returns
     * [KO] 상단 경계 값 (기본값: `1`)
     * [EN] Top boundary value (default: `1`)
     */
    get top(): number;
    set top(value: number);
    /**
     * [KO] 직교 투영 영역의 하단 경계 값을 가져오거나 설정합니다.
     * [EN] Gets or sets the bottom boundary value of the orthographic projection volume.
     *
     * @returns
     * [KO] 하단 경계 값 (기본값: `-1`)
     * [EN] Bottom boundary value (default: `-1`)
     */
    get bottom(): number;
    set bottom(value: number);
    /**
     * [KO] 직교 투영 영역의 좌측 경계 값을 가져오거나 설정합니다.
     * [EN] Gets or sets the left boundary value of the orthographic projection volume.
     *
     * @returns
     * [KO] 좌측 경계 값 (기본값: `-1`)
     * [EN] Left boundary value (default: `-1`)
     */
    get left(): number;
    set left(value: number);
    /**
     * [KO] 직교 투영 영역의 우측 경계 값을 가져오거나 설정합니다.
     * [EN] Gets or sets the right boundary value of the orthographic projection volume.
     *
     * @returns
     * [KO] 우측 경계 값 (기본값: `1`)
     * [EN] Right boundary value (default: `1`)
     */
    get right(): number;
    set right(value: number);
    /**
     * [KO] 줌 배율을 가져오거나 설정합니다. (`minZoom` ~ `maxZoom`)
     * [EN] Gets or sets the zoom scale. (`minZoom` ~ `maxZoom`)
     *
     * @returns
     * [KO] 줌 배율 (기본값: `1`)
     * [EN] Zoom scale (default: `1`)
     */
    get zoom(): number;
    set zoom(value: number);
    /**
     * [KO] 최소 줌 배율을 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the minimum zoom scale. (`0.01` or greater)
     *
     * @returns
     * [KO] 최소 줌 배율 (기본값: `0.1`)
     * [EN] Minimum zoom scale (default: `0.1`)
     */
    get minZoom(): number;
    set minZoom(value: number);
    /**
     * [KO] 최대 줌 배율을 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the maximum zoom scale. (`0.01` or greater)
     *
     * @returns
     * [KO] 최대 줌 배율 (기본값: `10`)
     * [EN] Maximum zoom scale (default: `10`)
     */
    get maxZoom(): number;
    set maxZoom(value: number);
    /**
     * [KO] 카메라의 줌 배율을 설정합니다.
     * [EN] Sets the camera's zoom scale.
     *
     * ### Example
     * ```typescript
     * camera.setZoom(2.0);
     * ```
     *
     * @param zoom -
     * [KO] 설정할 줌 배율 (`minZoom` ~ `maxZoom`)
     * [EN] Zoom scale to set (`minZoom` ~ `maxZoom`)
     */
    setZoom(zoom: number): void;
}
export default OrthographicCamera;
