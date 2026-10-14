import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../postEffect/core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
import definePositiveNumber from "../../defineProperty/funcs/number/definePositiveNumber";

/**
 * [KO] `FXAA` 후처리 이펙트의 동적 프로퍼티 인터페이스입니다.
 * [EN] Dynamic property interface for the `FXAA` post-processing effect.
 *
 * @category Antialiasing
 */
interface FXAA {
    /**
     * [KO] 서브픽셀 안티앨리어싱(Sub-pixel AA) 블렌딩 강도입니다. 허용 범위는 `0.0` ~ `1.0`이며 기본값은 `0.75`입니다.
     * [EN] Sub-pixel anti-aliasing blending strength. Valid range is `0.0` to `1.0`, and the default value is `0.75`.
     */
    subpix: number
    /**
     * [KO] 엣지 검출을 위한 로컬 대비(Contrast) 임계 비율입니다. 허용 범위는 `0.0001` ~ `0.25`이며 기본값은 `0.125`입니다.
     * [EN] Local contrast threshold ratio for edge detection. Valid range is `0.0001` to `0.25`, and the default value is `0.125`.
     */
    edgeThreshold: number
    /**
     * [KO] 어두운 영역에서 불필요한 엣지 처리를 건너뛰기 위한 최소 휘도 대비 임계값입니다. 허용 범위는 `0.00001` ~ `0.1`이며 기본값은 `0.0625`입니다.
     * [EN] Minimum luminance contrast threshold to skip unnecessary edge processing in dark regions. Valid range is `0.00001` to `0.1`, and the default value is `0.0625`.
     */
    edgeThresholdMin: number
}

/**
 * [KO] 화면 공간의 휘도(Luminance) 대비를 분석하여 계단 현상(Aliasing)을 완화하는 FXAA(Fast Approximate Anti-Aliasing) 클래스입니다.
 * [EN] FXAA (Fast Approximate Anti-Aliasing) class that reduces aliasing artifacts by analyzing screen-space luminance contrast.
 *
 * [KO] 추가적인 지오메트리 샘플링이나 이전 프레임 히스토리 없이 단일 컴퓨트 패스(LDR)로 동작하여 낮은 연산 비용으로 폴리곤 경계선을 부드럽게 보정합니다.
 * [EN] Operates in a single LDR compute pass without extra geometry sampling or frame history, smoothing polygon edges at a low computational cost.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] FXAA 모드 활성화
 * // [EN] Enable FXAA mode
 * redGPUContext.antialiasingManager.useFXAA = true;
 * ```
 *
 * @category Antialiasing
 */
class FXAA extends ASinglePassPostEffect {
    /**
     * [KO] `FXAA` 후처리 패스를 초기화합니다.
     * [EN] Initializes the `FXAA` post-processing pass.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
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
