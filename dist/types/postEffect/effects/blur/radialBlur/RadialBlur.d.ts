import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import { IPostEffectResult } from "../../../core/types";
interface RadialBlur {
    /**
     * [KO] 블러 강도 (0 이상)
     * [EN] Blur strength (0 or greater)
     * @defaultValue 50
     */
    amount: number;
    /**
     * [KO] 블러 중심점 X 오프셋 (단위: 픽셀, 0 = 화면 중앙)
     * [EN] Blur center X offset (unit: pixels, 0 = screen center)
     * @defaultValue 0
     */
    centerX: number;
    /**
     * [KO] 블러 중심점 Y 오프셋 (단위: 픽셀, 0 = 화면 중앙)
     * [EN] Blur center Y offset (unit: pixels, 0 = screen center)
     * @defaultValue 0
     */
    centerY: number;
    /**
     * [KO] 샘플링 횟수 (2 ~ 100)
     * [EN] Number of samples (2 ~ 100)
     * @defaultValue 16
     */
    sampleCount: number;
}
/**
 * [KO] 화면의 특정 지점을 기준으로 회전 번짐을 적용하는 방사형 회전 블러 후처리 이펙트입니다.
 * [EN] Radial Blur post-processing effect that applies rotational blur around a specific screen point.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.RadialBlur(redGPUContext);
 * effect.amount = 50;
 * effect.sampleCount = 16;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/blur/radialBlur/"></iframe>
 *
 * @see [RadialBlur example](/RedGPU/examples/postEffect/blur/radialBlur/)
 * @category Blur
 */
declare class RadialBlur extends ASingleComputePassPostEffect {
    /**
     * [KO] RadialBlur 인스턴스를 생성합니다.
     * [EN] Creates a RadialBlur instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.RadialBlur(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 방사형 회전 블러(Radial Blur) 효과를 렌더링합니다.
     * [EN] Renders the radial rotational blur effect.
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
     * [KO] 방사형 블러가 적용된 결과 텍스처 정보 (`IPostEffectResult`)
     * [EN] Result texture information with radial blur applied (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult;
}
export default RadialBlur;
