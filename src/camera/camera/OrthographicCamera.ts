import validateNumber from "../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import PerspectiveCamera from "./PerspectiveCamera";

/**
 * [KO] 직교 투영을 사용하는 카메라입니다.
 * [EN] Camera that uses orthographic projection.
 *
 * [KO] 이 투영 모드에서는 객체의 크기가 카메라로부터의 거리에 관계없이 일정하게 유지됩니다. 주로 2D 뷰포트나 설계도면 같은 정투영 뷰를 구현할 때 사용됩니다.
 * [EN] In this projection mode, an object's size stays constant regardless of its distance from the camera. It is primarily used for implementing orthographic views such as 2D viewports or blueprints.
 *
 * @category Camera
 *
 * @example
 * ```typescript
 * const camera = new RedGPU.Camera.OrthographicCamera();
 * camera.top = 10;
 * camera.bottom = -10;
 * camera.left = -20;
 * camera.right = 20;
 * ```
 */
class OrthographicCamera extends PerspectiveCamera {
	/**
	 * [KO] 인스턴스 고유 ID
	 * [EN] Instance unique ID
	 */
	#instanceId: number;

	/**
	 * [KO] 카메라 이름
	 * [EN] Camera name
	 */
	#name: string;

	/**
	 * [KO] 투영 상단
	 * [EN] Projection top
	 */
	#top: number = 1;

	/**
	 * [KO] 투영 하단
	 * [EN] Projection bottom
	 */
	#bottom: number = -1;

	/**
	 * [KO] 투영 좌측
	 * [EN] Projection left
	 */
	#left: number = -1;

	/**
	 * [KO] 투영 우측
	 * [EN] Projection right
	 */
	#right: number = 1;

	/**
	 * [KO] 줌 레벨 (기본값 1 = 줌 없음)
	 * [EN] Zoom level (default 1 = no zoom)
	 */
	#zoom: number = 1;

	/**
	 * [KO] 최소 줌
	 * [EN] Minimum zoom
	 */
	#minZoom: number = 0.1;

	/**
	 * [KO] 최대 줌
	 * [EN] Maximum zoom
	 */
	#maxZoom: number = 10;

	/**
	 * [KO] OrthographicCamera 인스턴스를 생성합니다.
	 * [EN] Creates an instance of OrthographicCamera.
	 */
	constructor() {
		super();
		this.nearClipping = 0.01;
		this.farClipping = 10000;
	}

	/**
	 * [KO] 투영 상단 값을 반환합니다.
	 * [EN] Returns the projection top value.
	 *
	 * @returns
	 * [KO] 투영 상단 값
	 * [EN] Projection top value
	 */
	get top(): number {
		return this.#top;
	}

	/**
	 * [KO] 투영 상단 값을 설정합니다.
	 * [EN] Sets the projection top value.
	 *
	 * @param value
	 * [KO] 설정할 상단 값
	 * [EN] Top value to set
	 */
	set top(value: number) {
		validateNumber(value);
		this.#top = value;
	}

	/**
	 * [KO] 투영 하단 값을 반환합니다.
	 * [EN] Returns the projection bottom value.
	 *
	 * @returns
	 * [KO] 투영 하단 값
	 * [EN] Projection bottom value
	 */
	get bottom(): number {
		return this.#bottom;
	}

	/**
	 * [KO] 투영 하단 값을 설정합니다.
	 * [EN] Sets the projection bottom value.
	 *
	 * @param value
	 * [KO] 설정할 하단 값
	 * [EN] Bottom value to set
	 */
	set bottom(value: number) {
		validateNumber(value);
		this.#bottom = value;
	}

	/**
	 * [KO] 투영 좌측 값을 반환합니다.
	 * [EN] Returns the projection left value.
	 *
	 * @returns
	 * [KO] 투영 좌측 값
	 * [EN] Projection left value
	 */
	get left(): number {
		return this.#left;
	}

