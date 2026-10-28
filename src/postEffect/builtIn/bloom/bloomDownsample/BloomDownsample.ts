import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";

/**
 * [KO] 13-Tap Dual-Grid 등방성 커널을 사용하여 이전 단계의 블룸 밉 텍스처를 1/2 해상도로 다운샘플링하는 내부 패스입니다.
 * [EN] Internal pass that downsamples the previous bloom mip texture to 1/2 resolution using a 13-Tap Dual-Grid isotropic kernel.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Visual Effects
 */
class BloomDownsample extends ASinglePassPostEffect {
    /**
     * [KO] BloomDownsample 인스턴스를 생성합니다.
     * [EN] Creates a BloomDownsample instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_BLOOM_DOWNSAMPLE',
            createBasicPostEffectCode(this, computeCode)
        );
    }
}

Object.freeze(BloomDownsample);
export default BloomDownsample;
