import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import definePositiveNumber from "../../defineProperty/funcs/number/definePositiveNumber";

/**
 * [KO] `FXAA` 클래스의 동적 정의 프로퍼티 인터페이스입니다.
 * [EN] Interface for dynamically defined properties of the `FXAA` class.
 */
interface FXAA {
    /**
     * [KO] 서브픽셀 안티앨리어싱 강도입니다. 범위는 `0.0` ~ `1.0`이며 기본값은 `0.75`입니다. 값이 클수록 미세한 고주파 노이즈와 지터링이 부드럽게 완화됩니다.
     * [EN] Subpixel anti-aliasing intensity. Ranges from `0.0` to `1.0` with a default of `0.75`. Higher values smoothly attenuate fine high-frequency noise and jittering.
     */
    subpix: number
    /**
     * [KO] 로컬 대비 기반 엣지 검출 임계값입니다. 범위는 `0.0001` ~ `0.25`이며 기본값은 `0.125`입니다. 값이 작을수록 더 많은 영역을 엣지로 판별하여 필터링합니다.
     * [EN] Edge detection threshold based on local contrast. Ranges from `0.0001` to `0.25` with a default of `0.125`. Lower values classify more regions as edges for filtering.
     */
    edgeThreshold: number
    /**
     * [KO] 어두운 영역에서 불필요한 엣지 처리를 건너뛰기 위한 최소 대비 임계값입니다. 범위는 `0.00001` ~ `0.1`이며 기본값은 `0.0625`입니다.
     * [EN] Minimum contrast threshold to skip unnecessary edge processing in dark regions. Ranges from `0.00001` to `0.1` with a default of `0.0625`.
     */
    edgeThresholdMin: number
}

/**
 * [KO] FXAA(Fast Approximate Anti-Aliasing) 후처리 안티앨리어싱 이펙트 클래스입니다.
 * [EN] FXAA (Fast Approximate Anti-Aliasing) post-processing anti-aliasing effect class.
 *
 * [KO] 톤매핑 이후의 LDR(Low Dynamic Range) 화면 공간에서 픽셀 간 휘도 대비(Luminance Contrast)를 분석하여 계단 현상(Aliasing)이 발생한 외곽선을 검출하고 부드럽게 보간합니다. 기하 정보나 히스토리 버퍼 없이 단일 컴퓨트 패스로 동작하므로 연산 비용이 매우 낮습니다.
 * [EN] Analyzes pixel luminance contrast in LDR (Low Dynamic Range) screen space after tone mapping to detect and smoothly interpolate aliased edges. Operates in a single compute pass without geometric data or history buffers, offering very low computational cost.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * redGPUContext.antialiasingManager.useFXAA = true;
 *
 * const fxaa = view.fxaa;
 * fxaa.subpix = 0.75;
 * fxaa.edgeThreshold = 0.125;
 * fxaa.edgeThresholdMin = 0.0625;
 * ```
 *
 * @category Antialiasing
 */
class FXAA extends ASinglePassPostEffect {
    /**
     * [KO] `FXAA` 인스턴스를 생성합니다.
     * [EN] Creates an `FXAA` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
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

definePositiveNumber(FXAA, [
    {key: 'edgeThresholdMin', value: 0.0625, min: 0.00001, max: 0.1},
    {key: 'edgeThreshold', value: 0.125, min: 0.0001, max: 0.25},
    {key: 'subpix', value: 0.75, min: 0.0, max: 1},
])
Object.freeze(FXAA);
export default FXAA;

