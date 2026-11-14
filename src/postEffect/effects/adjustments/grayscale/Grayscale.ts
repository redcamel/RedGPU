import RedGPUContext from "../../../../context/RedGPUContext";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import View3D from "../../../../display/view/View3D";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import createBasicComputePassPostEffectCode from "../../../core/createBasicComputePassPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface Grayscale {
    /**
     * [KO] 흑백 효과 적용 강도 (0 ~ 1)
     * [EN] Grayscale effect application intensity (0 ~ 1)
     * @defaultValue 1
     */
    amount: number;
}

/**
 * [KO] 표준 휘도 가중치(Rec. 709)를 사용하여 컬러 이미지를 흑백으로 변환하는 후처리 이펙트입니다.
 * [EN] Post-processing effect that converts color images to grayscale using standard luminance weights (Rec. 709).
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Grayscale(redGPUContext);
 * effect.amount = 0.5;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/adjustments/grayscale/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Grayscale example](/RedGPU/examples/postEffect/adjustments/grayscale/)
 * @category Adjustments
 */
class Grayscale extends ASingleComputePassPostEffect {
    /**
     * [KO] Grayscale 인스턴스를 생성합니다.
     * [EN] Creates a Grayscale instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Grayscale(redGPUContext);
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
            'POST_EFFECT_GRAYSCALE',
            createBasicComputePassPostEffectCode(this, computeCode, uniformStructCode, undefined, true, false)
        );
    }

    /**
     * [KO] 흑백(Grayscale) 효과를 렌더링합니다.
     * [EN] Renders the grayscale effect.
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
     * [KO] 흑백 효과가 적용된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Result texture information with grayscale applied (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        if (this.amount <= 0) return sourceTextureInfo;
        return super.render(view, width, height, sourceTextureInfo);
    }
}

definePositiveNumber(Grayscale, [
    {key: 'amount', value: 1, min: 0, max: 1}
]);
Object.freeze(Grayscale);
export default Grayscale;
