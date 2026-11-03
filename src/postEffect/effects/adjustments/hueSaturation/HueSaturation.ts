import RedGPUContext from "../../../../context/RedGPUContext";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface HueSaturation {
    /**
     * [KO] 색상 회전 값 (단위: 도, -180 ~ 180)
     * [EN] Hue rotation value (unit: degrees, -180 ~ 180)
     * @defaultValue 0
     */
    hue: number;
    /**
     * [KO] 채도 조절 값 (-100 ~ 100)
     * [EN] Saturation adjustment value (-100 ~ 100)
     * @defaultValue 0
     */
    saturation: number;
}

/**
 * [KO] 이미지의 색상 톤(Hue)을 회전시키거나 전체 채도(Saturation)를 조절하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that rotates the color tone (Hue) or adjusts the overall saturation of an image.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.HueSaturation(redGPUContext);
 * effect.hue = 90;
 * effect.saturation = 50;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/hueSaturation/" style="width:100%; height:500px;"></iframe>
 *
 * @see [HueSaturation example](/RedGPU/examples/postEffect/adjustments/hueSaturation/)
 * @category Adjustments
 */
class HueSaturation extends ASinglePassPostEffect {

    /**
     * [KO] HueSaturation 인스턴스를 생성합니다.
     * [EN] Creates a HueSaturation instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.HueSaturation(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {isLdr: true});
        this.init(
            redGPUContext,
            'POST_EFFECT_HUE_SATURATION',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        if (this.hue === 0 && this.saturation === 0) return sourceTextureInfo;
        return super.render(view, width, height, sourceTextureInfo);
    }
}

defineNumber(HueSaturation, [
    {key: 'hue', value: 0, min: -180, max: 180},
    {key: 'saturation', value: 0, min: -100, max: 100}
]);
Object.freeze(HueSaturation);
export default HueSaturation;
