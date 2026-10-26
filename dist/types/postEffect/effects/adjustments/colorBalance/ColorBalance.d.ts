import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface ColorBalance {
    /**
     * [KO] 하이라이트 영역의 노랑-파랑 밸런스 (-100 ~ 100)
     * [EN] Yellow-Blue balance in highlight areas (-100 ~ 100)
     * @defaultValue 0
     */
    highlightYellowBlue: number;
    /**
     * [KO] 하이라이트 영역의 마젠타-초록 밸런스 (-100 ~ 100)
     * [EN] Magenta-Green balance in highlight areas (-100 ~ 100)
     * @defaultValue 0
     */
    highlightMagentaGreen: number;
    /**
     * [KO] 하이라이트 영역의 시안-빨강 밸런스 (-100 ~ 100)
     * [EN] Cyan-Red balance in highlight areas (-100 ~ 100)
     * @defaultValue 0
     */
    highlightCyanRed: number;
    /**
     * [KO] 미드톤 영역의 노랑-파랑 밸런스 (-100 ~ 100)
     * [EN] Yellow-Blue balance in midtone areas (-100 ~ 100)
     * @defaultValue 0
     */
    midtoneYellowBlue: number;
    /**
     * [KO] 미드톤 영역의 마젠타-초록 밸런스 (-100 ~ 100)
     * [EN] Magenta-Green balance in midtone areas (-100 ~ 100)
     * @defaultValue 0
     */
    midtoneMagentaGreen: number;
    /**
     * [KO] 미드톤 영역의 시안-빨강 밸런스 (-100 ~ 100)
     * [EN] Cyan-Red balance in midtone areas (-100 ~ 100)
     * @defaultValue 0
     */
    midtoneCyanRed: number;
    /**
     * [KO] 쉐도우 영역의 노랑-파랑 밸런스 (-100 ~ 100)
     * [EN] Yellow-Blue balance in shadow areas (-100 ~ 100)
     * @defaultValue 0
     */
    shadowYellowBlue: number;
    /**
     * [KO] 쉐도우 영역의 마젠타-초록 밸런스 (-100 ~ 100)
     * [EN] Magenta-Green balance in shadow areas (-100 ~ 100)
     * @defaultValue 0
     */
    shadowMagentaGreen: number;
    /**
     * [KO] 쉐도우 영역의 시안-빨강 밸런스 (-100 ~ 100)
     * [EN] Cyan-Red balance in shadow areas (-100 ~ 100)
     * @defaultValue 0
     */
    shadowCyanRed: number;
    /**
     * [KO] 색상 변경 후 원본 휘도(밝기) 보존 여부
     * [EN] Whether to preserve original luminosity after color changes
     * @defaultValue true
     */
    preserveLuminosity: boolean;
}
/**
 * [KO] 밝기 영역(Shadow, Midtone, Highlight)별로 시안-레드, 마젠타-그린, 옐로우-블루 색상 채널 밸런스를 조절하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that adjusts Cyan-Red, Magenta-Green, and Yellow-Blue channel balances across Shadow, Midtone, and Highlight brightness ranges.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
 * effect.shadowCyanRed = 50;
 * effect.midtoneYellowBlue = -30;
 * effect.preserveLuminosity = true;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/colorBalance/" style="width:100%; height:500px;"></iframe>
 *
 * @see [ColorBalance example](/RedGPU/examples/postEffect/adjustments/colorBalance/)
 * @category Adjustments
 */
declare class ColorBalance extends ASinglePassPostEffect {
    /**
     * [KO] ColorBalance 인스턴스를 생성합니다.
     * [EN] Creates a ColorBalance instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default ColorBalance;
