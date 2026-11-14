import RedGPUContext from "../../../../context/RedGPUContext";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import View3D from "../../../../display/view/View3D";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import createBasicComputePassPostEffectCode from "../../../core/createBasicComputePassPostEffectCode";
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
 * <iframe src="/RedGPU/examples/postEffect/adjustments/hueSaturation/"></iframe>
 *
 * @see [HueSaturation example](/RedGPU/examples/postEffect/adjustments/hueSaturation/)
 * @category Adjustments
 */
class HueSaturation extends ASingleComputePassPostEffect {

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
            createBasicComputePassPostEffectCode(this, computeCode, uniformStructCode, undefined, true, false)
        );
    }

    /**
     * [KO] 색조 및 채도(Hue & Saturation) 조절 효과를 렌더링합니다.
     * [EN] Renders the hue and saturation adjustment effect.
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
     * [KO] 색조 및 채도가 적용된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Result texture information with hue and saturation applied (`IPostEffectResult`)
     */
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
