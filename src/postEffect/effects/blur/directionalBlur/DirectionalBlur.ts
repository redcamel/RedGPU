import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * 방향성 블러(Directional Blur) 후처리 이펙트입니다.
 * 각도와 강도를 지정해 원하는 방향으로 블러를 적용할 수 있습니다.
 *
 * @category Blur
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.DirectionalBlur(redGPUContext);
 * effect.angle = 45;   // 45도 방향 블러
 * effect.amount = 30;  // 블러 강도
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/blur/directionalBlur/"></iframe>
 */
class DirectionalBlur extends ASinglePassPostEffect {
	/** 블러 강도. 기본값 15, 최소 0 */
	#amount: number = 15
	/** 블러 각도(도). 기본값 0, 0=오른쪽 */
	#angle: number = 0

	/**
	 * DirectionalBlur 인스턴스 생성
	 * @param redGPUContext 렌더링 컨텍스트
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_DIRECTIONAL_BLUR',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.amount = this.#amount
		this.angle = this.#angle
	}

	/** 블러 각도 반환 */
	get angle(): number {
		return this.#angle;
	}

	/**
	 * 블러 각도 설정(도)
	 * 0=오른쪽, 360도로 정규화
	 * @param value 각도
	 */
	set angle(value: number) {
		validateNumber(value)
		this.#angle = value % 360; // 360도로 정규화
		this.#updateDirection();
	}

	/** 블러 강도 반환 */
	get amount(): number {
		return this.#amount;
	}

	/**
	 * 블러 강도 설정
	 * 최소값 0
	 * @param value 강도
	 */
	set amount(value: number) {
		validateNumberRange(value, 0)
		this.#amount = value;
		this.updateUniform('amount', value)
	}

	// 내부 메서드: 각도를 방향 벡터로 변환
	#updateDirection() {
		const radians = this.#angle * Math.PI / 180;
		const directionX = Math.cos(radians);
		const directionY = Math.sin(radians);
		this.updateUniform('directionX', directionX)
		this.updateUniform('directionY', directionY)
	}
}

Object.freeze(DirectionalBlur)
export default DirectionalBlur
