import { mat4 } from "gl-matrix";
/**
 * [KO] 원근 투영을 사용하는 카메라입니다.
 * [EN] Camera that uses perspective projection.
 *
 * [KO] 인간의 눈이나 카메라 렌즈와 유사하게 거리에 따라 물체의 크기가 달라지는 원근감을 제공합니다. 3D 환경에서 깊이감 있는 씬을 렌더링할 때 기본적으로 사용됩니다.
 * [EN] Provides perspective where object sizes vary based on distance, similar to the human eye or a camera lens. It is used by default for rendering depth-filled scenes in a 3D environment.
 *
 * * ### Example
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
declare class PerspectiveCamera {
    #private;
    /**
     * [KO] PerspectiveCamera 인스턴스를 생성합니다.
     * [EN] Creates an instance of PerspectiveCamera.
     */
    constructor();
    /**
     * [KO] X축 회전값을 반환합니다. (라디안)
     * [EN] Returns the X rotation value. (radians)
     *
     * @returns
     * [KO] X축 회전값
     * [EN] X rotation value
     */
    get rotationX(): number;
    /**
     * [KO] X축 회전값을 설정합니다. (라디안)
     * [EN] Sets the X rotation value. (radians)
     *
     * @param value -
     * [KO] 설정할 회전값
     * [EN] Rotation value to set
     */
    set rotationX(value: number);
    /**
     * [KO] Y축 회전값을 반환합니다. (라디안)
     * [EN] Returns the Y rotation value. (radians)
     *
     * @returns
     * [KO] Y축 회전값
     * [EN] Y rotation value
     */
    get rotationY(): number;
    /**
     * [KO] Y축 회전값을 설정합니다. (라디안)
     * [EN] Sets the Y rotation value. (radians)
     *
     * @param value -
     * [KO] 설정할 회전값
     * [EN] Rotation value to set
     */
    set rotationY(value: number);
    /**
     * [KO] Z축 회전값을 반환합니다. (라디안)
     * [EN] Returns the Z rotation value. (radians)
     *
     * @returns
     * [KO] Z축 회전값
     * [EN] Z rotation value
     */
    get rotationZ(): number;
    /**
     * [KO] Z축 회전값을 설정합니다. (라디안)
     * [EN] Sets the Z rotation value. (radians)
     *
     * @param value -
     * [KO] 설정할 회전값
     * [EN] Rotation value to set
     */
    set rotationZ(value: number);
    /**
     * [KO] 시야각(FOV)을 반환합니다. (도)
     * [EN] Returns the field of view. (degrees)
     *
     * @returns
     * [KO] 시야각
     * [EN] Field of view
     */
    get fieldOfView(): number;
    /**
     * [KO] 시야각(FOV)을 설정합니다. (도)
     * [EN] Sets the field of view. (degrees)
     *
     * @param value -
     * [KO] 설정할 시야각
     * [EN] Field of view to set
     */
    set fieldOfView(value: number);
    /**
     * [KO] 근평면(near) 거리를 반환합니다.
     * [EN] Returns the near clipping distance.
     *
     * @returns
     * [KO] 근평면 거리
     * [EN] Near clipping distance
     */
    get nearClipping(): number;
    /**
     * [KO] 근평면(near) 거리를 설정합니다.
     * [EN] Sets the near clipping distance.
     *
     * @param value -
     * [KO] 설정할 근평면 거리
     * [EN] Near clipping distance to set
     */
    set nearClipping(value: number);
    /**
     * [KO] 원평면(far) 거리를 반환합니다.
     * [EN] Returns the far clipping distance.
     *
     * @returns
     * [KO] 원평면 거리
     * [EN] Far clipping distance
     */
    get farClipping(): number;
    /**
     * [KO] 원평면(far) 거리를 설정합니다.
     * [EN] Sets the far clipping distance.
     *
     * @param value -
     * [KO] 설정할 원평면 거리
     * [EN] Far clipping distance to set
     */
    set farClipping(value: number);
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
     * [KO] 모델 행렬을 반환합니다.
     * [EN] Returns the model matrix.
     *
     * @returns
     * [KO] 모델 행렬
     * [EN] Model matrix
     */
    get modelMatrix(): mat4;
    /**
     * [KO] X 좌표를 반환합니다.
     * [EN] Returns the X coordinate.
     *
     * @returns
     * [KO] X 좌표
     * [EN] X coordinate
     */
    get x(): number;
    /**
     * [KO] X 좌표를 설정합니다.
     * [EN] Sets the X coordinate.
     *
     * @param value -
     * [KO] 설정할 X 좌표
     * [EN] X coordinate to set
     */
    set x(value: number);
    /**
     * [KO] Y 좌표를 반환합니다.
     * [EN] Returns the Y coordinate.
     *
     * @returns
     * [KO] Y 좌표
     * [EN] Y coordinate
     */
    get y(): number;
    /**
     * [KO] Y 좌표를 설정합니다.
     * [EN] Sets the Y coordinate.
     *
     * @param value -
     * [KO] 설정할 Y 좌표
     * [EN] Y coordinate to set
     */
    set y(value: number);
    /**
     * [KO] Z 좌표를 반환합니다.
     * [EN] Returns the Z coordinate.
     *
     * @returns
     * [KO] Z 좌표
     * [EN] Z coordinate
     */
    get z(): number;
    /**
     * [KO] Z 좌표를 설정합니다.
     * [EN] Sets the Z coordinate.
     *
     * @param value -
     * [KO] 설정할 Z 좌표
     * [EN] Z coordinate to set
     */
    set z(value: number);
    /**
     * [KO] 카메라 위치 (x, y, z)를 반환합니다.
     * [EN] Returns the camera position (x, y, z).
     *
     * @returns
     * [KO] [x, y, z] 좌표 배열
     * [EN] [x, y, z] coordinate array
     */
    get position(): [number, number, number];
    /**
     * [KO] 카메라 위치를 설정합니다.
     * [EN] Sets the camera position.
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
    setPosition(x: number | [number, number, number], y?: number, z?: number): void;
    /**
     * [KO] 카메라가 특정 좌표를 바라보도록 회전시킵니다.
     * [EN] Rotates the camera to look at a specific coordinate.
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
    lookAt(x: number, y: number, z: number): void;
}
export default PerspectiveCamera;
