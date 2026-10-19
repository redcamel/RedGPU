import {mat4} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import ACamera from "../core/ACamera";

/**
 * [KO] 2D 평면 좌표계를 기반으로 객체를 렌더링하는 카메라 클래스입니다.
 * [EN] Camera class that renders objects based on a 2D planar coordinate system.
 *
 * ### Example
 * ```typescript
 * const camera = new RedGPU.Camera.Camera2D();
 * camera.setPosition(100, 50);
 * ```
 *
 * @see [MultiView with 2D/3D example](/RedGPU/examples/2d/view/multiViewWith3D/)
 * @category Camera
 */
class Camera2D extends ACamera {
    #viewMatrix: mat4 = mat4.create();
    #x: number = 0;
    #y: number = 0;
    #z: number = 0;
    #position: [number, number] = [0, 0];

    /**
     * [KO] Camera2D 인스턴스를 생성합니다.
     * [EN] Creates a Camera2D instance.
     *
     * ### Example
     * ```typescript
     * const camera = new RedGPU.Camera.Camera2D();
     * ```
     */
    constructor() {
        super();
    }

    /**
     * [KO] 뷰 행렬을 반환합니다.
     * [EN] Returns the view matrix.
     *
     * @returns
     * [KO] 뷰 행렬 (`mat4`)
     * [EN] View matrix (`mat4`)
     */
    get viewMatrix(): mat4 {
        return this.#viewMatrix;
    }

    /**
     * [KO] 카메라의 Z축 좌표를 반환합니다. (2D 환경에서는 항상 `0`으로 유지됨)
     * [EN] Returns the camera's Z-axis coordinate. (Always maintained at `0` in a 2D environment)
     *
     * @returns
     * [KO] Z축 좌표 (`0`)
     * [EN] Z-axis coordinate (`0`)
     */
    get z(): number {
        return this.#z;
    }

    /**
     * [KO] 카메라의 X축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's X-axis coordinate.
     *
     * @returns
     * [KO] X축 좌표 (기본값: `0`)
     * [EN] X-axis coordinate (default: `0`)
     */
    get x(): number {
        return this.#x;
    }

    set x(value: number) {
        validateNumber(value);
        this.#x = value;
        this.#viewMatrix[12] = value;
    }

    /**
     * [KO] 카메라의 Y축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's Y-axis coordinate.
     *
     * @returns
     * [KO] Y축 좌표 (기본값: `0`)
     * [EN] Y-axis coordinate (default: `0`)
     */
    get y(): number {
        return this.#y;
    }

    set y(value: number) {
        validateNumber(value);
        this.#y = value;
        this.#viewMatrix[13] = value;
    }

    /**
     * [KO] 카메라의 2D 위치 좌표를 반환합니다.
     * [EN] Returns the camera's 2D position coordinates.
     *
     * @returns
     * [KO] `[x, y]` 좌표 튜플
     * [EN] `[x, y]` coordinate tuple
     */
    get position(): [number, number] {
        this.#position[0] = this.#x;
        this.#position[1] = this.#y;
        return this.#position;
    }

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
    setPosition(x: number | [number, number, number], y?: number): void {
        if (Array.isArray(x)) {
            validateNumber(x[0]);
            validateNumber(x[1]);
            this.#x = x[0];
            this.#y = x[1];
        } else {
            validateNumber(x);
            validateNumber(y);
            this.#x = x;
            this.#y = y;
        }
        this.#viewMatrix[12] = this.#x;
        this.#viewMatrix[13] = this.#y;
        this.#viewMatrix[14] = 0;
    }
}

Object.freeze(Camera2D);
export default Camera2D;
