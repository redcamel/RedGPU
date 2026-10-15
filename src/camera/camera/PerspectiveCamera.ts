import {mat4} from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import ACamera from "../core/ACamera";

const TEMP_EYE: [number, number, number] = [0, 0, 0];
const TEMP_TARGET: [number, number, number] = [0, 0, 0];
const TEMP_UP: [number, number, number] = [0, 1, 0];

/**
 * [KO] 원근 투영을 사용하는 카메라입니다.
 * [EN] Camera that uses perspective projection.
 *
 * [KO] 인간의 눈이나 카메라 렌즈와 유사하게 거리에 따라 물체의 크기가 달라지는 원근감을 제공합니다. 3D 환경에서 깊이감 있는 씬을 렌더링할 때 기본적으로 사용됩니다.
 * [EN] Provides perspective where object sizes vary based on distance, similar to the human eye or a camera lens. It is used by default for rendering depth-filled scenes in a 3D environment.
 *
 * ### Example
 * ```typescript
 * const camera = new RedGPU.Camera.PerspectiveCamera();
 * camera.x = 10;
 * camera.y = 5;
 * camera.z = 20;
 * camera.fieldOfView = 75;
 * camera.lookAt(0, 0, 0);
 * ```
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
     * [EN] Creates an instance of PerspectiveCamera.
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
     * [KO] X축 회전값을 반환합니다. (라디안)
     * [EN] Returns the X rotation value. (radians)
     *
     * @returns
     * [KO] X축 회전값
     * [EN] X rotation value
     */
    get rotationX(): number {
        return this.#rotationX;
    }

    set rotationX(value: number) {
        validateNumber(value);
        this.#rotationX = value;
    }

    /**
     * [KO] Y축 회전값을 반환합니다. (라디안)
     * [EN] Returns the Y rotation value. (radians)
     *
     * @returns
     * [KO] Y축 회전값
     * [EN] Y rotation value
     */
    get rotationY(): number {
        return this.#rotationY;
    }

    set rotationY(value: number) {
        validateNumber(value);
        this.#rotationY = value;
    }

    /**
     * [KO] Z축 회전값을 반환합니다. (라디안)
     * [EN] Returns the Z rotation value. (radians)
     *
     * @returns
     * [KO] Z축 회전값
     * [EN] Z rotation value
     */
    get rotationZ(): number {
        return this.#rotationZ;
    }

    set rotationZ(value: number) {
        validateNumber(value);
        this.#rotationZ = value;
    }

    /**
     * [KO] 시야각(FOV)을 반환합니다. (도)
     * [EN] Returns the field of view. (degrees)
     *
     * @returns
     * [KO] 시야각
     * [EN] Field of view
     */
    get fieldOfView(): number {
        return this.#fieldOfView;
    }

    set fieldOfView(value: number) {
        validateNumber(value);
        this.#fieldOfView = value;
    }

    /**
     * [KO] 근평면(near) 거리를 반환합니다.
     * [EN] Returns the near clipping distance.
     *
     * @returns
     * [KO] 근평면 거리
     * [EN] Near clipping distance
     */
    get nearClipping(): number {
        return this.#nearClipping;
    }

    set nearClipping(value: number) {
        validateNumber(value);
        this.#nearClipping = value;
    }

    /**
     * [KO] 원평면(far) 거리를 반환합니다.
     * [EN] Returns the far clipping distance.
     *
     * @returns
     * [KO] 원평면 거리
     * [EN] Far clipping distance
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
     * [KO] 뷰 행렬
     * [EN] View matrix
     */
    get viewMatrix(): mat4 {
        return this.#viewMatrix;
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
     * [KO] Z 좌표를 반환합니다.
     * [EN] Returns the Z coordinate.
     *
     * @returns
     * [KO] Z 좌표
     * [EN] Z coordinate
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
     * [KO] 카메라 위치 (x, y, z)를 반환합니다.
     * [EN] Returns the camera position (x, y, z).
     *
     * @returns
     * [KO] [x, y, z] 좌표 배열
     * [EN] [x, y, z] coordinate array
     */
    get position(): [number, number, number] {
        return [this.#x, this.#y, this.#z];
    }

    /**
     * [KO] 카메라 위치를 설정합니다.
     * [EN] Sets the camera position.
     *
     * ### Example
     * ```typescript
     * camera.setPosition(10, 5, 20);
     * camera.setPosition([10, 5, 20]);
     * ```
     *
     * @param x -
     * [KO] X 좌표 또는 [x, y, z] 배열
     * [EN] X coordinate or [x, y, z] array
     * @param y -
     * [KO] Y 좌표 (x가 배열인 경우 무시됨)
     * [EN] Y coordinate (ignored if x is an array)
     * @param z -
     * [KO] Z 좌표 (x가 배열인 경우 무시됨)
     * [EN] Z coordinate (ignored if x is an array)
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
     * [KO] 카메라가 특정 좌표를 바라보도록 회전시킵니다.
     * [EN] Rotates the camera to look at a specific coordinate.
     *
     * ### Example
     * ```typescript
     * camera.lookAt(0, 0, 0);
     * ```
     *
     * @param x -
     * [KO] 바라볼 대상의 X 좌표
     * [EN] Target X coordinate to look at
     * @param y -
     * [KO] 바라볼 대상의 Y 좌표
     * [EN] Target Y coordinate to look at
     * @param z -
     * [KO] 바라볼 대상의 Z 좌표
     * [EN] Target Z coordinate to look at
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

