import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import DefineGPUProperty from "../../defineProperty/DefineGPUProperty";

interface FXAA {
    /** [KO] 서브픽셀 필터링 강도. 값이 클수록 미세한 지터링과 계단 현상이 더 부드럽게 제거됩니다. [EN] Subpixel filtering intensity. Higher values remove fine jitter and aliasing more smoothly. */
    subpix: number
    /** [KO] 엣지 감지 임계값. 값이 작을수록 더 많은 영역을 엣지로 판단하여 처리합니다. [EN] Edge detection threshold. Lower values classify more areas as edges. */
    edgeThreshold: number
    /** [KO] 최소 엣지 임계값. 매우 어두운 영역에서 처리를 무시할 기준점입니다. [EN] Minimum edge threshold. Criterion to ignore processing in very dark areas. */
    edgeThresholdMin: number
}

/**
 * [KO] FXAA(Fast Approximate Anti-Aliasing) 후처리 이펙트입니다.
 * [EN] FXAA (Fast Approximate Anti-Aliasing) post-processing effect.
 *
 * [KO] 화면의 색상 대비(Luminance Contrast)를 분석하여 엣지 부분을 부드럽게 처리하는 저비용 안티앨리어싱 기법입니다. 별도의 기하학적 정보 없이 오직 이미지 정보를 이용하므로 연산 효율이 매우 우수합니다.
 * [EN] A low-cost anti-aliasing technique that smoothens edges by analyzing screen luminance contrast. It is highly computationally efficient as it relies solely on image information without requiring geometric data.
 *
 * [KO] 이 효과는 LDR 공간에서 동작하여 색상 대비 분석이 가장 정확하게 수행되도록 설계되었습니다.
 * [EN] This effect operates in LDR space, ensuring that color contrast analysis is performed most accurately.
 *
 * ::: warning
 * [KO] 이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
 * :::
 *
 * * ### Example
 * ```typescript
 * // [KO] AntialiasingManager를 통해 FXAA를 활성화합니다.
 * // [EN] Enable FXAA via AntialiasingManager.
 * redGPUContext.antialiasingManager.useFXAA = true;
 * ```
 *
 * @category PostEffect
 */
class FXAA extends ASinglePassPostEffect {
    /**
     * [KO] FXAA 인스턴스를 생성합니다.
     * [EN] Creates an FXAA instance.
     *
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.isLdr = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_FXAA',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

DefineGPUProperty.definePositiveNumber(FXAA, [
    {key: 'edgeThresholdMin', value: 0.0625, min: 0.00001, max: 0.1},
    {key: 'edgeThreshold', value: 0.125, min: 0.0001, max: 0.25},
    {key: 'subpix', value: 0.75, min: 0.0, max: 1},
])
Object.freeze(FXAA);
export default FXAA;
