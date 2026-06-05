import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineGPUProperty from "../../../defineProperty/DefineGPUProperty";

/**
 * [KO] 필름 그레인 프리셋 정의 (업계 표준 수치 기반)
 * [EN] Film Grain preset definitions (Based on industry standard values)
 */
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
     * [KO] 그레인 입자의 전체적인 강도 (0 ~ 1)
     * [EN] Overall intensity of grain particles (0 ~ 1)
     */
    filmGrainIntensity: number;
    /**
     * [KO] 명도에 따른 그레인 반응 곡선 (값이 높을수록 어두운 영역에 집중)
     * [EN] Grain response curve based on luminance (higher values concentrate in dark areas)
     */
    filmGrainResponse: number;
    /**
     * [KO] 그레인 입자의 크기 (스케일)
     * [EN] Size (scale) of grain particles
     */
    filmGrainScale: number;
    /**
     * [KO] 유색 그레인 적용 비율 (0: 단색, 1: 풀컬러)
     * [EN] Colored grain application ratio (0: monochromatic, 1: full color)
     */
    coloredGrain: number;
    /**
     * [KO] 입자의 채도 강도
     * [EN] Saturation intensity of particles
     */
    grainSaturation: number;
}

/**
 * [KO] 현대적인 시네마틱 필름 그레인(Film Grain) 후처리 이펙트입니다.
 * [EN] Modern cinematic Film Grain post-processing effect.
 *
 * [KO] 단순한 노이즈가 아닌, 실제 필름의 화학적 입자 질감을 수학적으로 시뮬레이션합니다.
 * [EN] Mathematically simulates the chemical grain texture of real film, rather than just simple noise.
 *
 * [KO] 하이라이트 영역보다 어두운 영역에서 입자가 더 도드라지는 물리적 특성을 반영하며, 시간(프레임)에 따라 변하는 동적 질감을 제공합니다.
 * [EN] Reflects the physical characteristic where particles are more prominent in darker areas than highlights, and provides dynamic texture that changes over time (frames).
 *
 * @category Visual Effects
 */
class FilmGrain extends ASinglePassPostEffect {
    /** [KO] 미세한 질감 프리셋 [EN] Subtle texture preset */
    static SUBTLE = SUBTLE;
    /** [KO] 표준적인 질감 프리셋 [EN] Medium texture preset */
    static MEDIUM = MEDIUM;
    /** [KO] 강한 질감 프리셋 [EN] Heavy texture preset */
    static HEAVY = HEAVY;
    /** [KO] 고전 영화 스타일 프리셋 [EN] Vintage cinematic preset */
    static VINTAGE = VINTAGE;

    #devicePixelRatio: number = 1.0;

    /**
     * [KO] FilmGrain 인스턴스를 생성합니다.
     * [EN] Creates a FilmGrain instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.#devicePixelRatio = window?.devicePixelRatio || 1.0;
        this.init(
            redGPUContext,
            'POST_EFFECT_FILM_GRAIN',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
        this.updateUniform('devicePixelRatio', this.#devicePixelRatio);
    }

    /**
     * [KO] 정의된 프리셋 수치를 이펙트에 즉시 적용합니다.
     * [EN] Immediately applies defined preset values to the effect.
     *
     * @param preset - [KO] 적용할 프리셋 객체 [EN] Preset object to apply
     */
    applyPreset(preset: typeof SUBTLE): void {
        this.filmGrainIntensity = preset.filmGrainIntensity;
        this.filmGrainResponse = preset.filmGrainResponse;
        this.filmGrainScale = preset.filmGrainScale;
        this.coloredGrain = preset.coloredGrain;
        this.grainSaturation = preset.grainSaturation;
    }


}

DefineGPUProperty.definePositiveNumber(FilmGrain, [
    {key: 'filmGrainIntensity', value: VINTAGE.filmGrainIntensity},
    {key: 'filmGrainResponse', value: VINTAGE.filmGrainResponse},
    {key: 'filmGrainScale', value: VINTAGE.filmGrainScale},
    {key: 'coloredGrain', value: VINTAGE.coloredGrain},
    {key: 'grainSaturation', value: VINTAGE.grainSaturation},
])
Object.freeze(FilmGrain);
export default FilmGrain;
