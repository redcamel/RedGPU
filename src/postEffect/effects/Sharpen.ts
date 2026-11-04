import RedGPUContext from "../../context/RedGPUContext";
import ASingleComputePassPostEffect from "../core/ASingleComputePassPostEffect";
import createBasicComputePassPostEffectCode from "../core/createBasicComputePassPostEffectCode";
import Convolution from "./convolution/Convolution";
import computeCode from "./convolution/wgsl/computeCode.wgsl";
import uniformStructCode from "./convolution/wgsl/uniformStructCode.wgsl";

/**
 * [KO] 컨볼루션 커널을 사용하여 인접 픽셀 간 대비를 높이고 경계를 선명하게 강조하는 샤픈(Sharpen) 후처리 이펙트입니다.
 * [EN] Sharpen post-processing effect that enhances edges and details by increasing contrast between adjacent pixels using a convolution kernel.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Sharpen(redGPUContext);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/sharpen/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Sharpen example](/RedGPU/examples/postEffect/sharpen/)
 * @category PostEffect
 */
class Sharpen extends ASingleComputePassPostEffect {
    /**
     * [KO] Sharpen 인스턴스를 생성합니다.
     * [EN] Creates a Sharpen instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Sharpen(redGPUContext);
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
            'POST_EFFECT_CONVOLUTION',
            createBasicComputePassPostEffectCode(this, computeCode, uniformStructCode, undefined, true, false)
        );
        let kernelWeight = 0;
        for (let i = 0, len = Convolution.SHARPEN.length; i < len; i++) {
            kernelWeight += Convolution.SHARPEN[i];
        }
        this.updateUniform('kernelWeight', kernelWeight || 1);
        this.updateUniform('kernel', Convolution.SHARPEN);
    }
}

Object.freeze(Sharpen)
export default Sharpen
