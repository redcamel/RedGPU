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
 * [KO] 필름 그레인(Film Grain) 후처리 이펙트입니다.
 * [EN] Film Grain post-processing effect.
 *
 * [KO] 다양한 프리셋과 강도, 색상, 스케일, 채도 등 세부 조절이 가능합니다.
 * [EN] Allows detailed adjustments such as presets, intensity, color, scale, and saturation.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.FilmGrain(redGPUContext);
 * effect.filmGrainIntensity = 0.08;
 * effect.filmGrainScale = 5.0;
 * effect.coloredGrain = 0.7;
 * effect.applyPreset(RedGPU.PostEffect.FilmGrain.VINTAGE);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/filmGrain/"></iframe>
 * @category Visual Effects
 */
class FilmGrain extends ASinglePassPostEffect {
    /**
     * [KO] 미세한 그레인 프리셋
     * [EN] Subtle grain preset
     */
    static SUBTLE = SUBTLE;
    /**
     * [KO] 중간 강도 프리셋
     * [EN] Medium intensity preset
     */
    static MEDIUM = MEDIUM;
    /**
     * [KO] 강한 그레인 프리셋
     * [EN] Heavy grain preset
     */
    static HEAVY = HEAVY;
    /**
     * [KO] 빈티지 프리셋
     * [EN] Vintage preset
     */
    static VINTAGE = VINTAGE;
    /**
     * [KO] 그레인 강도 (0 ~ 1)
     * [EN] Grain intensity (0 ~ 1)
     * @defaultValue 0.12
     */
    #filmGrainIntensity: number = HEAVY.filmGrainIntensity;
    /**
     * [KO] 밝기 반응도 (0 ~ 2)
     * [EN] Brightness response (0 ~ 2)
     * @defaultValue 0.6
     */
    #filmGrainResponse: number = HEAVY.filmGrainResponse;
    /**
     * [KO] 그레인 스케일 (0.1 ~ 20)
     * [EN] Grain scale (0.1 ~ 20)
     * @defaultValue 4.0
     */
    #filmGrainScale: number = HEAVY.filmGrainScale;
    /**
     * [KO] 컬러 그레인 비율 (0 ~ 1)
     * [EN] Colored grain ratio (0 ~ 1)
     * @defaultValue 0.7
     */
    #coloredGrain: number = HEAVY.coloredGrain;
    /**
     * [KO] 그레인 채도 (0 ~ 2)
     * [EN] Grain saturation (0 ~ 2)
     * @defaultValue 0.8
     */
    #grainSaturation: number = HEAVY.grainSaturation;
    #time: number = 0.0;
    #devicePixelRatio: number = 1.0;

    /**
     * [KO] FilmGrain 인스턴스를 생성합니다.
     * [EN] Creates a FilmGrain instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
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

    /**
     * [KO] 그레인 강도를 반환합니다.
     * [EN] Returns the grain intensity.
     */
    get filmGrainIntensity(): number {
        return this.#filmGrainIntensity;
    }

    /**
     * [KO] 그레인 강도를 설정합니다. (0 ~ 1)
     * [EN] Sets the grain intensity. (0 ~ 1)
     */
    set filmGrainIntensity(value: number) {
        this.#filmGrainIntensity = Math.max(0.0, Math.min(1.0, value));
        this.updateUniform('filmGrainIntensity', this.#filmGrainIntensity);
    }

    /**
     * [KO] 밝기 반응도를 반환합니다.
     * [EN] Returns the brightness response.
     */
    get filmGrainResponse(): number {
        return this.#filmGrainResponse;
    }

    /**
     * [KO] 밝기 반응도를 설정합니다. (0 ~ 2)
     * [EN] Sets the brightness response. (0 ~ 2)
     */
    set filmGrainResponse(value: number) {
        this.#filmGrainResponse = Math.max(0.0, Math.min(2.0, value));
        this.updateUniform('filmGrainResponse', this.#filmGrainResponse);
    }

    /**
     * [KO] 그레인 스케일을 반환합니다.
     * [EN] Returns the grain scale.
     */
    get filmGrainScale(): number {
        return this.#filmGrainScale;
    }

    /**
     * [KO] 그레인 스케일을 설정합니다. (0.1 ~ 20)
     * [EN] Sets the grain scale. (0.1 ~ 20)
     */
    set filmGrainScale(value: number) {
        this.#filmGrainScale = Math.max(0.1, Math.min(20.0, value));
        this.updateUniform('filmGrainScale', this.#filmGrainScale);
    }

    /**
     * [KO] 컬러 그레인 비율을 반환합니다.
     * [EN] Returns the colored grain ratio.
     */
    get coloredGrain(): number {
        return this.#coloredGrain;
    }

    /**
     * [KO] 컬러 그레인 비율을 설정합니다. (0 ~ 1)
     * [EN] Sets the colored grain ratio. (0 ~ 1)
     */
    set coloredGrain(value: number) {
        this.#coloredGrain = Math.max(0.0, Math.min(1.0, value));
        this.updateUniform('coloredGrain', this.#coloredGrain);
    }

    /**
     * [KO] 그레인 채도를 반환합니다.
     * [EN] Returns the grain saturation.
     */
    get grainSaturation(): number {
        return this.#grainSaturation;
    }

    /**
     * [KO] 그레인 채도를 설정합니다. (0 ~ 2)
     * [EN] Sets the grain saturation. (0 ~ 2)
     */
    set grainSaturation(value: number) {
        this.#grainSaturation = Math.max(0.0, Math.min(2.0, value));
        this.updateUniform('grainSaturation', this.#grainSaturation);
    }

    /**
     * [KO] 프리셋을 적용합니다.
     * [EN] Applies a preset.
     *
     * @param preset
     * [KO] 적용할 프리셋 객체
     * [EN] Preset object to apply
     */
    applyPreset(preset: typeof SUBTLE | typeof MEDIUM | typeof HEAVY | typeof VINTAGE): void {
        this.#filmGrainIntensity = preset.filmGrainIntensity;
        this.#filmGrainResponse = preset.filmGrainResponse;
        this.#filmGrainScale = preset.filmGrainScale;
        this.#coloredGrain = preset.coloredGrain;
        this.#grainSaturation = preset.grainSaturation;
        this.#updateUniforms();
    }

    /**
     * [KO] 시간을 업데이트합니다. (애니메이션용)
     * [EN] Updates the time. (For animation)
     *
     * @param deltaTime
     * [KO] 델타 타임
     * [EN] Delta time
     */
    update(deltaTime: number): void {
        this.#time += deltaTime;
        this.updateUniform('time', this.#time);
    }

    /**
     * [KO] 내부 유니폼을 일괄 갱신합니다.
     * [EN] Updates internal uniforms in batch.
     */
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
