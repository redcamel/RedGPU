import {mat4} from "gl-matrix";
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
	#instanceId: number
	/** up 벡터 (기본값 [0, 1, 0]) */
	#up = new Float32Array([0, 1, 0]);
	/** 모델 행렬(mat4) */
	#modelMatrix: mat4 = mat4.create()
	/** X 좌표 */
	#x: number = 0
	/** Z 좌표 */
	#z: number = 0
	/** Y 좌표 */
	#y: number = 0
	/** X축 회전(라디안) */
	#rotationX: number = 0
	/** Y축 회전(라디안) */
	#rotationY: number = 0
	/** Z축 회전(라디안) */
	#rotationZ: number = 0
	/** 시야각(FOV, 도) */
	#fieldOfView: number = 60;
	/** 근평면(near) */
	#nearClipping: number = 0.01
	/** 원평면(far) */
	#farClipping: number = 10000;
	/** 카메라 이름 */
	#name: string

	constructor() {
	}

	get rotationX(): number {
		return this.#rotationX;
	}

	set rotationX(value: number) {
		this.#rotationX = value;
	}

	get rotationY(): number {
		return this.#rotationY;
	}

	set rotationY(value: number) {
		this.#rotationY = value;
	}

	get rotationZ(): number {
		return this.#rotationZ;
	}

	set rotationZ(value: number) {
		this.#rotationZ = value;
	}

	get fieldOfView(): number {
		return this.#fieldOfView;
	}

	set fieldOfView(value: number) {
		validateNumber(value)
		this.#fieldOfView = value;
	}

	get nearClipping(): number {
		return this.#nearClipping;
	}

	set nearClipping(value: number) {
		validateNumber(value)
		this.#nearClipping = value;
	}

	get farClipping(): number {
		return this.#farClipping;
	}

	set farClipping(value: number) {
		validateNumber(value)
		this.#farClipping = value;
	}

	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	set name(value: string) {
		this.#name = value;
	}

	get modelMatrix(): mat4 {
		return this.#modelMatrix;
	}

	get x() {
		return this.#x;
	}

	set x(value: number) {
		this.#x = value;
		this.#modelMatrix[12] = value;
	}

	get y() {
		return this.#y;
	}

	set y(value: number) {
		this.#y = value;
		this.#modelMatrix[13] = value;
	}

	get z() {
		return this.#z;
	}

	set z(value: number) {
		this.#z = value;
		this.#modelMatrix[14] = value;
	}

	get position(): [number, number, number] {
		return [this.#x, this.#y, this.#z];
	}

	setPosition(x: number | [number, number, number], y?: number, z?: number) {
		if (Array.isArray(x)) {
			[this.#x, this.#y, this.#z] = x;
		} else {
			this.#x = x
			this.#y = y
			this.#z = z
		}
		[this.#modelMatrix[12], this.#modelMatrix[13], this.#modelMatrix[14]] = [this.#x, this.#y, this.#z]
	}

	lookAt(x: number, y: number, z: number) {
		mat4.lookAt(this.#modelMatrix, [this.#x, this.#y, this.#z], [x, y, z], this.#up);
	}
}

export default PerspectiveCamera
