import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../../postEffect/core/ASinglePassPostEffect";
/**
 * [KO] `FXAA` 후처리 이펙트의 동적 프로퍼티 인터페이스입니다.
 * [EN] Dynamic property interface for the `FXAA` post-processing effect.
 *
 * @category Antialiasing
 */
interface FXAA {
    /**
     * [KO] 서브픽셀 안티앨리어싱 블렌딩 강도입니다 (`0.0` ~ `1.0`, 기본값: `0.75`).
     * [EN] Sub-pixel anti-aliasing blending strength (`0.0` to `1.0`, default: `0.75`).
     */
    subpix: number;
    /**
     * [KO] 엣지 검출을 위한 로컬 대비 임계 비율입니다 (`0.0001` ~ `0.25`, 기본값: `0.125`).
     * [EN] Local contrast threshold ratio for edge detection (`0.0001` to `0.25`, default: `0.125`).
     */
    edgeThreshold: number;
    /**
     * [KO] 어두운 영역의 엣지 처리를 건너뛰는 최소 휘도 대비 임계값입니다 (`0.00001` ~ `0.1`, 기본값: `0.0625`).
     * [EN] Minimum luminance contrast threshold to skip edge processing in dark regions (`0.00001` to `0.1`, default: `0.0625`).
     */
    edgeThresholdMin: number;
}
/**
 * [KO] 화면의 밝기 차이(대비)를 분석해 물체 경계의 계단 현상을 부드럽게 완화하는 FXAA(Fast Approximate Anti-Aliasing) 후처리 클래스입니다.
 * [EN] FXAA (Fast Approximate Anti-Aliasing) post-processing class that smooths jagged edges by analyzing brightness contrast on the screen.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * redGPUContext.antialiasingManager.useFXAA = true;
 * ```
 *
 * @category Antialiasing
 */
declare class FXAA extends ASinglePassPostEffect {
    /**
     * [KO] 새로운 FXAA 인스턴스를 생성합니다.
     * [EN] Creates a new FXAA instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default FXAA;
