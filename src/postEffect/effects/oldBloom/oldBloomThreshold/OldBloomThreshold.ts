import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";

interface OldBloomThreshold {
    /** [KO] 흑백 전환 기준 임계값 (1 ~ 255) [EN] Threshold value for binary conversion (1 ~ 255) */
    threshold: number;
}

/**
 * [KO] 올드 블룸 전용 임계값 추출(Old Bloom Threshold) 후처리 이펙트입니다.
 * [EN] Old Bloom dedicated threshold extraction post-processing effect.
 *
 * [KO] 1/2 다운샘플링 단계에서 안티앨리어싱 선형 보간을 적용하여 부드럽게 밝은 영역을 추출합니다.
 * [EN] Smoothly extracts bright regions with anti-aliasing linear interpolation in the 1/2 downsampling step.
 *
 * @category Visual Effects
 */
class OldBloomThreshold extends ASinglePassPostEffect {
    /**
     * [KO] OldBloomThreshold 인스턴스를 생성합니다.
     * [EN] Creates an OldBloomThreshold instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
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
