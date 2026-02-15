import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
/**
 * [KO] 필름 그레인 프리셋 정의 (업계 표준 수치 기반)
 * [EN] Film Grain preset definitions (Based on industry standard values)
 */
declare const SUBTLE: {
    filmGrainIntensity: number;
    filmGrainResponse: number;
    filmGrainScale: number;
    coloredGrain: number;
    grainSaturation: number;
};
/**
 * [KO] 현대적인 시네마틱 필름 그레인(Film Grain) 후처리 이펙트입니다.
 * [EN] Modern cinematic Film Grain post-processing effect.
 *
 * @category Visual Effects
 */
declare class FilmGrain extends ASinglePassPostEffect {
    #private;
    static SUBTLE: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    static MEDIUM: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    static HEAVY: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    static VINTAGE: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    constructor(redGPUContext: RedGPUContext);
    get filmGrainIntensity(): number;
    set filmGrainIntensity(v: number);
    get filmGrainResponse(): number;
    set filmGrainResponse(v: number);
    get filmGrainScale(): number;
    set filmGrainScale(v: number);
    get coloredGrain(): number;
    set coloredGrain(v: number);
    get grainSaturation(): number;
    set grainSaturation(v: number);
    applyPreset(preset: typeof SUBTLE): void;
    update(deltaTime: number): void;
}
export default FilmGrain;
