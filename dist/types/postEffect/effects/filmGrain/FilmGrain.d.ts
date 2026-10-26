import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
declare const SUBTLE: {
    filmGrainIntensity: number;
    filmGrainResponse: number;
    filmGrainScale: number;
    coloredGrain: number;
    grainSaturation: number;
};
interface FilmGrain {
    /**
     * [KO] 그레인 입자 강도 (0 이상)
     * [EN] Grain particle intensity (0 or greater)
     * @defaultValue 0.015
     */
    filmGrainIntensity: number;
    /**
     * [KO] 명도에 따른 그레인 반응 곡선 (0 이상)
     * [EN] Luminance-based grain response curve (0 or greater)
     * @defaultValue 1.2
     */
    filmGrainResponse: number;
    /**
     * [KO] 그레인 입자 크기 스케일 (0 이상)
     * [EN] Grain particle size scale (0 or greater)
     * @defaultValue 1.8
     */
    filmGrainScale: number;
    /**
     * [KO] 유색 그레인 적용 비율 (0: 단색, 1: 풀컬러)
     * [EN] Colored grain ratio (0: monochromatic, 1: full color)
     * @defaultValue 0.15
     */
    coloredGrain: number;
    /**
     * [KO] 그레인 입자 채도 강도 (0 이상)
     * [EN] Grain particle saturation intensity (0 or greater)
     * @defaultValue 0.3
     */
    grainSaturation: number;
}
/**
 * [KO] 필름의 입자 질감을 시뮬레이션하는 필름 그레인 후처리 이펙트입니다.
 * [EN] Film Grain post-processing effect that simulates film grain texture.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.FilmGrain(redGPUContext);
 * effect.applyPreset(RedGPU.PostEffect.FilmGrain.MEDIUM);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/filmGrain/" style="width:100%; height:500px;"></iframe>
 *
 * @see [FilmGrain example](/RedGPU/examples/postEffect/filmGrain/)
 * @category Visual Effects
 */
declare class FilmGrain extends ASinglePassPostEffect {
    /**
     * [KO] 미세한 질감 프리셋
     * [EN] Subtle texture preset
     */
    static SUBTLE: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    /**
     * [KO] 표준 질감 프리셋
     * [EN] Medium texture preset
     */
    static MEDIUM: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    /**
     * [KO] 강한 질감 프리셋
     * [EN] Heavy texture preset
     */
    static HEAVY: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    /**
     * [KO] 빈티지 영화 스타일 프리셋
     * [EN] Vintage cinematic preset
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
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.FilmGrain(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 프리셋 수치를 이펙트에 적용합니다.
     * [EN] Applies preset values to the effect.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.FilmGrain(redGPUContext);
     * effect.applyPreset(RedGPU.PostEffect.FilmGrain.SUBTLE);
     * ```
     *
     * @param preset -
     * [KO] 적용할 프리셋 객체
     * [EN] Preset object to apply
     */
    applyPreset(preset: typeof SUBTLE): void;
}
export default FilmGrain;
