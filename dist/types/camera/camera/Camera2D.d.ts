import { mat4 } from "gl-matrix";
/**
 * [KO] 2D 환경에서 객체를 관찰하는 카메라입니다.
 * [EN] Camera for observing objects in a 2D environment.
 *
 * [KO] 평면적인 2D 좌표계를 기반으로 위치를 제어하며, UI나 2D 게임 요소의 렌더링에 주로 사용됩니다.
 * [EN] Controls position based on a flat 2D coordinate system, primarily used for rendering UI or 2D game elements.
 *
 * ### Example
 * ```typescript
 * const camera = new RedGPU.Camera2D();
 * camera.x = 100;
 * camera.y = 50;
 * camera.setPosition(200, 100);
 * ```
 * @category Camera
 */
declare class Camera2D {
    #private;
    /**
     * [KO] Camera2D 인스턴스를 생성합니다.
     * [EN] Creates an instance of Camera2D.
     *
     * ### Example
     * ```typescript
     * const camera = new RedGPU.Camera2D();
     * ```
     */
    constructor();
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
     * [KO] Z 좌표를 반환합니다. (미사용)
     * [EN] Returns the Z coordinate. (Unused)
     *
     * @returns
     * [KO] Z 좌표
     * [EN] Z coordinate
     */
    get z(): number;
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
     * [KO] 카메라 위치 (x, y)를 반환합니다.
     * [EN] Returns the camera position (x, y).
     *
     * @returns
     * [KO] [x, y] 좌표 배열
     * [EN] [x, y] coordinate array
     */
    get position(): [number, number];
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
    setPosition(x: number | [number, number, number], y?: number): void;
}
export default Camera2D;
