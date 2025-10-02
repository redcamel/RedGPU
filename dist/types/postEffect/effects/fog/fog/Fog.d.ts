import ColorRGB from "../../../../color/ColorRGB";
import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect, { ASinglePassPostEffectResult } from "../../../core/ASinglePassPostEffect";
/**
 * 안개(Fog) 후처리 이펙트입니다.
 * 지수/지수제곱 타입, 밀도, 시작/끝 거리, 색상 등 다양한 안개 효과를 지원합니다.
 *
 * @category Fog
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Fog(redGPUContext);
 * effect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL_SQUARED;
 * effect.density = 0.1;
 * effect.nearDistance = 5.0;
 * effect.farDistance = 40.0;
 * effect.fogColor.setRGB(200, 220, 255);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/fog/fog/"></iframe>
 */
declare class Fog extends ASinglePassPostEffect {
    #private;
    /** 지수 안개 타입 */
    static EXPONENTIAL: number;
    /** 지수제곱 안개 타입 */
    static EXPONENTIAL_SQUARED: number;
    constructor(redGPUContext: RedGPUContext);
    /** 안개 타입 반환 */
    get fogType(): number;
    /** 안개 타입 설정. 0 또는 1 */
    set fogType(value: number);
    /** 안개 밀도 반환 */
    get density(): number;
    /** 안개 밀도 설정. 0~1 */
    set density(value: number);
    /** 안개 시작 거리 반환 */
    get nearDistance(): number;
    /** 안개 시작 거리 설정. 최소 0.1 */
    set nearDistance(value: number);
    /** 안개 끝 거리 반환 */
    get farDistance(): number;
    /** 안개 끝 거리 설정. nearDistance+0.1 이상 */
    set farDistance(value: number);
    /** 안개 색상 반환 (ColorRGB) */
    get fogColor(): ColorRGB;
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default Fog;