	/**
	 * [KO] 투영 좌측 값을 설정합니다.
	 * [EN] Sets the projection left value.
	 *
	 * @param value
	 * [KO] 설정할 좌측 값
	 * [EN] Left value to set
	 */
	set left(value: number) {
		validateNumber(value);
		this.#left = value;
	}

	/**
	 * [KO] 투영 우측 값을 반환합니다.
	 * [EN] Returns the projection right value.
	 *
	 * @returns
	 * [KO] 투영 우측 값
	 * [EN] Projection right value
	 */
	get right(): number {
		return this.#right;
	}

	/**
	 * [KO] 투영 우측 값을 설정합니다.
	 * [EN] Sets the projection right value.
	 *
	 * @param value
	 * [KO] 설정할 우측 값
	 * [EN] Right value to set
	 */
	set right(value: number) {
		validateNumber(value);
		this.#right = value;
	}

	/**
	 * [KO] 줌 레벨을 반환합니다.
	 * [EN] Returns the zoom level.
	 *
	 * @returns
	 * [KO] 줌 레벨
	 * [EN] Zoom level
	 */
	get zoom(): number {
		return this.#zoom;
	}

	/**
	 * [KO] 줌 레벨을 설정합니다.
	 * [EN] Sets the zoom level.
	 *
	 * @param value
	 * [KO] 설정할 줌 레벨 (minZoom ~ maxZoom)
	 * [EN] Zoom level to set (minZoom ~ maxZoom)
	 */
	set zoom(value: number) {
		validateNumberRange(value, this.#minZoom, this.#maxZoom);
		this.#zoom = value;
	}

	/**
	 * [KO] 최소 줌 레벨을 반환합니다.
	 * [EN] Returns the minimum zoom level.
	 *
	 * @returns
	 * [KO] 최소 줌 레벨
	 * [EN] Minimum zoom level
	 */
	get minZoom(): number {
		return this.#minZoom;
	}

	/**
	 * [KO] 최소 줌 레벨을 설정합니다.
	 * [EN] Sets the minimum zoom level.
	 *
	 * @param value
	 * [KO] 설정할 최소 줌 (0.01 이상)
	 * [EN] Minimum zoom to set (min 0.01)
	 */
	set minZoom(value: number) {
		validateNumberRange(value, 0.01);
		this.#minZoom = value;
	}

	/**
	 * [KO] 최대 줌 레벨을 반환합니다.
	 * [EN] Returns the maximum zoom level.
	 *
	 * @returns
	 * [KO] 최대 줌 레벨
	 * [EN] Maximum zoom level
	 */
	get maxZoom(): number {
		return this.#maxZoom;
	}

	/**
	 * [KO] 최대 줌 레벨을 설정합니다.
	 * [EN] Sets the maximum zoom level.
	 *
	 * @param value
	 * [KO] 설정할 최대 줌 (0.01 이상)
	 * [EN] Maximum zoom to set (min 0.01)
	 */
	set maxZoom(value: number) {
		validateNumberRange(value, 0.01);
		this.#maxZoom = value;
	}

	/**
	 * [KO] 카메라 이름을 반환합니다.
	 * [EN] Returns the camera name.
	 *
	 * @returns
	 * [KO] 카메라 이름
	 * [EN] Camera name
	 */
	get name(): string {
		if (!this.#instanceId) this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
		return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
	}

	/**
	 * [KO] 카메라 이름을 설정합니다.
	 * [EN] Sets the camera name.
	 *
	 * @param value
	 * [KO] 설정할 이름
	 * [EN] Name to set
	 */
	set name(value: string) {
		this.#name = value;
	}

	/**
	 * [KO] 줌을 설정합니다.
	 * [EN] Sets the zoom level.
	 *
	 * @param zoom
	 * [KO] 줌 레벨 (0.1 ~ 10)
	 * [EN] Zoom level (0.1 ~ 10)
	 */
	setZoom(zoom: number): void {
		this.zoom = zoom;
	}
}

export default OrthographicCamera;