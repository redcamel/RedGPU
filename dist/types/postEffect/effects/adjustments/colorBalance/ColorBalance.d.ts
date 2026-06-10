import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface ColorBalance {
    /** [KO] 하이라이트 영역의 노랑-파랑 밸런스 (-100 ~ 100) [EN] Yellow-Blue balance in highlight areas (-100 ~ 100) */
    highlightYellowBlue: number;
    /** [KO] 하이라이트 영역의 마젠타-초록 밸런스 (-100 ~ 100) [EN] Magenta-Green balance in highlight areas (-100 ~ 100) */
    highlightMagentaGreen: number;
    /** [KO] 하이라이트 영역의 시안-빨강 밸런스 (-100 ~ 100) [EN] Cyan-Red balance in highlight areas (-100 ~ 100) */
    highlightCyanRed: number;
    /** [KO] 미드톤 영역의 노랑-파랑 밸런스 (-100 ~ 100) [EN] Yellow-Blue balance in midtone areas (-100 ~ 100) */
    midtoneYellowBlue: number;
    /** [KO] 미드톤 영역의 마젠타-초록 밸런스 (-100 ~ 100) [EN] Magenta-Green balance in midtone areas (-100 ~ 100) */
    midtoneMagentaGreen: number;
    /** [KO] 미드톤 영역의 시안-빨강 밸런스 (-100 ~ 100) [EN] Cyan-Red balance in midtone areas (-100 ~ 100) */
    midtoneCyanRed: number;
    /** [KO] 쉐도우 영역의 노랑-파랑 밸런스 (-100 ~ 100) [EN] Yellow-Blue balance in shadow areas (-100 ~ 100) */
    shadowYellowBlue: number;
    /** [KO] 쉐도우 영역의 마젠타-초록 밸런스 (-100 ~ 100) [EN] Magenta-Green balance in shadow areas (-100 ~ 100) */
    shadowMagentaGreen: number;
    /** [KO] 쉐도우 영역의 시안-빨강 밸런스 (-100 ~ 100) [EN] Cyan-Red balance in shadow areas (-100 ~ 100) */
    shadowCyanRed: number;
    /** [KO] 밝기 보존 여부 (true 시 색상 변경 후에도 휘도를 일정하게 유지) [EN] Whether to preserve luminosity (maintains constant luminance after color changes if true) */
    preserveLuminosity: boolean;
}
/**
 * [KO] 컬러 밸런스(Color Balance) 후처리 이펙트입니다.
 * [EN] Color Balance post-processing effect.
 *
 * [KO] 이미지의 밝기 영역(Shadow, Midtone, Highlight)별로 RGB 채널의 밸런스를 정밀하게 조절합니다.
 * [EN] Precisely adjusts the balance of RGB channels for each brightness range (Shadow, Midtone, Highlight) of the image.
 *
 * [KO] 각 영역의 시안-레드, 마젠타-그린, 옐로우-블루 축을 조절하여 전체적인 톤과 분위기를 변경할 수 있습니다.
 * [EN] You can change the overall tone and mood by adjusting the Cyan-Red, Magenta-Green, and Yellow-Blue axes of each area.
 *
 * [KO] 이 효과는 LDR 공간에서 동작할 때 가장 예측 가능한 결과를 제공합니다.
 * [EN] This effect provides the most predictable results when operating in LDR space.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
 * effect.shadowCyanRed = 50;         // 그림자 영역에 레드 추가
 * effect.midtoneYellowBlue = -30;    // 미드톤 영역에 옐로우 추가
 * effect.preserveLuminosity = true;   // 밝기 변화 억제
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/colorBalance/"></iframe>
 * @category Adjustments
 */
declare class ColorBalance extends ASinglePassPostEffect {
    /**
     * [KO] ColorBalance 인스턴스를 생성합니다.
     * [EN] Creates a ColorBalance instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
}
export default ColorBalance;
