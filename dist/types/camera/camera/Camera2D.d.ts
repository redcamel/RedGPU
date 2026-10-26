import { mat4 } from "gl-matrix";
import ACamera from "../core/ACamera";
/**
 * [KO] 2D 평면 좌표계를 기반으로 객체를 렌더링하는 카메라 클래스입니다. `View2D` 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Camera class that renders objects based on a 2D planar coordinate system. Automatically created internally when `View2D` is instantiated.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const view = new RedGPU.Display.View2D(redGPUContext, scene);
 * const camera = view.camera;
 * camera.setPosition(100, 50);
 * ```
 *
 * @see [MultiView with 2D/3D example](/RedGPU/examples/2d/view/multiViewWith3D/)
 * @category Camera
 */
declare class Camera2D extends ACamera {
    #private;
    /**
     * [KO] Camera2D 인스턴스를 생성합니다.
     * [EN] Creates a Camera2D instance.
     */
    constructor();
    /**
     * [KO] 뷰 행렬을 반환합니다.
     * [EN] Returns the view matrix.
     *
     * @returns
     * [KO] 뷰 행렬 (`mat4`)
     * [EN] View matrix (`mat4`)
     */
    get viewMatrix(): mat4;
    /**
     * [KO] 카메라의 Z축 좌표를 반환합니다. (2D 환경에서는 항상 `0`으로 유지됨)
     * [EN] Returns the camera's Z-axis coordinate. (Always maintained at `0` in a 2D environment)
     *
     * @returns
     * [KO] Z축 좌표 (`0`)
     * [EN] Z-axis coordinate (`0`)
     */
    get z(): number;
    /**
     * [KO] 카메라의 X축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's X-axis coordinate.
     *
     * @returns
     * [KO] X축 좌표 (기본값: `0`)
     * [EN] X-axis coordinate (default: `0`)
     */
    get x(): number;
    set x(value: number);
    /**
     * [KO] 카메라의 Y축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's Y-axis coordinate.
     *
     * @returns
     * [KO] Y축 좌표 (기본값: `0`)
     * [EN] Y-axis coordinate (default: `0`)
     */
    get y(): number;
    set y(value: number);
    /**
     * [KO] 카메라의 2D 위치 좌표를 반환합니다.
     * [EN] Returns the camera's 2D position coordinates.
     *
     * @returns
     * [KO] `[x, y]` 좌표 튜플
     * [EN] `[x, y]` coordinate tuple
     */
    get position(): [number, number];
    /**
     * [KO] 카메라의 2D 위치를 설정합니다.
     * [EN] Sets the camera's 2D position.
     *
     * ### Example
     * ```typescript
     * camera.setPosition(100, 200);
     * camera.setPosition([100, 200, 0]);
     * ```
     *
     * @param x -
     * [KO] X축 좌표 또는 `[x, y, z]` 배열
     * [EN] X-axis coordinate or `[x, y, z]` array
     * @param y -
     * [KO] Y축 좌표 (`x`가 배열인 경우 무시됨)
     * [EN] Y-axis coordinate (ignored if `x` is an array)
     */
    setPosition(x: number | [number, number, number], y?: number): void;
}
export default Camera2D;
