import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import defineBoolean from "../../../../defineProperty/funcs/defineBoolean";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";


interface ColorBalance {
    /**
     * [KO] 하이라이트 영역의 노랑-파랑 밸런스 (범위: `-100` ~ `100`, 기본값: `0`)
     * [EN] Yellow-Blue balance in highlight areas (range: `-100` to `100`, default: `0`)
     */
    highlightYellowBlue: number,
    /**
     * [KO] 하이라이트 영역의 마젠타-초록 밸런스 (범위: `-100` ~ `100`, 기본값: `0`)
     * [EN] Magenta-Green balance in highlight areas (range: `-100` to `100`, default: `0`)
     */
    highlightMagentaGreen: number,
    /**
     * [KO] 하이라이트 영역의 시안-빨강 밸런스 (범위: `-100` ~ `100`, 기본값: `0`)
     * [EN] Cyan-Red balance in highlight areas (range: `-100` to `100`, default: `0`)
     */
    highlightCyanRed: number,

    /**
     * [KO] 미드톤 영역의 노랑-파랑 밸런스 (범위: `-100` ~ `100`, 기본값: `0`)
     * [EN] Yellow-Blue balance in midtone areas (range: `-100` to `100`, default: `0`)
     */
    midtoneYellowBlue: number,
    /**
     * [KO] 미드톤 영역의 마젠타-초록 밸런스 (범위: `-100` ~ `100`, 기본값: `0`)
     * [EN] Magenta-Green balance in midtone areas (range: `-100` to `100`, default: `0`)
     */
    midtoneMagentaGreen: number,
    /**
     * [KO] 미드톤 영역의 시안-빨강 밸런스 (범위: `-100` ~ `100`, 기본값: `0`)
     * [EN] Cyan-Red balance in midtone areas (range: `-100` to `100`, default: `0`)
     */
    midtoneCyanRed: number,

    /**
     * [KO] 쉐도우 영역의 노랑-파랑 밸런스 (범위: `-100` ~ `100`, 기본값: `0`)
     * [EN] Yellow-Blue balance in shadow areas (range: `-100` to `100`, default: `0`)
     */
    shadowYellowBlue: number,
    /**
     * [KO] 쉐도우 영역의 마젠타-초록 밸런스 (범위: `-100` ~ `100`, 기본값: `0`)
     * [EN] Magenta-Green balance in shadow areas (range: `-100` to `100`, default: `0`)
     */
    shadowMagentaGreen: number,
    /**
     * [KO] 쉐도우 영역의 시안-빨강 밸런스 (범위: `-100` ~ `100`, 기본값: `0`)
     * [EN] Cyan-Red balance in shadow areas (range: `-100` to `100`, default: `0`)
     */
    shadowCyanRed: number,

    /**
     * [KO] 색상 변경 후 원본 휘도(밝기) 보존 여부 (기본값: `true`)
     * [EN] Whether to preserve original luminosity after color changes (default: `true`)
     */
    preserveLuminosity: boolean
}

/**
 * [KO] 밝기 영역(Shadow, Midtone, Highlight)별로 시안-레드, 마젠타-그린, 옐로우-블루 색상 채널 밸런스를 조절하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that adjusts Cyan-Red, Magenta-Green, and Yellow-Blue channel balances across Shadow, Midtone, and Highlight brightness ranges.
 *
 * [KO] LDR 공간에서 동작합니다.
 * [EN] Operates in LDR space.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
 * // [KO] 그림자 영역에 레드 추가 및 미드톤에 옐로우 추가
 * // [EN] Add red to shadows and yellow to midtones
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
class ColorBalance extends ASinglePassPostEffect {

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
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_COLOR_BALANCE',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

defineBoolean(ColorBalance, [
    {key: 'preserveLuminosity', value: true}
])
defineNumber(ColorBalance, [
    {key: 'highlightYellowBlue', value: 0, min: -100, max: 100},
    {key: 'highlightMagentaGreen', value: 0, min: -100, max: 100},
    {key: 'highlightCyanRed', value: 0, min: -100, max: 100},
    {key: 'midtoneYellowBlue', value: 0, min: -100, max: 100},
    {key: 'midtoneMagentaGreen', value: 0, min: -100, max: 100},
    {key: 'midtoneCyanRed', value: 0, min: -100, max: 100},
    {key: 'shadowYellowBlue', value: 0, min: -100, max: 100},
    {key: 'shadowMagentaGreen', value: 0, min: -100, max: 100},
    {key: 'shadowCyanRed', value: 0, min: -100, max: 100},

])
Object.freeze(ColorBalance)
export default ColorBalance
