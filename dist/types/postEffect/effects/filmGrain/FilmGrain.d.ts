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
 * 필름 그레인(Film Grain) 후처리 이펙트입니다.
 * 다양한 프리셋과 강도, 색상, 스케일, 채도 등 세부 조절이 가능합니다.
 *
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
 * <iframe src="/RedGPU/examples/postEffect/filmGrain/"></iframe>
 */
declare class FilmGrain extends ASinglePassPostEffect {
    #private;
    /** 미세한 그레인 프리셋 */
    static SUBTLE: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    /** 중간 강도 프리셋 */
    static MEDIUM: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    /** 강한 그레인 프리셋 */
    static HEAVY: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    /** 빈티지 프리셋 */
    static VINTAGE: {
        filmGrainIntensity: number;
        filmGrainResponse: number;
        filmGrainScale: number;
        coloredGrain: number;
        grainSaturation: number;
    };
    constructor(redGPUContext: RedGPUContext);
    /** 그레인 강도 반환 */
    get filmGrainIntensity(): number;
    /** 그레인 강도 설정. 0~1 */
    set filmGrainIntensity(value: number);
    /** 밝기 반응도 반환 */
    get filmGrainResponse(): number;
    /** 밝기 반응도 설정. 0~2 */
    set filmGrainResponse(value: number);
    /** 그레인 스케일 반환 */
    get filmGrainScale(): number;
    /** 그레인 스케일 설정. 0.1~20 */
    set filmGrainScale(value: number);
    /** 컬러 그레인 비율 반환 */
    get coloredGrain(): number;
    /** 컬러 그레인 비율 설정. 0~1 */
    set coloredGrain(value: number);
    /** 그레인 채도 반환 */
    get grainSaturation(): number;
    /** 그레인 채도 설정. 0~2 */
    set grainSaturation(value: number);
    /** 프리셋 적용 */
    applyPreset(preset: typeof SUBTLE | typeof MEDIUM | typeof HEAVY | typeof VINTAGE): void;
    /** 시간 업데이트(애니메이션용) */
    update(deltaTime: number): void;
}
export default FilmGrain;
