import ColorRGB from "../../color/ColorRGB";
import convertHexToRgb from "../../utils/convertColor/convertHexToRgb";
import BaseLight from "../core/BaseLight";

/**
 * 방향성 광원을 정의하는 클래스입니다.
 *
 * 이 광원은 특정 방향으로 균일하게 빛을 투사하며, 태양광과 같은 효과를 구현할 때 사용됩니다.
 *
 * @example
 * ```javascript
 * const light = new RedGPU.Light.DirectionalLight();
 * scene.lightManager.addDirectionalLight(light);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/light/directionalLight/" width="100%" height="400" style="border:none;"></iframe>
 */
class DirectionalLight extends BaseLight {
	/** 광원의 X 방향 벡터 값 */
	#directionX: number = -1;
	/** 광원의 Y 방향 벡터 값 */
	#directionY: number = -1;
	/** 광원의 Z 방향 벡터 값 */
	#directionZ: number = -1;

	/**
	 * 새로운 DirectionalLight 인스턴스를 생성합니다.
	 *
	 * @param direction - 광원의 방향 벡터 [x, y, z]
	 * @param color - 광원의 색상 (hex 문자열)
	 * @param intensity - 광원의 세기
	 */
	constructor(direction: [number, number, number] = [-1, -1, -1], color: string = '#fff', intensity: number = 1) {
		super(new ColorRGB(...convertHexToRgb(color, true)), intensity);
		this.#directionX = direction[0];
		this.#directionY = direction[1];
		this.#directionZ = direction[2];
	}

	/** X 방향 벡터 값 반환 */
	get directionX(): number {
		return this.#directionX;
	}
	/** X 방향 벡터 값 설정 */
	set directionX(value: number) {
		this.#directionX = value;
	}

	/** Y 방향 벡터 값 반환 */
	get directionY(): number {
		return this.#directionY;
	}
	/** Y 방향 벡터 값 설정 */
	set directionY(value: number) {
		this.#directionY = value;
	}

	/** Z 방향 벡터 값 반환 */
	get directionZ(): number {
		return this.#directionZ;
	}
	/** Z 방향 벡터 값 설정 */
	set directionZ(value: number) {
		this.#directionZ = value;
	}

	/**
	 * 전체 방향 벡터를 반환합니다.
	 * @returns [x, y, z]
	 */
	get direction(): [number, number, number] {
		return [this.#directionX, this.#directionY, this.#directionZ];
	}

	/**
	 * 전체 방향 벡터를 설정합니다.
	 * @param value - [x, y, z]
	 */
	set direction(value: [number, number, number]) {
		this.#directionX = value[0];
		this.#directionY = value[1];
		this.#directionZ = value[2];
	}
}

Object.freeze(DirectionalLight);
export default DirectionalLight;
