import RedGPUContext from "../../../../context/RedGPUContext";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import View3D from "../../../../display/view/View3D";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import createBasicComputePassPostEffectCode from "../../../core/createBasicComputePassPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface Vibrance {
    /**
     * [KO] 바이브런스 조절 값 (-100 ~ 100)
     * [EN] Vibrance adjustment value (-100 ~ 100)
     * @defaultValue 0
     */
    vibrance: number;
    /**
     * [KO] 채도 조절 값 (-100 ~ 100)
     * [EN] Saturation adjustment value (-100 ~ 100)
     * @defaultValue 0
     */
    saturation: number;
}

/**
 * [KO] 과포화를 방지하면서 채도가 낮은 영역의 색감을 자연스럽게 강조하는 바이브런스/채도 후처리 이펙트입니다.
 * [EN] Vibrance/Saturation post-processing effect that naturally enhances low-saturation areas while preventing over-saturation.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Vibrance(redGPUContext);
 * effect.vibrance = 40;
 * effect.saturation = 20;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/vibrance/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Vibrance example](/RedGPU/examples/postEffect/adjustments/vibrance/)
 * @category Adjustments
 */
class Vibrance extends ASingleComputePassPostEffect {

    /**
     * [KO] Vibrance 인스턴스를 생성합니다.
     * [EN] Creates a Vibrance instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Vibrance(redGPUContext);
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
            'POST_EFFECT_VIBRANCE',
            createBasicComputePassPostEffectCode(this, computeCode, uniformStructCode, undefined, true, false)
        );
    }

    /**
     * [KO] 생동감(Vibrance) 및 채도 조절 효과를 렌더링합니다.
     * [EN] Renders the vibrance and saturation adjustment effect.
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
     * [KO] 생동감이 적용된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Result texture information with vibrance applied (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        if (this.vibrance === 0 && this.saturation === 0) return sourceTextureInfo;
        return super.render(view, width, height, sourceTextureInfo);
    }
}

defineNumber(Vibrance, [
    {key: 'vibrance', value: 0, min: -100, max: 100},
    {key: 'saturation', value: 0, min: -100, max: 100}
]);

Object.freeze(Vibrance);
export default Vibrance;
