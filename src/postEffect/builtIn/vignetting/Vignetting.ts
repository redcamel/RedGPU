import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASingleRenderPassPostEffect from "../../core/ASingleRenderPassPostEffect";
import createBasicRenderPassPostEffectCode from "../../core/createBasicRenderPassPostEffectCode";
import {IPostEffectResult} from "../../core/types";
import fragmentCode from "./wgsl/fragmentCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import definePositiveNumber from "../../../defineProperty/funcs/number/definePositiveNumber";


interface Vignetting {
    /**
     * [KO] 비네팅 감광 강도 (0 이상, 기본값 0.4)
     * [EN] Vignette darkening intensity (0 or greater, default 0.4)
     * @defaultValue 0.4
     */
    intensity: number;
}

/**
 * [KO] 실제 카메라 렌즈의 물리 광학 법칙(cos⁴θ)을 기반으로 화면 외곽 광량을 정원형으로 자연스럽게 감쇠시키는 비네팅(Vignetting) 후처리 이펙트입니다.
 * [EN] Vignetting post-processing effect that naturally attenuates peripheral light in a circular pattern based on physical camera lens optics (cos⁴θ law).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 builtInEffectManager를 통해 Vignetting 활성화 및 강도 설정
 * // [EN] Enable Vignetting and configure intensity through View3D's builtInEffectManager
 * view.builtInEffectManager.useVignetting = true;
 * view.builtInEffectManager.vignetting.intensity = 0.4;
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/vignetting/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Vignetting example](/RedGPU/examples/postEffect/lens/vignetting/)
 * @category PostEffect
 */
class Vignetting extends ASingleRenderPassPostEffect {

    /**
     * [KO] Vignetting 인스턴스를 생성합니다.
     * [EN] Creates a Vignetting instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {
            isLdr: true,
            blendState: {
                color: {
                    srcFactor: 'dst',
                    dstFactor: 'zero',
                    operation: 'add'
                },
                alpha: {
                    srcFactor: 'zero',
                    dstFactor: 'one',
                    operation: 'add'
                }
            }
        });
        this.init(
            redGPUContext,
            'POST_EFFECT_VIGNETTING',
            createBasicRenderPassPostEffectCode(fragmentCode, uniformStructCode, undefined, false)
        );
    }

    /**
     * [KO] 비네팅 후처리 이펙트를 렌더링합니다.
     * [EN] Renders the vignetting post-processing effect.
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
     * [KO] 렌더링 결과 (`IPostEffectResult`)
     * [EN] Rendering result (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        if (this.intensity <= 0) return sourceTextureInfo;
        return super.render(view, width, height, sourceTextureInfo);
    }

}

definePositiveNumber(Vignetting, [
    {key: 'intensity', value: 0.4},
]);
Object.freeze(Vignetting);
export default Vignetting;
