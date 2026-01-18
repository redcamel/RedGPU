import ColorRGB from "../../../../color/ColorRGB";
import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect, { ASinglePassPostEffectResult } from "../../../core/ASinglePassPostEffect";
/**
 * 높이 기반 안개(Height Fog) 후처리 이펙트입니다.
 * 안개 타입, 밀도, 시작 높이, 두께, 감쇠율, 색상 등 다양한 파라미터를 지원합니다.
 *
 * @category Fog
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.HeightFog(redGPUContext);
 * effect.fogType = RedGPU.PostEffect.HeightFog.EXPONENTIAL_SQUARED;
 * effect.density = 0.5;
 * effect.baseHeight = 10.0;
 * effect.thickness = 80.0;
 * effect.falloff = 0.2;
 * effect.fogColor.setRGB(180, 200, 255);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/fog/heightFog/"></iframe>
 */
declare class HeightFog extends ASinglePassPostEffect {
    #private;
    /** 지수 안개 타입 */
    static EXPONENTIAL: number;
    /** 지수제곱 안개 타입 */
    static EXPONENTIAL_SQUARED: number;
    constructor(redGPUContext: RedGPUContext);
    get fogType(): number;
    /** 안개 타입 설정. 0 또는 1 */
    set fogType(value: number);
    get density(): number;
    /** 안개 밀도 설정. 0~5 */
    set density(value: number);
    /** 안개 색상 반환 (ColorRGB) */
    get fogColor(): ColorRGB;
    /** 안개 시작 높이 반환 */
    get baseHeight(): number;
    /** 안개 시작 높이 설정 */
    set baseHeight(value: number);
    /** 안개 최대 높이 반환 (baseHeight+thickness) */
    get maxHeight(): number;
    get thickness(): number;
    /** 안개 레이어 두께 설정. 최소 0.1 */
    set thickness(value: number);
    get falloff(): number;
    /** 높이별 감쇠율 설정. 0.001~2 */
    set falloff(value: number);
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default HeightFog;
