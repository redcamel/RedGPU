import { mat4 } from "gl-matrix";
/**
 * 원근 투영 카메라(PerspectiveCamera) 클래스입니다.
 * x, y, z 위치, 회전, 시야각, 클리핑, 모델 행렬, 이름 등을 관리합니다.
 * lookAt, setPosition 등 카메라 제어 기능을 제공합니다.
 *
 * @category Camera
 *
 * @example
 * ```javascript
 * const camera = new RedGPU.Camera.PerspectiveCamera();
 * camera.x = 10;
 * camera.y = 5;
 * camera.z = 20;
 * camera.fieldOfView = 75;
 * camera.lookAt(0, 0, 0);
 * ```
 */
declare class PerspectiveCamera {
    #private;
    constructor();
    get rotationX(): number;
    set rotationX(value: number);
    get rotationY(): number;
    set rotationY(value: number);
    get rotationZ(): number;
    set rotationZ(value: number);
    get fieldOfView(): number;
    set fieldOfView(value: number);
    get nearClipping(): number;
    set nearClipping(value: number);
    get farClipping(): number;
    set farClipping(value: number);
    get name(): string;
    set name(value: string);
    get modelMatrix(): mat4;
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get position(): [number, number, number];
    setPosition(x: number | [number, number, number], y?: number, z?: number): void;
    lookAt(x: number, y: number, z: number): void;
}
export default PerspectiveCamera;
