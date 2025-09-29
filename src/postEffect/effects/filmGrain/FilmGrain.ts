import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

const SUBTLE = {
	filmGrainIntensity: 0.02,
	filmGrainResponse: 0.9,
	filmGrainScale: 2.5,
	coloredGrain: 0.3,
	grainSaturation: 0.4
};
const MEDIUM = {
	filmGrainIntensity: 0.05,
	filmGrainResponse: 0.8,
	filmGrainScale: 3.0,
	coloredGrain: 0.5,
	grainSaturation: 0.6
};
const HEAVY = {
	filmGrainIntensity: 0.12,
	filmGrainResponse: 0.6,
	filmGrainScale: 4.0,
	coloredGrain: 0.7,
	grainSaturation: 0.8
};
const VINTAGE = {
	filmGrainIntensity: 0.08,
	filmGrainResponse: 0.7,
	filmGrainScale: 5.0,
	coloredGrain: 0.9,
	grainSaturation: 1.0
};

/**
 * 필름 그레인(Film Grain) 후처리 이펙트입니다.
 * 다양한 프리셋과 강도, 색상, 스케일, 채도 등 세부 조절이 가능합니다.
 *
 * @category PostEffect
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.FilmGrain(redGPUContext);
 * effect.filmGrainIntensity = 0.08;
 * effect.filmGrainScale = 5.0;
 * effect.coloredGrain = 0.7;
 * effect.applyPreset(RedGPU.PostEffect.FilmGrain.VINTAGE);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/filmGrain/"></iframe>
 */
class FilmGrain extends ASinglePassPostEffect {
	/** 미세한 그레인 프리셋 */
	static SUBTLE = SUBTLE;
	/** 중간 강도 프리셋 */
	static MEDIUM = MEDIUM;
	/** 강한 그레인 프리셋 */
	static HEAVY = HEAVY;
	/** 빈티지 프리셋 */
	static VINTAGE = VINTAGE;
	/** 그레인 강도. 0~1, 기본값 0.12 */
	#filmGrainIntensity: number = HEAVY.filmGrainIntensity;
	/** 밝기 반응도. 0~2, 기본값 0.6 */
	#filmGrainResponse: number = HEAVY.filmGrainResponse;
	/** 그레인 스케일. 0.1~20, 기본값 4.0 */
	#filmGrainScale: number = HEAVY.filmGrainScale;
	/** 컬러 그레인 비율. 0~1, 기본값 0.7 */
	#coloredGrain: number = HEAVY.coloredGrain;
	/** 그레인 채도. 0~2, 기본값 0.8 */
	#grainSaturation: number = HEAVY.grainSaturation;
	#time: number = 0.0;
	#devicePixelRatio: number = 1.0;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.#devicePixelRatio = window?.devicePixelRatio || 1.0;
		this.init(
			redGPUContext,
			'POST_EFFECT_FILM_GRAIN',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		);
		this.#updateUniforms();
	}

	/** 그레인 강도 반환 */
	get filmGrainIntensity(): number {
		return this.#filmGrainIntensity;
	}
	/** 그레인 강도 설정. 0~1 */
	set filmGrainIntensity(value: number) {
		this.#filmGrainIntensity = Math.max(0.0, Math.min(1.0, value));
		this.updateUniform('filmGrainIntensity', this.#filmGrainIntensity);
	}
	/** 밝기 반응도 반환 */
	get filmGrainResponse(): number {
		return this.#filmGrainResponse;
	}
	/** 밝기 반응도 설정. 0~2 */
	set filmGrainResponse(value: number) {
		this.#filmGrainResponse = Math.max(0.0, Math.min(2.0, value));
		this.updateUniform('filmGrainResponse', this.#filmGrainResponse);
	}
	/** 그레인 스케일 반환 */
	get filmGrainScale(): number {
		return this.#filmGrainScale;
	}
	/** 그레인 스케일 설정. 0.1~20 */
	set filmGrainScale(value: number) {
		this.#filmGrainScale = Math.max(0.1, Math.min(20.0, value));
		this.updateUniform('filmGrainScale', this.#filmGrainScale);
	}
	/** 컬러 그레인 비율 반환 */
	get coloredGrain(): number {
		return this.#coloredGrain;
	}
	/** 컬러 그레인 비율 설정. 0~1 */
	set coloredGrain(value: number) {
		this.#coloredGrain = Math.max(0.0, Math.min(1.0, value));
		this.updateUniform('coloredGrain', this.#coloredGrain);
	}
	/** 그레인 채도 반환 */
	get grainSaturation(): number {
		return this.#grainSaturation;
	}
	/** 그레인 채도 설정. 0~2 */
	set grainSaturation(value: number) {
		this.#grainSaturation = Math.max(0.0, Math.min(2.0, value));
		this.updateUniform('grainSaturation', this.#grainSaturation);
	}
	/** 프리셋 적용 */
	applyPreset(preset: typeof SUBTLE | typeof MEDIUM | typeof HEAVY | typeof VINTAGE): void {
		this.#filmGrainIntensity = preset.filmGrainIntensity;
		this.#filmGrainResponse = preset.filmGrainResponse;
		this.#filmGrainScale = preset.filmGrainScale;
		this.#coloredGrain = preset.coloredGrain;
		this.#grainSaturation = preset.grainSaturation;
		this.#updateUniforms();
	}
	/** 시간 업데이트(애니메이션용) */
	update(deltaTime: number): void {
		this.#time += deltaTime;
		this.updateUniform('time', this.#time);
	}
	/** 내부 유니폼 일괄 갱신 */
	#updateUniforms(): void {
		this.updateUniform('filmGrainIntensity', this.#filmGrainIntensity);
		this.updateUniform('filmGrainResponse', this.#filmGrainResponse);
		this.updateUniform('filmGrainScale', this.#filmGrainScale);
		this.updateUniform('coloredGrain', this.#coloredGrain);
		this.updateUniform('grainSaturation', this.#grainSaturation);
		this.updateUniform('time', this.#time);
		this.updateUniform('devicePixelRatio', this.#devicePixelRatio);
	}
}

Object.freeze(FilmGrain);
export default FilmGrain;
