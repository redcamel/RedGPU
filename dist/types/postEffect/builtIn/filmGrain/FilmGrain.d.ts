import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASingleComputePassPostEffect from "../../core/ASingleComputePassPostEffect";
import { IPostEffectResult } from "../../core/types";
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
     * @defaultValue 0.06
     */
    filmGrainIntensity: number;
    /**
     * [KO] 명도에 따른 그레인 반응 곡선 (0 이상)
     * [EN] Luminance-based grain response curve (0 or greater)
     * @defaultValue 1.0
     */
    filmGrainResponse: number;
    /**
     * [KO] 그레인 입자 크기 스케일 (0 이상)
     * [EN] Grain particle size scale (0 or greater)
     * @defaultValue 1.6
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
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 builtInEffectManager를 통해 FilmGrain 활성화 및 프리셋 적용
 * // [EN] Enable FilmGrain and apply a preset through View3D's builtInEffectManager
 * view.builtInEffectManager.useFilmGrain = true;
 * const filmGrain = view.builtInEffectManager.filmGrain;
 * filmGrain.applyPreset(RedGPU.PostEffect.BuiltIn.FilmGrain.MEDIUM);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/builtIn/lens/filmGrain/"></iframe>
 *
 * @see [FilmGrain example](/RedGPU/examples/postEffect/builtIn/lens/filmGrain/)
 * @category PostEffect
 */
declare class FilmGrain extends ASingleComputePassPostEffect {
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
     * view.builtInEffectManager.useFilmGrain = true;
     * view.builtInEffectManager.filmGrain.applyPreset(RedGPU.PostEffect.BuiltIn.FilmGrain.SUBTLE);
     * ```
     *
     * @param preset -
     * [KO] 적용할 프리셋 객체
     * [EN] Preset object to apply
     */
    applyPreset(preset: typeof SUBTLE): void;
    /**
     * [KO] 필름 그레인 후처리 이펙트를 렌더링합니다.
     * [EN] Renders the film grain post-processing effect.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param width -
     * [KO] 렌더링 너비 (단위: 픽셀)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (단위: 픽셀)
     * [EN] Rendering height (in pixels)
     * @param sourceTextureInfo -
     * [KO] 입력 소스 텍스처 정보
     * [EN] Input source texture information
     * @returns
     * [KO] 렌더링 결과 (`IPostEffectResult`)
     * [EN] Rendering result (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default FilmGrain;
