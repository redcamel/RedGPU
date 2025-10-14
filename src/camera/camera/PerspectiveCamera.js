import { mat4 } from "gl-matrix";
import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
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
class PerspectiveCamera {
    /** 인스턴스 고유 ID */
    #instanceId;
    /** up 벡터 (기본값 [0, 1, 0]) */
    #up = new Float32Array([0, 1, 0]);
    /** 모델 행렬(mat4) */
    #modelMatrix = mat4.create();
    /** X 좌표 */
    #x = 0;
    /** Z 좌표 */
    #z = 0;
    /** Y 좌표 */
    #y = 0;
    /** X축 회전(라디안) */
    #rotationX = 0;
    /** Y축 회전(라디안) */
    #rotationY = 0;
    /** Z축 회전(라디안) */
    #rotationZ = 0;
    /** 시야각(FOV, 도) */
    #fieldOfView = 60;
    /** 근평면(near) */
    #nearClipping = 0.01;
    /** 원평면(far) */
    #farClipping = 10000;
    /** 카메라 이름 */
    #name;
    constructor() {
    }
    get rotationX() {
        return this.#rotationX;
    }
    set rotationX(value) {
        this.#rotationX = value;
    }
    get rotationY() {
        return this.#rotationY;
    }
    set rotationY(value) {
        this.#rotationY = value;
    }
    get rotationZ() {
        return this.#rotationZ;
    }
    set rotationZ(value) {
        this.#rotationZ = value;
    }
    get fieldOfView() {
        return this.#fieldOfView;
    }
    set fieldOfView(value) {
        validateNumber(value);
        this.#fieldOfView = value;
    }
    get nearClipping() {
        return this.#nearClipping;
    }
    set nearClipping(value) {
        validateNumber(value);
        this.#nearClipping = value;
    }
    get farClipping() {
        return this.#farClipping;
    }
    set farClipping(value) {
        validateNumber(value);
        this.#farClipping = value;
    }
    get name() {
        if (!this.#instanceId)
            this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }
    set name(value) {
        this.#name = value;
    }
    get modelMatrix() {
        return this.#modelMatrix;
    }
    get x() {
        return this.#x;
    }
    set x(value) {
        this.#x = value;
        this.#modelMatrix[12] = value;
    }
    get y() {
        return this.#y;
    }
    set y(value) {
        this.#y = value;
        this.#modelMatrix[13] = value;
    }
    get z() {
        return this.#z;
    }
    set z(value) {
        this.#z = value;
        this.#modelMatrix[14] = value;
    }
    get position() {
        return [this.#x, this.#y, this.#z];
    }
    setPosition(x, y, z) {
        if (Array.isArray(x)) {
            [this.#x, this.#y, this.#z] = x;
        }
        else {
            this.#x = x;
            this.#y = y;
            this.#z = z;
        }
        [this.#modelMatrix[12], this.#modelMatrix[13], this.#modelMatrix[14]] = [this.#x, this.#y, this.#z];
    }
    lookAt(x, y, z) {
        mat4.lookAt(this.#modelMatrix, [this.#x, this.#y, this.#z], [x, y, z], this.#up);
    }
}
export default PerspectiveCamera;
