import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../postEffect/core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../postEffect/core/createBasicPostEffectCode";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] TAA 전용 AMD FidelityFX CAS(Contrast Adaptive Sharpening) 선명도 복원 패스입니다.
 * [EN] AMD FidelityFX CAS (Contrast Adaptive Sharpening) restoration pass for TAA.
 *
 * ::: warning
 * [KO] 이 클래스는 TAA 시스템 내부에서 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed internally by the TAA system.<br/>Do not create an instance directly.
 * :::
 *
 * @category PostEffect
 */
class TAACASPass extends ASinglePassPostEffect {
    #sharpness: number = 0.5;

    /**
     * [KO] TAACASPass 인스턴스를 생성합니다.
     * [EN] Creates a TAACASPass instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {x: 8, y: 8, z: 1});
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_TAA_CAS',
            createBasicPostEffectCode(
                this,
                computeCode,
                uniformStructCode,
                [{name: 'sourceTexture'}],
                false
            )
        );
        this.sharpness = this.#sharpness;
    }

    /**
     * [KO] 샤프닝 강도를 반환합니다.
     * [EN] Returns the sharpening strength.
     *
     * @returns [KO] 샤프닝 강도 (0.0 ~ 1.0, 기본값: 0.5) [EN] Sharpening strength (0.0 ~ 1.0, default: 0.5)
     */
    get sharpness(): number {
        return this.#sharpness;
    }

    /**
     * [KO] 샤프닝 강도를 설정합니다.
     * [EN] Sets the sharpening strength.
     *
     * @param value - [KO] 샤프닝 강도 (0.0 ~ 1.0) [EN] Sharpening strength (0.0 ~ 1.0)
     */
    set sharpness(value: number) {
        validateNumberRange(value, 0, 1);
        this.#sharpness = value;
        this.updateUniform('sharpness', value);
    }
}

Object.freeze(TAACASPass);
export default TAACASPass;
