import { mat4 } from "gl-matrix";
/**
 * 2D 카메라 클래스입니다.
 * x, y 위치와 모델 행렬을 관리하며, 이름 지정 및 위치 설정 기능을 제공합니다.
 *
 * @category Camera
 *
 * @example
 * ```javascript
 * const camera = new RedGPU.Camera.Camera2D();
 * camera.x = 100;
 * camera.y = 50;
 * camera.setPosition(200, 100);
 * ```
 */
declare class Camera2D {
    #private;
    constructor();
    /** 카메라 이름 반환 */
    get name(): string;
    /** 카메라 이름 설정 */
    set name(value: string);
    /** 모델 행렬 반환 */
    get modelMatrix(): mat4;
    /** Z 좌표 반환 */
    get z(): number;
    /** X 좌표 반환 */
    get x(): number;
    /** X 좌표 설정 */
    set x(value: number);
    /** Y 좌표 반환 */
    get y(): number;
    /** Y 좌표 설정 */
    set y(value: number);
    /** (x, y) 위치 반환 */
    get position(): [number, number];
    /**
     * (x, y) 위치를 한 번에 설정합니다.
     * @param x X 좌표 또는 [x, y, z] 배열
     * @param y Y 좌표 (x가 배열이 아닐 때만)
     */
    setPosition(x: number | [number, number, number], y?: number): void;
}
export default Camera2D;
