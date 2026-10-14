import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../postEffect/core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../postEffect/core/createBasicPostEffectCode";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] TAA 후속 AMD FidelityFX CAS(Contrast Adaptive Sharpening) 선명도 복원 패스 클래스입니다.
 * [EN] AMD FidelityFX CAS (Contrast Adaptive Sharpening) restoration pass class following TAA.
 *
 * [KO] 톤매핑이 완료된 LDR(Low Dynamic Range) 화면 공간에서 3x3 국소 픽셀 대비를 분석하여 링잉(Ringing) 현상을 억제하면서 TAA 시간적 누적으로 인해 약화된 고주파 선명도를 복원합니다. `TAA` 인스턴스 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Analyzes 3x3 local pixel contrast in LDR (Low Dynamic Range) screen space after tone mapping to restore high-frequency sharpness attenuated by TAA temporal accumulation while suppressing ringing artifacts. Automatically created internally when a `TAA` instance is instantiated.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const casPass = view.taa.casPass;
 * casPass.sharpness = 0.5;
 * ```
 *
 * @category Antialiasing
 */
class TAACASPass extends ASinglePassPostEffect {
    #sharpness: number = 0.5;

    /**
     * [KO] `TAACASPass` 인스턴스를 생성합니다.
     * [EN] Creates a `TAACASPass` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
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
     * [KO] CAS 샤프닝(선명도 복원) 강도를 반환합니다.
     * [EN] Returns the CAS sharpening (sharpness restoration) strength.
     *
     * ### Example
     * ```typescript
     * const sharpness = view.taa.casPass.sharpness;
     * ```
     *
     * @returns
     * [KO] 샤프닝 강도 (`0.0` ~ `1.0`, 기본값: `0.5`)
     * [EN] Sharpening strength (`0.0` to `1.0`, default: `0.5`)
     */
    get sharpness(): number {
        return this.#sharpness;
    }

    /**
     * [KO] CAS 샤프닝(선명도 복원) 강도를 설정합니다. 유효 범위는 `0.0` ~ `1.0`입니다.
     * [EN] Sets the CAS sharpening (sharpness restoration) strength. Valid range is `0.0` to `1.0`.
     *
     * ### Example
     * ```typescript
     * view.taa.casPass.sharpness = 0.6;
     * ```
     *
     * @param value -
     * [KO] 샤프닝 강도 (`0.0` ~ `1.0`)
     * [EN] Sharpening strength (`0.0` to `1.0`)
     */
    set sharpness(value: number) {
        validateNumberRange(value, 0, 1);
        this.#sharpness = value;
        this.updateUniform('sharpness', value);
    }
}

Object.freeze(TAACASPass);
export default TAACASPass;

