import RedGPUContext from "../../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../../core/ASinglePassPostEffect";
interface DOFUnified {
    /**
     * [KO] 근거리 블러 크기 (단위: 픽셀)
     * [EN] Near blur size (in pixels)
     * @defaultValue 16
     */
    nearBlurSize: number;
    /**
     * [KO] 원거리 블러 크기 (단위: 픽셀)
     * [EN] Far blur size (in pixels)
     * @defaultValue 24
     */
    farBlurSize: number;
    /**
     * [KO] 근거리 블러 강도
     * [EN] Near blur strength
     * @defaultValue 1.0
     */
    nearStrength: number;
    /**
     * [KO] 원거리 블러 강도
     * [EN] Far blur strength
     * @defaultValue 1.0
     */
    farStrength: number;
}
/**
 * [KO] 계산된 착란원(CoC) 텍스처를 기반으로 근거리 및 원거리 블러와 합성을 수행하는 내부 후처리 패스입니다.
 * [EN] Internal post-processing pass that performs near/far blur and compositing based on the calculated Circle of Confusion (CoC) texture.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [DOF example](/RedGPU/examples/postEffect/lens/dof/)
 * @category Lens
 */
declare class DOFUnified extends ASinglePassPostEffect {
    /**
     * [KO] DOFUnified 인스턴스를 생성합니다.
     * [EN] Creates a DOFUnified instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
}
export default DOFUnified;
