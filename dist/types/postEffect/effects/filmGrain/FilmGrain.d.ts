import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
declare const SUBTLE: {
    filmGrainIntensity: number;
    filmGrainResponse: number;
    filmGrainScale: number;
    coloredGrain: number;
    grainSaturation: number;
};
declare const MEDIUM: {
    filmGrainIntensity: number;
    filmGrainResponse: number;
    filmGrainScale: number;
    coloredGrain: number;
    grainSaturation: number;
};
declare const HEAVY: {
    filmGrainIntensity: number;
    filmGrainResponse: number;
    filmGrainScale: number;
    coloredGrain: number;
    grainSaturation: number;
};
declare const VINTAGE: {
    filmGrainIntensity: number;
    filmGrainResponse: number;
    filmGrainScale: number;
    coloredGrain: number;
    grainSaturation: number;
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
declare class FilmGrain extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] 미세한 그레인 프리셋
     * [EN] Subtle grain preset
     */
    static SUBTLE: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    /**
     * [KO] 중간 강도 프리셋
     * [EN] Medium intensity preset
     */
    static MEDIUM: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    /**
     * [KO] 강한 그레인 프리셋
     * [EN] Heavy grain preset
     */
    static HEAVY: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    /**
     * [KO] 빈티지 프리셋
     * [EN] Vintage preset
     */
    static VINTAGE: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    /**
     * [KO] FilmGrain 인스턴스를 생성합니다.
     * [EN] Creates a FilmGrain instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 그레인 강도를 반환합니다.
     * [EN] Returns the grain intensity.
     */
    get filmGrainIntensity(): number;
    /**
     * [KO] 그레인 강도를 설정합니다. (0 ~ 1)
     * [EN] Sets the grain intensity. (0 ~ 1)
     */
    set filmGrainIntensity(value: number);
    /**
     * [KO] 밝기 반응도를 반환합니다.
     * [EN] Returns the brightness response.
     */
    get filmGrainResponse(): number;
    /**
     * [KO] 밝기 반응도를 설정합니다. (0 ~ 2)
     * [EN] Sets the brightness response. (0 ~ 2)
     */
    set filmGrainResponse(value: number);
    /**
     * [KO] 그레인 스케일을 반환합니다.
     * [EN] Returns the grain scale.
     */
    get filmGrainScale(): number;
    /**
     * [KO] 그레인 스케일을 설정합니다. (0.1 ~ 20)
     * [EN] Sets the grain scale. (0.1 ~ 20)
     */
    set filmGrainScale(value: number);
    /**
     * [KO] 컬러 그레인 비율을 반환합니다.
     * [EN] Returns the colored grain ratio.
     */
    get coloredGrain(): number;
    /**
     * [KO] 컬러 그레인 비율을 설정합니다. (0 ~ 1)
     * [EN] Sets the colored grain ratio. (0 ~ 1)
     */
    set coloredGrain(value: number);
    /**
     * [KO] 그레인 채도를 반환합니다.
     * [EN] Returns the grain saturation.
     */
    get grainSaturation(): number;
    /**
     * [KO] 그레인 채도를 설정합니다. (0 ~ 2)
     * [EN] Sets the grain saturation. (0 ~ 2)
     */
    set grainSaturation(value: number);
    /**
     * [KO] 프리셋을 적용합니다.
     * [EN] Applies a preset.
     *
     * @param preset
     * [KO] 적용할 프리셋 객체
     * [EN] Preset object to apply
     */
    applyPreset(preset: typeof SUBTLE | typeof MEDIUM | typeof HEAVY | typeof VINTAGE): void;
    /**
     * [KO] 시간을 업데이트합니다. (애니메이션용)
     * [EN] Updates the time. (For animation)
     *
     * @param deltaTime
     * [KO] 델타 타임
     * [EN] Delta time
     */
    update(deltaTime: number): void;
}
export default FilmGrain;
