import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import PerspectiveCamera from "./PerspectiveCamera";

/**
 * 직교 투영 카메라(OrthographicCamera) 클래스입니다.
 * 투영 범위(top, bottom, left, right)와 이름을 관리합니다.
 * PerspectiveCamera를 상속하며, near/far 클리핑 기본값을 재정의합니다.
 *
 * @category Camera
 *
 * @example
 * ```javascript
 * const camera = new RedGPU.Camera.OrthographicCamera();
 * camera.top = 10;
 * camera.bottom = -10;
 * camera.left = -20;
 * camera.right = 20;
 * camera.name = '2D 카메라';
 * ```
 */
class OrthographicCamera extends PerspectiveCamera {
	/** 인스턴스 고유 ID */
	#instanceId: number
	/** 카메라 이름 */
	#name: string
	/** 투영 상단 */
	#top: number = 1
	/** 투영 하단 */
	#bottom: number = -1
	/** 투영 좌측 */
	#left: number = -1
	/** 투영 우측 */
	#right: number = 1

	constructor() {
		super()
		this.nearClipping = 0.01
		this.farClipping = 2000
	}

	/** 투영 상단 반환 */
	get top(): number {
		return this.#top;
	}

	/** 투영 상단 설정 */
	set top(value: number) {
		validateNumber(value)
		this.#top = value;
	}

	/** 투영 하단 반환 */
	get bottom(): number {
		return this.#bottom;
	}

	/** 투영 하단 설정 */
	set bottom(value: number) {
		validateNumber(value)
		this.#bottom = value;
	}

	/** 투영 좌측 반환 */
	get left(): number {
		return this.#left;
	}

	/** 투영 좌측 설정 */
	set left(value: number) {
		validateNumber(value)
		this.#left = value;
	}

	/** 투영 우측 반환 */
	get right(): number {
		return this.#right;
	}

	/** 투영 우측 설정 */
	set right(value: number) {
		validateNumber(value)
		this.#right = value;
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
}

export default OrthographicCamera
