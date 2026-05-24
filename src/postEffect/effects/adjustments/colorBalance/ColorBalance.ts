import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineGPUProperty from "../../../../defineProperty/DefineGPUProperty";

interface ColorBalance {
    highlightYellowBlue: number,
    highlightMagentaGreen: number,
    highlightCyanRed: number,
    //
    midtoneYellowBlue: number,
    midtoneMagentaGreen: number,
    midtoneCyanRed: number,
    //
    shadowYellowBlue: number,
    shadowMagentaGreen: number,
    shadowCyanRed: number,
    //
    preserveLuminosity: boolean
}

/**
 * [KO] 컬러 밸런스(Color Balance) 후처리 이펙트입니다.
 * [EN] Color Balance post-processing effect.
 *
 * [KO] 그림자의 시안-레드, 마젠타-그린, 옐로우-블루, 미드톤, 하이라이트 색상 밸런스를 조절합니다.
 * [EN] Adjusts the color balance of shadows, midtones, and highlights for Cyan-Red, Magenta-Green, and Yellow-Blue.
 *
 * [KO] 밝기 보존 옵션도 지원합니다.
 * [EN] Also supports luminosity preservation option.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.ColorBalance(redGPUContext);
 * effect.shadowCyanRed = 50;
 * effect.midtoneYellowBlue = -30;
 * effect.preserveLuminosity = true;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/colorBalance/"></iframe>
 * @category Adjustments
 */
class ColorBalance extends ASinglePassPostEffect {


    /**
     * [KO] ColorBalance 인스턴스를 생성합니다.
     * [EN] Creates a ColorBalance instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_COLOR_BALANCE',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

DefineGPUProperty.defineBoolean(ColorBalance, [
    {key: 'preserveLuminosity', value: true}
])
DefineGPUProperty.defineNumber(ColorBalance, [
    {key: 'highlightYellowBlue', value: 0, min: -100, max: 100},
    {key: 'highlightMagentaGreen', value: 0, min: -100, max: 100},
    {key: 'highlightCyanRed', value: 0, min: -100, max: 100},
    //
    {key: 'midtoneYellowBlue', value: 0, min: -100, max: 100},
    {key: 'midtoneMagentaGreen', value: 0, min: -100, max: 100},
    {key: 'midtoneCyanRed', value: 0, min: -100, max: 100},
    //
    {key: 'shadowYellowBlue', value: 0, min: -100, max: 100},
    {key: 'shadowMagentaGreen', value: 0, min: -100, max: 100},
    {key: 'shadowCyanRed', value: 0, min: -100, max: 100},

])
Object.freeze(ColorBalance)
export default ColorBalance
