import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";

interface BloomPrefilter {
    /**
     * [KO] 블룸이 시작되는 선형 HDR 휘도 임계값 (0.0 ~ 20.0)
     * [EN] Linear HDR luminance threshold where bloom begins (0.0 ~ 20.0)
     * @defaultValue 1.0
     */
    threshold: number;
    /**
     * [KO] 임계값 전이 구간의 부드러운 2차 곡선(Soft-Knee) 비율 (0.0 ~ 1.0)
     * [EN] Soft-Knee quadratic curve ratio in the threshold transition zone (0.0 ~ 1.0)
     * @defaultValue 0.5
     */
    softKnee: number;
    /**
     * [KO] 파이어플라이 폭주 방지를 위한 최대 HDR 휘도 클램프 (1.0 ~ 200.0)
     * [EN] Maximum HDR luminance clamp to prevent firefly spikes (1.0 ~ 200.0)
     * @defaultValue 32.0
     */
    maxBrightness: number;
}

/**
 * [KO] 원본 HDR 씬에서 13-Tap Dual-Grid 다운샘플링, Soft-Knee 임계값 추출 및 Karis 가중 평균을 수행하는 내부 프리필터 패스입니다.
 * [EN] Internal prefilter pass that performs 13-Tap Dual-Grid downsampling, Soft-Knee threshold extraction, and Karis weighted averaging from the original HDR scene.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Visual Effects
 */
class BloomPrefilter extends ASinglePassPostEffect {
    /**
     * [KO] BloomPrefilter 인스턴스를 생성합니다.
     * [EN] Creates a BloomPrefilter instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_BLOOM_PREFILTER',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

definePositiveNumber(BloomPrefilter, [
    {key: 'threshold', value: 1.0, min: 0.0, max: 20.0},
    {key: 'softKnee', value: 0.5, min: 0.0, max: 1.0},
    {key: 'maxBrightness', value: 32.0, min: 1.0, max: 200.0},
]);
Object.freeze(BloomPrefilter);
export default BloomPrefilter;
