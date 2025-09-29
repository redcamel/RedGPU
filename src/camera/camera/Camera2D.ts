import {mat4} from "gl-matrix";
import InstanceIdGenerator from "../../utils/InstanceIdGenerator";

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
class Camera2D {
	/** 인스턴스 고유 ID */
	#instanceId: number
	/** 모델 행렬(mat4) */
	#modelMatrix: mat4 = mat4.create()
	/** X 좌표 */
	#x: number = 0
	/** Y 좌표 */
	#y: number = 0
	/** Z 좌표(미사용) */
	#z: number = 0
	/** 카메라 이름 */
	#name: string

	constructor() {
	}

	/** 카메라 이름 반환 */
	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor)
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	/** 카메라 이름 설정 */
	set name(value: string) {
		this.#name = value;
	}

	/** 모델 행렬 반환 */
	get modelMatrix(): mat4 {
		return this.#modelMatrix;
	}

	/** Z 좌표 반환 */
	get z() {
		return this.#z;
	}

	/** X 좌표 반환 */
	get x() {
		return this.#x;
	}

	/** X 좌표 설정 */
	set x(value: number) {
		this.#x = value;
		this.#modelMatrix[12] = value;
	}

	/** Y 좌표 반환 */
	get y() {
		return this.#y;
	}

	/** Y 좌표 설정 */
	set y(value: number) {
		this.#y = value;
		this.#modelMatrix[13] = value;
	}

	/** (x, y) 위치 반환 */
	get position(): [number, number] {
		return [this.#x, this.#y];
	}

	/**
	 * (x, y) 위치를 한 번에 설정합니다.
	 * @param x X 좌표 또는 [x, y, z] 배열
	 * @param y Y 좌표 (x가 배열이 아닐 때만)
	 */
	setPosition(x: number | [number, number, number], y?: number) {
		if (Array.isArray(x)) {
			[this.#x, this.#y] = x;
		} else {
			this.#x = x
			this.#y = y
		}
		[this.#modelMatrix[12], this.#modelMatrix[13], this.#modelMatrix[14]] = [this.#x, this.#y, 0]
	}
}

export default Camera2D
