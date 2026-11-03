import RedGPUContext from "../../../../context/RedGPUContext";
import defineBoolean from "../../../../defineProperty/funcs/defineBoolean";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

interface SSAOBlend {
    /**
     * [KO] GTAO 다중 반사(Multi-Bounce) 색감 보존 적용 여부
     * [EN] Whether to apply GTAO Multi-Bounce color preservation
     * @defaultValue true
     */
    useMultiBounce: boolean;
}

/**
 * [KO] 계산된 GTAO 차폐 맵을 양방향 업샘플링(Bilateral Upsample) 및 다중 반사(Multi-Bounce) 근사로 원본 Linear HDR 이미지와 합성하는 내부 후처리 패스입니다.
 * [EN] Internal post-processing pass that composites the calculated GTAO occlusion map with the original Linear HDR image using bilateral upsampling and Multi-Bounce approximation.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [SSAO example](/RedGPU/examples/postEffect/ssao/)
 * @category PostEffect
 */
class SSAOBlend extends ASinglePassPostEffect {
    /**
     * [KO] SSAOBlend 인스턴스를 생성합니다.
     * [EN] Creates an SSAOBlend instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1, isLdr: false});
        this.init(
            redGPUContext,
            'POST_EFFECT_SSAO_BLEND',
            createBasicPostEffectCode(
                this,
                computeCode,
                uniformStructCode,
                [
                    {name: 'sourceTexture0'},
                    {name: 'sourceTexture1'}
                ],
                true,
                false
            )
        );
    }
}

defineBoolean(SSAOBlend, [
    {key: 'useMultiBounce', value: true}
]);
Object.freeze(SSAOBlend);
export default SSAOBlend;
