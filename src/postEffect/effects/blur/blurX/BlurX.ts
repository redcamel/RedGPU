import RedGPUContext from "../../../../context/RedGPUContext";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import View3D from "../../../../display/view/View3D";
import ASingleRenderPassPostEffect from "../../../core/ASingleRenderPassPostEffect";
import createBasicRenderPassPostEffectCode from "../../../core/createBasicRenderPassPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import fragmentCode from "./wgsl/fragmentCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface BlurX {
    /**
     * [KO] 블러 강도 (단위: 픽셀, 0 ~ 512)
     * [EN] Blur strength (unit: pixels, 0 ~ 512)
     * @defaultValue 32
     */
    size: number;
}

/**
 * [KO] X축 방향의 가우시안 블러 후처리 이펙트입니다.
 * [EN] Gaussian Blur post-processing effect in the X-axis direction.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.BlurX(redGPUContext);
 * effect.size = 64;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/blurX/" style="width:100%; height:500px;"></iframe>
 *
 * @see [BlurX example](/RedGPU/examples/postEffect/blur/blurX/)
 * @category Blur
 */
class BlurX extends ASingleRenderPassPostEffect {

    /**
     * [KO] BlurX 인스턴스를 생성합니다.
     * [EN] Creates a BlurX instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.BlurX(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param options -
     * [KO] 블러 생성 옵션. 기본값은 LDR(`isLdr: true`, `rgba8unorm`)이며, HDR 빌트인 패스(`LensFlare` 등) 내부에서 사용될 경우를 대비해 `isLdr: false`(`rgba16float`) 설정을 열어둡니다.
     * [EN] Blur creation options. Defaults to LDR (`isLdr: true`, `rgba8unorm`), and exposes `isLdr: false` (`rgba16float`) in case it is used inside an HDR built-in pass (e.g., `LensFlare`).
     */
    constructor(redGPUContext: RedGPUContext, options?: { isLdr?: boolean }) {
        const isLdr = options?.isLdr ?? true;
        super(redGPUContext, {isLdr, inPlace: false});
        this.init(
            redGPUContext,
            'POST_EFFECT_BLUR_X',
            createBasicRenderPassPostEffectCode(this, fragmentCode, uniformStructCode)
        );
    }

    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        if (this.size <= 0) return sourceTextureInfo;
        return super.render(view, width, height, sourceTextureInfo);
    }
}

definePositiveNumber(BlurX, [
    {key: 'size', value: 32, min: 0, max: 512}
]);
Object.freeze(BlurX);
export default BlurX;
