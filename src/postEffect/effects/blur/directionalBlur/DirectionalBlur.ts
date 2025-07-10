import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class DirectionalBlur extends ASinglePassPostEffect {
	#amount: number = 15
	#angle: number = 0  // 0도 = 오른쪽 (포토샵 기본값)
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

	get angle(): number {
		return this.#angle;
	}

	set angle(value: number) {
		validateNumber(value)
		this.#angle = value % 360; // 360도로 정규화
		this.#updateDirection();
	}

	get amount(): number {
		return this.#amount;
	}

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
