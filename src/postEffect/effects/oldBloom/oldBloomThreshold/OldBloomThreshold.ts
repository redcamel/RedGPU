import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";

interface OldBloomThreshold {
    /**
     * [KO] 밝은 영역 추출 기준 임계값 (범위: 1 ~ 255, 기본값: 128)
     * [EN] Threshold value for extracting bright areas (range: 1 ~ 255, default: 128)
     */
    threshold: number;
}

/**
 * [KO] 올드 블룸(Old Bloom) 후처리의 밝은 영역 추출 단계를 수행하는 내부 이펙트 클래스입니다.
 * [EN] Internal effect class that performs the bright region extraction step of Old Bloom post-processing.
 *
 * [KO] 1/2 다운샘플링 단계에서 선형 보간을 적용하여 임계값 이상의 밝은 영역을 추출하며, 시스템(OldBloom)에 의해 자동으로 생성됩니다.
 * [EN] Extracts bright regions above the threshold using linear interpolation during the 1/2 downsampling step, and is automatically created by the system (OldBloom).
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
        super(redGPUContext, {isLdr: true});
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
