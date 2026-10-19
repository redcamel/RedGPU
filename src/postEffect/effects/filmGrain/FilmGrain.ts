import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";


const SUBTLE = {
    filmGrainIntensity: 0.008,
    filmGrainResponse: 1.5,
    filmGrainScale: 1.2,
    coloredGrain: 0.05,
    grainSaturation: 0.1
};
const MEDIUM = {
    filmGrainIntensity: 0.015,
    filmGrainResponse: 1.2,
    filmGrainScale: 1.8,
    coloredGrain: 0.15,
    grainSaturation: 0.3
};
const HEAVY = {
    filmGrainIntensity: 0.03,
    filmGrainResponse: 1.0,
    filmGrainScale: 2.5,
    coloredGrain: 0.25,
    grainSaturation: 0.5
};
const VINTAGE = {
    filmGrainIntensity: 0.06,
    filmGrainResponse: 0.7,
    filmGrainScale: 4.0,
    coloredGrain: 0.6,
    grainSaturation: 0.8
};

interface FilmGrain {
    /**
     * [KO] 그레인 입자 강도 (기본값: 0.015)
     * [EN] Grain particle intensity (default: 0.015)
     */
    filmGrainIntensity: number;
    /**
     * [KO] 명도에 따른 그레인 반응 곡선 (기본값: 1.2)
     * [EN] Luminance-based grain response curve (default: 1.2)
     */
    filmGrainResponse: number;
    /**
     * [KO] 그레인 입자 크기 스케일 (기본값: 1.8)
     * [EN] Grain particle size scale (default: 1.8)
     */
    filmGrainScale: number;
    /**
     * [KO] 유색 그레인 적용 비율 (0: 단색, 1: 풀컬러, 기본값: 0.15)
     * [EN] Colored grain ratio (0: monochromatic, 1: full color, default: 0.15)
     */
    coloredGrain: number;
    /**
     * [KO] 그레인 입자 채도 강도 (기본값: 0.3)
     * [EN] Grain particle saturation intensity (default: 0.3)
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
 * @see [FilmGrain example](/RedGPU/examples/postEffect/filmGrain/)
 * @category Visual Effects
 */
class FilmGrain extends ASinglePassPostEffect {
    /**
     * [KO] 미세한 질감 프리셋
     * [EN] Subtle texture preset
     */
    static SUBTLE = SUBTLE;
    /**
     * [KO] 표준 질감 프리셋
     * [EN] Medium texture preset
     */
    static MEDIUM = MEDIUM;
    /**
     * [KO] 강한 질감 프리셋
     * [EN] Heavy texture preset
     */
    static HEAVY = HEAVY;
    /**
     * [KO] 빈티지 영화 스타일 프리셋
     * [EN] Vintage cinematic preset
     */
    static VINTAGE = VINTAGE;

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
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {isLdr: true});
        this.init(
            redGPUContext,
            'POST_EFFECT_FILM_GRAIN',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

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
    applyPreset(preset: typeof SUBTLE): void {
        this.filmGrainIntensity = preset.filmGrainIntensity;
        this.filmGrainResponse = preset.filmGrainResponse;
        this.filmGrainScale = preset.filmGrainScale;
        this.coloredGrain = preset.coloredGrain;
        this.grainSaturation = preset.grainSaturation;
    }


}

definePositiveNumber(FilmGrain, [
    {key: 'filmGrainIntensity', value: MEDIUM.filmGrainIntensity},
    {key: 'filmGrainResponse', value: MEDIUM.filmGrainResponse},
    {key: 'filmGrainScale', value: MEDIUM.filmGrainScale},
    {key: 'coloredGrain', value: MEDIUM.coloredGrain},
    {key: 'grainSaturation', value: MEDIUM.grainSaturation},
])
Object.freeze(FilmGrain);
export default FilmGrain;
