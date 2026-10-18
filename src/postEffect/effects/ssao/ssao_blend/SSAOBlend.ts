import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";

/**
 * [KO] 계산된 SSAO 차폐 맵을 원본 이미지와 합성하는 내부 후처리 패스입니다.
 * [EN] Internal post-processing pass that blends the calculated SSAO occlusion map with the original image.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class SSAOBlend extends ASinglePassPostEffect {
    /**
     * [KO] SSAOBlend 인스턴스를 생성합니다.
     * [EN] Creates an SSAOBlend instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_SSAO_BLEND',
            createBasicPostEffectCode(
                this,
                computeCode,
                '',
                [
                    {name: 'sourceTexture0'},
                    {name: 'sourceTexture1'}
                ]
            )
        )
    }

}

Object.freeze(SSAOBlend)
export default SSAOBlend

