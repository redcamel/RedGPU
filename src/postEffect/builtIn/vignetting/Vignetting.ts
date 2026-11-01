import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
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
class Vignetting extends ASinglePassPostEffect {

    /**
     * [KO] Vignetting 인스턴스를 생성합니다.
     * [EN] Creates a Vignetting instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1, isLdr: true});
        this.init(
            redGPUContext,
            'POST_EFFECT_VIGNETTING',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

}

definePositiveNumber(Vignetting, [
    {key: 'intensity', value: 0.4},
]);
Object.freeze(Vignetting);
export default Vignetting;
