import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../postEffect/core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../postEffect/core/createBasicPostEffectCode";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] TAA(Temporal Anti-Aliasing) 적용 후 시간적 재투영으로 인해 미세하게 손실된 고주파 디테일을 복원하는 CAS(Contrast Adaptive Sharpening) 후처리 패스 클래스입니다.
 * [EN] CAS (Contrast Adaptive Sharpening) post-processing pass class that restores fine high-frequency details slightly softened by temporal reprojection in TAA (Temporal Anti-Aliasing).
 *
 * [KO] 픽셀 주변의 로컬 대비(Contrast)를 분석하여 이미 대비가 높은 경계선의 링잉(Ringing)이나 헤일로(Halo) 현상을 억제하면서 저대비 디테일 영역을 적응형으로 선명하게 보정합니다.
 * [EN] Analyzes local pixel contrast to adaptively sharpen low-contrast detail regions while suppressing ringing and halo artifacts along high-contrast edges.
 *
 * ::: info
 * [KO] 이 패스는 `TAA` 내부에 포함되어 톤매핑 이후 LDR 색 공간(`isLdr = true`)에서 자동으로 실행됩니다.
 * [EN] This pass is embedded within `TAA` and executes automatically in LDR color space (`isLdr = true`) after tone mapping.
 * :::
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] TAA 인스턴스를 통해 샤프닝 강도 제어
 * // [EN] Control sharpening strength via the TAA instance
 * view.taa.sharpness = 0.5;
 * ```
 *
 * @category Antialiasing
 */
class TAACASPass extends ASinglePassPostEffect {
    #sharpness: number = 0.5;

    /**
     * [KO] `TAACASPass` 인스턴스를 초기화합니다.
     * [EN] Initializes the `TAACASPass` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
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
     * [KO] 적응형 샤프닝(CAS) 강도를 반환하거나 설정합니다.
     * [EN] Gets or sets the Contrast Adaptive Sharpening (CAS) strength.
     *
     * [KO] 허용 범위는 `0.0` ~ `1.0`이며 기본값은 `0.5`입니다.
     * [EN] Valid range is `0.0` to `1.0`, and the default value is `0.5`.
     *
     * @throws
     * [KO] `value`가 `0.0` ~ `1.0` 범위를 벗어날 경우 에러가 발생합니다.
     * [EN] Throws an error if `value` is outside the `0.0` to `1.0` range.
     */
    get sharpness(): number {
        return this.#sharpness;
    }

    set sharpness(value: number) {
        validateNumberRange(value, 0, 1);
        this.#sharpness = value;
        this.updateUniform('sharpness', value);
    }
}

Object.freeze(TAACASPass);
export default TAACASPass;
