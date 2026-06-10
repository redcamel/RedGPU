import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
import defineNumber from "../../defineProperty/funcs/number/defineNumber";


interface AToneMappingEffect {
    contrast: number;
    brightness: number;
}

/**
 * [KO] 모든 톤 매핑 이펙트의 기본 추상 클래스입니다.
 * [EN] Base abstract class for all tone mapping effects.
 * @category ToneMapping
 */
class AToneMappingEffect extends ASinglePassPostEffect {

    /**
     * [KO] AToneMappingEffect 인스턴스를 생성합니다.
     * [EN] Creates an AToneMappingEffect instance.
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     */
    protected constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

}

defineNumber(AToneMappingEffect, [
    {key: 'contrast', value: 5.0, min: 0.5, max: 20.0},
    {key: 'brightness', value: 0.0, min: -1.0, max: 1.0}
])
Object.freeze(AToneMappingEffect);
export default AToneMappingEffect;
