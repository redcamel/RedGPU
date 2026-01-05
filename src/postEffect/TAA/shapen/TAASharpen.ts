import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * TAA 전용 샤프닝 후처리 이펙트입니다.
 * TAA로 인해 발생하는 블러 현상을 복구합니다.
 */
class TAASharpen extends ASinglePassPostEffect {
    /** 샤프닝 강도. 기본값 0.5, 범위 0~1 */
    #sharpness: number = 0.5

    /**
     * TAASharpen 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_TAA_SHARPEN',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        )
        // 기본값 적용
        this.sharpness = 0.5;
    }

    /** 샤프닝 강도 반환 */
    get sharpness(): number {
        return this.#sharpness;
    }

    /**
     * 샤프닝 강도 설정
     * 범위: 0~1
     */
    set sharpness(value: number) {
        validateNumberRange(value, 0, 1)
        this.#sharpness = value;
        this.updateUniform('sharpness', value)
    }
}

Object.freeze(TAASharpen)
export default TAASharpen