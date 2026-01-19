import ColorRGB from "../../../../color/ColorRGB";
import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect, { ASinglePassPostEffectResult } from "../../../core/ASinglePassPostEffect";
/**
 * [KO] 높이 기반 안개(Height Fog) 후처리 이펙트입니다.
 * [EN] Height Fog post-processing effect.
 *
 * [KO] 안개 타입, 밀도, 시작 높이, 두께, 감쇠율, 색상 등 다양한 파라미터를 지원합니다.
 * [EN] Supports various parameters such as fog type, density, base height, thickness, falloff, and color.
 * * ### Example
 * ```typescript
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
 * @category Fog
 */
declare class HeightFog extends ASinglePassPostEffect {
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
     * [KO] HeightFog 인스턴스를 생성합니다.
     * [EN] Creates a HeightFog instance.
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
     * [KO] 안개 밀도를 설정합니다. (0 ~ 5)
     * [EN] Sets the fog density. (0 ~ 5)
     */
    set density(value: number);
    /**
     * [KO] 안개 색상을 반환합니다.
     * [EN] Returns the fog color.
     */
    get fogColor(): ColorRGB;
    /**
     * [KO] 안개 시작 높이를 반환합니다.
     * [EN] Returns the fog base height.
     */
    get baseHeight(): number;
    /**
     * [KO] 안개 시작 높이를 설정합니다.
     * [EN] Sets the fog base height.
     */
    set baseHeight(value: number);
    /**
     * [KO] 안개 최대 높이를 반환합니다. (baseHeight + thickness)
     * [EN] Returns the fog max height. (baseHeight + thickness)
     */
    get maxHeight(): number;
    /**
     * [KO] 안개 레이어 두께를 반환합니다.
     * [EN] Returns the fog layer thickness.
     */
    get thickness(): number;
    /**
     * [KO] 안개 레이어 두께를 설정합니다. (최소 0.1)
     * [EN] Sets the fog layer thickness. (Minimum 0.1)
     */
    set thickness(value: number);
    /**
     * [KO] 높이별 감쇠율을 반환합니다.
     * [EN] Returns the height falloff.
     */
    get falloff(): number;
    /**
     * [KO] 높이별 감쇠율을 설정합니다. (0.001 ~ 2)
     * [EN] Sets the height falloff. (0.001 ~ 2)
     */
    set falloff(value: number);
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
export default HeightFog;
