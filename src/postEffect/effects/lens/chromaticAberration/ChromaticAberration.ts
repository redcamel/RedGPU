import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * 색수차(Chromatic Aberration) 후처리 이펙트입니다.
 *
 * @category PostEffect
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.ChromaticAberration(redGPUContext);
 * effect.strength = 0.02;
 * effect.centerX = 0.5;
 * effect.centerY = 0.5;
 * effect.falloff = 1.0;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/lens/chromaticAberration/"></iframe>
 */
class ChromaticAberration extends ASinglePassPostEffect {
	/** 강도. 기본값 0.015, 최소 0 */
	#strength: number = 0.015
	/** 중심 X. 기본값 0.5, 범위 0~1 */
	#centerX: number = 0.5
	/** 중심 Y. 기본값 0.5, 범위 0~1 */
	#centerY: number = 0.5
	/** falloff. 기본값 1.0, 범위 0~5 */
	#falloff: number = 1.0

	/**
	 * ChromaticAberration 인스턴스 생성
	 * @param redGPUContext 렌더링 컨텍스트
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.init(
			redGPUContext,
			'POST_EFFECT_CHROMATIC_ABERRATION',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.strength = this.#strength
		this.centerX = this.#centerX
		this.centerY = this.#centerY
		this.falloff = this.#falloff
	}

	/** 강도 반환 */
	get strength(): number {
		return this.#strength;
	}

	/**
	 * 강도 설정
	 * 최소값 0
	 */
	set strength(value: number) {
		validateNumberRange(value, 0)
		this.#strength = value;
		this.updateUniform('strength', value)
	}

	/** 중심 X 반환 */
	get centerX(): number {
		return this.#centerX;
	}

	/**
	 * 중심 X 설정
	 * 범위 0~1
	 */
	set centerX(value: number) {
		validateNumberRange(value, 0, 1)
		this.#centerX = value;
		this.updateUniform('centerX', value)
	}

	/** 중심 Y 반환 */
	get centerY(): number {
		return this.#centerY;
	}

	/**
	 * 중심 Y 설정
	 * 범위 0~1
	 */
	set centerY(value: number) {
		validateNumberRange(value, 0, 1)
		this.#centerY = value;
		this.updateUniform('centerY', value)
	}

	/** falloff 반환 */
	get falloff(): number {
		return this.#falloff;
	}

	/**
	 * falloff 설정
	 * 범위 0~5
	 */
	set falloff(value: number) {
		validateNumberRange(value, 0, 5)
		this.#falloff = value;
		this.updateUniform('falloff', value)
	}
}

Object.freeze(ChromaticAberration)
export default ChromaticAberration
