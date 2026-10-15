import {mat4} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import ACamera from "../core/ACamera";

const TEMP_EYE: [number, number, number] = [0, 0, 0];
const TEMP_TARGET: [number, number, number] = [0, 0, 0];
const TEMP_UP: [number, number, number] = [0, 1, 0];

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
class PerspectiveCamera extends ACamera {
    #up = new Float32Array([0, 1, 0]);
    #viewMatrix: mat4 = mat4.create();
    #x: number = 0;
    #z: number = 0;
    #y: number = 0;
    #rotationX: number = 0;
    #rotationY: number = 0;
    #rotationZ: number = 0;
    #fieldOfView: number = 60;
    #nearClipping: number = 0.1;
    #farClipping: number = 50000;

    /**
     * [KO] PerspectiveCamera 인스턴스를 생성합니다.
     * [EN] Creates a PerspectiveCamera instance.
     *
     * ### Example
     * ```typescript
     * const camera = new RedGPU.Camera.PerspectiveCamera();
     * ```
     */
    constructor() {
        super();
    }

    /**
     * [KO] 카메라의 X축 회전 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's X-axis rotation angle. (Unit: degrees)
     *
     * @returns
     * [KO] X축 회전 각도 (기본값: `0`)
     * [EN] X-axis rotation angle (default: `0`)
     */
    get rotationX(): number {
        return this.#rotationX;
    }

    set rotationX(value: number) {
        validateNumber(value);
        this.#rotationX = value;
    }

    /**
     * [KO] 카메라의 Y축 회전 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's Y-axis rotation angle. (Unit: degrees)
     *
     * @returns
     * [KO] Y축 회전 각도 (기본값: `0`)
     * [EN] Y-axis rotation angle (default: `0`)
     */
    get rotationY(): number {
        return this.#rotationY;
    }

    set rotationY(value: number) {
        validateNumber(value);
        this.#rotationY = value;
    }

    /**
     * [KO] 카메라의 Z축 회전 각도를 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the camera's Z-axis rotation angle. (Unit: degrees)
     *
     * @returns
     * [KO] Z축 회전 각도 (기본값: `0`)
     * [EN] Z-axis rotation angle (default: `0`)
     */
    get rotationZ(): number {
        return this.#rotationZ;
    }

    set rotationZ(value: number) {
        validateNumber(value);
        this.#rotationZ = value;
    }

    /**
     * [KO] 수직 시야각(FOV)을 가져오거나 설정합니다. (단위: 도)
     * [EN] Gets or sets the vertical field of view (FOV). (Unit: degrees)
     *
     * @returns
     * [KO] 시야각 (기본값: `60`)
     * [EN] Field of view (default: `60`)
     */
    get fieldOfView(): number {
        return this.#fieldOfView;
    }

    set fieldOfView(value: number) {
        validateNumber(value);
        this.#fieldOfView = value;
    }

    /**
     * [KO] 근평면(Near Clipping Plane) 거리를 가져오거나 설정합니다.
     * [EN] Gets or sets the near clipping plane distance.
     *
     * @returns
     * [KO] 근평면 거리 (기본값: `0.1`)
     * [EN] Near clipping plane distance (default: `0.1`)
     */
    get nearClipping(): number {
        return this.#nearClipping;
    }

    set nearClipping(value: number) {
        validateNumber(value);
        this.#nearClipping = value;
    }

    /**
     * [KO] 원평면(Far Clipping Plane) 거리를 가져오거나 설정합니다.
     * [EN] Gets or sets the far clipping plane distance.
     *
     * @returns
     * [KO] 원평면 거리 (기본값: `50000`)
     * [EN] Far clipping plane distance (default: `50000`)
     */
    get farClipping(): number {
        return this.#farClipping;
    }

    set farClipping(value: number) {
        validateNumber(value);
        this.#farClipping = value;
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
     * [KO] 카메라의 Z축 좌표를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera's Z-axis coordinate.
     *
     * @returns
     * [KO] Z축 좌표 (기본값: `0`)
     * [EN] Z-axis coordinate (default: `0`)
     */
    get z(): number {
        return this.#z;
    }

    set z(value: number) {
        validateNumber(value);
        this.#z = value;
        this.#viewMatrix[14] = value;
    }

    /**
     * [KO] 카메라의 3D 위치 좌표를 반환합니다.
     * [EN] Returns the camera's 3D position coordinates.
     *
     * @returns
     * [KO] `[x, y, z]` 좌표 튜플
     * [EN] `[x, y, z]` coordinate tuple
     */
    get position(): [number, number, number] {
        return [this.#x, this.#y, this.#z];
    }

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
    setPosition(x: number | [number, number, number], y?: number, z?: number): void {
        if (Array.isArray(x)) {
            validateNumber(x[0]);
            validateNumber(x[1]);
            validateNumber(x[2]);
            this.#x = x[0];
            this.#y = x[1];
            this.#z = x[2];
        } else {
            validateNumber(x);
            validateNumber(y);
            validateNumber(z);
            this.#x = x;
            this.#y = y;
            this.#z = z;
        }
        this.#viewMatrix[12] = this.#x;
        this.#viewMatrix[13] = this.#y;
        this.#viewMatrix[14] = this.#z;
    }

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
    lookAt(x: number, y: number, z: number): void {
        validateNumber(x);
        validateNumber(y);
        validateNumber(z);

        const eyeX = this.#x;
        const eyeY = this.#y;
        const eyeZ = this.#z;

        let dirX = x - eyeX;
        let dirY = y - eyeY;
        let dirZ = z - eyeZ;
        const len = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
        if (len < 1e-6) return;

        const invLen = 1 / len;
        dirX *= invLen;
        dirY *= invLen;
        dirZ *= invLen;

        let upX = this.#up[0];
        let upY = this.#up[1];
        let upZ = this.#up[2];

        const crossX = dirY * upZ - dirZ * upY;
        const crossY = dirZ * upX - dirX * upZ;
        const crossZ = dirX * upY - dirY * upX;
        const crossLen = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);

        if (crossLen < 0.0001) {
            upX = 0;
            upY = 0;
            upZ = dirY > 0 ? 1 : -1;
        }

        TEMP_EYE[0] = eyeX;
        TEMP_EYE[1] = eyeY;
        TEMP_EYE[2] = eyeZ;
        TEMP_TARGET[0] = x;
        TEMP_TARGET[1] = y;
        TEMP_TARGET[2] = z;
        TEMP_UP[0] = upX;
        TEMP_UP[1] = upY;
        TEMP_UP[2] = upZ;

        mat4.lookAt(this.#viewMatrix, TEMP_EYE, TEMP_TARGET, TEMP_UP);
    }
}

Object.freeze(PerspectiveCamera);
export default PerspectiveCamera;
