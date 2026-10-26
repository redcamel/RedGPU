import { mat4 } from "gl-matrix";
import ACamera from "../core/ACamera";
/**
 * [KO] 거리에 따른 원근감을 적용하여 3D 씬을 렌더링하는 원근 투영 카메라 클래스입니다.
 * [EN] Perspective projection camera class that renders 3D scenes with distance-based depth perception.
 *
 * ### Example
 * ```typescript
 * const camera = new RedGPU.Camera.PerspectiveCamera();
 * camera.setPosition(10, 5, 20);
 * camera.fieldOfView = 60;
 * camera.lookAt(0, 0, 0);
 * ```
 *
 * @see [SingleView example](/RedGPU/examples/3d/view/singleView/)
 * @category Camera
 */
declare class PerspectiveCamera extends ACamera {
    #private;
    /**
     * [KO] PerspectiveCamera 인스턴스를 생성합니다.
     * [EN] Creates a PerspectiveCamera instance.
     *
     * ### Example
     * ```typescript
     * const camera = new RedGPU.Camera.PerspectiveCamera();
     * ```
     */
    constructor();
    /**
     * [KO] 카메라의 X축 회전 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's X-axis rotation angle. (Unit: degrees)
     *
     * @returns
     * [KO] X축 회전 각도 (기본값: `0`)
     * [EN] X-axis rotation angle (default: `0`)
     */
    get rotationX(): number;
    set rotationX(value: number);
    /**
     * [KO] 카메라의 Y축 회전 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's Y-axis rotation angle. (Unit: degrees)
     *
     * @returns
     * [KO] Y축 회전 각도 (기본값: `0`)
     * [EN] Y-axis rotation angle (default: `0`)
     */
    get rotationY(): number;
    set rotationY(value: number);
    /**
     * [KO] 카메라의 Z축 회전 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's Z-axis rotation angle. (Unit: degrees)
     *
     * @returns
     * [KO] Z축 회전 각도 (기본값: `0`)
     * [EN] Z-axis rotation angle (default: `0`)
     */
    get rotationZ(): number;
    set rotationZ(value: number);
    /**
     * [KO] 수직 시야각(FOV)을 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the vertical field of view (FOV). (Unit: degrees)
     *
     * @returns
     * [KO] 시야각 (기본값: `60`)
     * [EN] Field of view (default: `60`)
     */
    get fieldOfView(): number;
    set fieldOfView(value: number);
    /**
     * [KO] 근평면(Near Clipping Plane) 거리를 가져오거나 설정합니다.
     * [EN] Gets or sets the near clipping plane distance.
     *
     * @returns
     * [KO] 근평면 거리 (기본값: `0.1`)
     * [EN] Near clipping plane distance (default: `0.1`)
     */
    get nearClipping(): number;
    set nearClipping(value: number);
    /**
     * [KO] 원평면(Far Clipping Plane) 거리를 가져오거나 설정합니다.
     * [EN] Gets or sets the far clipping plane distance.
     *
     * @returns
     * [KO] 원평면 거리 (기본값: `50000`)
     * [EN] Far clipping plane distance (default: `50000`)
     */
    get farClipping(): number;
    set farClipping(value: number);
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
     * [KO] 카메라의 Z축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's Z-axis coordinate.
     *
     * @returns
     * [KO] Z축 좌표 (기본값: `0`)
     * [EN] Z-axis coordinate (default: `0`)
     */
    get z(): number;
    set z(value: number);
    /**
     * [KO] 카메라의 3D 위치 좌표를 반환합니다.
     * [EN] Returns the camera's 3D position coordinates.
     *
     * @returns
     * [KO] `[x, y, z]` 좌표 튜플
     * [EN] `[x, y, z]` coordinate tuple
     */
    get position(): [number, number, number];
    /**
     * [KO] 카메라의 3D 위치를 설정합니다.
     * [EN] Sets the camera's 3D position.
     *
     * ### Example
     * ```typescript
     * camera.setPosition(10, 5, 20);
     * camera.setPosition([10, 5, 20]);
     * ```
     *
     * @param x -
     * [KO] X축 좌표 또는 `[x, y, z]` 배열
     * [EN] X-axis coordinate or `[x, y, z]` array
     * @param y -
     * [KO] Y축 좌표 (`x`가 배열인 경우 무시됨)
     * [EN] Y-axis coordinate (ignored if `x` is an array)
     * @param z -
     * [KO] Z축 좌표 (`x`가 배열인 경우 무시됨)
     * [EN] Z-axis coordinate (ignored if `x` is an array)
     */
    setPosition(x: number | [number, number, number], y?: number, z?: number): void;
    /**
     * [KO] 카메라가 지정된 월드 좌표를 바라보도록 뷰 행렬을 갱신합니다.
     * [EN] Updates the view matrix so the camera looks at the specified world coordinates.
     *
     * ### Example
     * ```typescript
     * camera.lookAt(0, 0, 0);
     * ```
     *
     * @param x -
     * [KO] 바라볼 목표 지점의 X축 좌표
     * [EN] Target X-axis coordinate to look at
     * @param y -
     * [KO] 바라볼 목표 지점의 Y축 좌표
     * [EN] Target Y-axis coordinate to look at
     * @param z -
     * [KO] 바라볼 목표 지점의 Z축 좌표
     * [EN] Target Z-axis coordinate to look at
     */
    lookAt(x: number, y: number, z: number): void;
}
export default PerspectiveCamera;
