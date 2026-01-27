import ColorRGB from "../../../../color/ColorRGB";
import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect, { ASinglePassPostEffectResult } from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 안개(Fog) 후처리 이펙트입니다.
 * [EN] Fog post-processing effect.
 *
 * [KO] 지수/지수제곱 타입, 밀도, 시작/끝 거리, 색상 등 다양한 안개 효과를 지원합니다.
 * [EN] Supports various fog effects including Exponential/Exponential Squared types, density, near/far distance, and color.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Fog(redGPUContext);
 * effect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL_SQUARED;
 * effect.density = 0.1;
 * effect.nearDistance = 5.0;
 * effect.farDistance = 40.0;
 * effect.fogColor.setRGB(200, 220, 255);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/fog/fog/"></iframe>
 * @category Fog
 */
declare class Fog extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] 지수 안개 타입
     * [EN] Exponential fog type
     */
    static EXPONENTIAL: number;
    /**
     * [KO] 지수제곱 안개 타입
     * [EN] Exponential Squared fog type
     */
    static EXPONENTIAL_SQUARED: number;
    /**
     * [KO] Fog 인스턴스를 생성합니다.
     * [EN] Creates a Fog instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 안개 타입을 반환합니다.
     * [EN] Returns the fog type.
     */
    get fogType(): number;
    /**
     * [KO] 안개 타입을 설정합니다. (0 또는 1)
     * [EN] Sets the fog type. (0 or 1)
     */
    set fogType(value: number);
    /**
     * [KO] 안개 밀도를 반환합니다.
     * [EN] Returns the fog density.
     */
    get density(): number;
    /**
     * [KO] 안개 밀도를 설정합니다. (0 ~ 1)
     * [EN] Sets the fog density. (0 ~ 1)
     */
    set density(value: number);
    /**
     * [KO] 안개 시작 거리를 반환합니다.
     * [EN] Returns the fog near distance.
     */
    get nearDistance(): number;
    /**
     * [KO] 안개 시작 거리를 설정합니다. (최소 0.1)
     * [EN] Sets the fog near distance. (Minimum 0.1)
     */
    set nearDistance(value: number);
    /**
     * [KO] 안개 끝 거리를 반환합니다.
     * [EN] Returns the fog far distance.
     */
    get farDistance(): number;
    /**
     * [KO] 안개 끝 거리를 설정합니다. (nearDistance + 0.1 이상)
     * [EN] Sets the fog far distance. (Greater than nearDistance + 0.1)
     */
    set farDistance(value: number);
    /**
     * [KO] 안개 색상을 반환합니다.
     * [EN] Returns the fog color.
     */
    get fogColor(): ColorRGB;
    /**
     * [KO] 안개 효과를 렌더링합니다.
     * [EN] Renders the fog effect.
     *
     * @param view
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width
     * [KO] 너비
     * [EN] Width
     * @param height
     * [KO] 높이
     * [EN] Height
     * @param sourceTextureInfo
     * [KO] 소스 텍스처 정보
     * [EN] Source texture info
     * @returns
     * [KO] 렌더링 결과
     * [EN] Rendering result
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult;
}
export default Fog;
