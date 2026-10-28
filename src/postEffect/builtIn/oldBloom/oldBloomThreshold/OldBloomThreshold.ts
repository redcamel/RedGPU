import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";

interface OldBloomThreshold {
    /**
     * [KO] 밝은 영역 추출 기준 임계값 (1 ~ 255)
     * [EN] Threshold value for extracting bright areas (1 ~ 255)
     * @defaultValue 128
     */
    threshold: number;
}

/**
 * [KO] 올드 블룸(Old Bloom) 후처리의 밝은 영역 추출 단계를 수행하는 내부 후처리 패스입니다.
 * [EN] Internal post-processing pass that performs the bright region extraction step of Old Bloom.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [OldBloom example](/RedGPU/examples/postEffect/oldBloom/)
 * @category Visual Effects
 */
class OldBloomThreshold extends ASinglePassPostEffect {
    /**
     * [KO] OldBloomThreshold 인스턴스를 생성합니다.
     * [EN] Creates an OldBloomThreshold instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_OLD_BLOOM_THRESHOLD',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

definePositiveNumber(OldBloomThreshold, [
    {key: 'threshold', value: 128, min: 1, max: 255}
]);

Object.freeze(OldBloomThreshold);
export default OldBloomThreshold;
