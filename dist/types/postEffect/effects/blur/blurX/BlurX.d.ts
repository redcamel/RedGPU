import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import { IPostEffectResult } from "../../../core/types";
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
 * <iframe src="/RedGPU/examples/postEffect/blur/blurX/"></iframe>
 *
 * @see [BlurX example](/RedGPU/examples/postEffect/blur/blurX/)
 * @category Blur
 */
declare class BlurX extends ASingleComputePassPostEffect {
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
    constructor(redGPUContext: RedGPUContext, options?: {
        isLdr?: boolean;
    });
    /**
     * [KO] 가로 방향(X축) 1차원 블러 효과를 렌더링합니다.
     * [EN] Renders the horizontal (X-axis) 1D blur effect.
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
     * [KO] 가로 블러가 적용된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Result texture information with horizontal blur applied (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default BlurX;
