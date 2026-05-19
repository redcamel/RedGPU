import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineUniformProperty from "../../../defineProperty/DefineUniformProperty";

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

interface FilmGrain{
    filmGrainIntensity: number;
    filmGrainResponse: number;
    filmGrainScale: number;
    coloredGrain: number;
    grainSaturation: number;
}
/**
 * [KO] 현대적인 시네마틱 필름 그레인(Film Grain) 후처리 이펙트입니다.
 * [EN] Modern cinematic Film Grain post-processing effect.
 *
 * @category Visual Effects
 */
class FilmGrain extends ASinglePassPostEffect {
    static SUBTLE = SUBTLE;
    static MEDIUM = MEDIUM;
    static HEAVY = HEAVY;
    static VINTAGE = VINTAGE;

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


    applyPreset(preset: typeof SUBTLE): void {
        this.filmGrainIntensity = preset.filmGrainIntensity;
        this.filmGrainResponse = preset.filmGrainResponse;
        this.filmGrainScale = preset.filmGrainScale;
        this.coloredGrain = preset.coloredGrain;
        this.grainSaturation = preset.grainSaturation;
        this.#updateUniforms();
    }

    #updateUniforms(): void {
        this.filmGrainIntensity = this.filmGrainIntensity;
        this.filmGrainResponse = this.filmGrainResponse;
        this.filmGrainScale = this.filmGrainScale;
        this.coloredGrain = this.coloredGrain;
        this.grainSaturation = this.grainSaturation;
        this.updateUniform('devicePixelRatio', this.#devicePixelRatio);
    }
}
DefineUniformProperty.definePositiveNumber(FilmGrain,[
    ['filmGrainIntensity',VINTAGE.filmGrainIntensity],
    ['filmGrainResponse',VINTAGE.filmGrainResponse],
    ['filmGrainScale',VINTAGE.filmGrainScale],
    ['coloredGrain',VINTAGE.coloredGrain],
    ['grainSaturation',VINTAGE.grainSaturation],
])
Object.freeze(FilmGrain);
export default FilmGrain;
