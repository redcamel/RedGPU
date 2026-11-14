import RedGPUContext from "../../../../context/RedGPUContext";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
/**
 * [KO] 상위 `cocMip` 텍스처를 CoC-Aware 양방향 B-Spline/Tent 가중치로 `1/4`(`Mip 1`) 및 `1/8`(`Mip 2`) 해상도로 다운샘플링하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that downsamples the parent `cocMip` texture to `1/4` (`Mip 1`) and `1/8` (`Mip 2`) resolutions using CoC-Aware bilateral B-Spline/Tent weights.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
declare class DOFMipDownsample extends ASingleComputePassPostEffect {
    constructor(redGPUContext: RedGPUContext);
}
export default DOFMipDownsample;
