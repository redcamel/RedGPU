import {mat4} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import ACamera from "../core/ACamera";

/**
 * [KO] 2D 환경에서 객체를 관찰하는 카메라입니다.
 * [EN] Camera for observing objects in a 2D environment.
 *
 * [KO] 평면적인 2D 좌표계를 기반으로 위치를 제어하며, UI나 2D 게임 요소의 렌더링에 주로 사용됩니다.
 * [EN] Controls position based on a flat 2D coordinate system, primarily used for rendering UI or 2D game elements.
 *
 * ### Example
 * ```typescript
 * const camera = new RedGPU.Camera.Camera2D();
 * camera.x = 100;
 * camera.y = 50;
 * camera.setPosition(200, 100);
 * ```
 * @category Camera
 */
class Camera2D extends ACamera {
    #viewMatrix: mat4 = mat4.create();
    #x: number = 0;
    #y: number = 0;
    #z: number = 0;

    /**
     * [KO] Camera2D 인스턴스를 생성합니다.
     * [EN] Creates an instance of Camera2D.
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
     * [KO] 뷰 행렬
     * [EN] View matrix
     */
    get viewMatrix(): mat4 {
        return this.#viewMatrix;
    }

    /**
     * [KO] Z 좌표를 반환합니다. (미사용)
     * [EN] Returns the Z coordinate. (Unused)
     *
     * @returns
     * [KO] Z 좌표
     * [EN] Z coordinate
     */
    get z(): number {
        return this.#z;
    }

    /**
     * [KO] X 좌표를 반환합니다.
     * [EN] Returns the X coordinate.
     *
     * @returns
     * [KO] X 좌표
     * [EN] X coordinate
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
     * [KO] Y 좌표를 반환합니다.
     * [EN] Returns the Y coordinate.
     *
     * @returns
     * [KO] Y 좌표
     * [EN] Y coordinate
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
     * [KO] 카메라 위치 (x, y)를 반환합니다.
     * [EN] Returns the camera position (x, y).
     *
     * @returns
     * [KO] [x, y] 좌표 배열
     * [EN] [x, y] coordinate array
     */
    get position(): [number, number] {
        return [this.#x, this.#y];
    }

    /**
     * [KO] 카메라의 위치를 설정합니다.
     * [EN] Sets the camera position.
     *
     * ### Example
     * ```typescript
     * camera.setPosition(100, 200);
     * camera.setPosition([100, 200, 0]);
     * ```
     *
     * @param x -
     * [KO] X 좌표 또는 [x, y, z] 배열
     * [EN] X coordinate or [x, y, z] array
     * @param y -
     * [KO] Y 좌표 (x가 배열인 경우 무시됨)
     * [EN] Y coordinate (ignored if x is an array)
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

