import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";

/**
 * [KO] 언리얼 엔진 `Diaphragm DOF`의 `DOFDownsample` 패스와 동일하게, 상위 `cocMip` 텍스처를 CoC-Aware 양방향 및 Karis 가중치로 `1/4`(`Mip 1`) 및 `1/8`(`Mip 2`) 해상도로 다운샘플링하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that downsamples the parent `cocMip` texture to `1/4` (`Mip 1`) and `1/8` (`Mip 2`) resolutions using CoC-Aware bilateral and Karis weights, matching Unreal Engine's `Diaphragm DOF` `DOFDownsample` pass.
 *
 * ::: warning
 * [KO] 이 클래스는 `DOF` 내부에서 자동으로 생성 및 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created and managed inside `DOF`.<br/>Do not create an instance directly.
 * :::
 *
 * @category PostEffect
 */
class DOFMipDownsample extends ASinglePassPostEffect {
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const {msaa, nonMsaa} = createBasicPostEffectCode(
            this,
            computeCode,
            ''
        );
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_MIP_DOWNSAMPLE',
            {msaa, nonMsaa}
        );
    }

    render(
        view: View3D,
        width: number,
        height: number,
        sourceMipTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return super.render(view, width, height, sourceMipTextureInfo);
    }
}

Object.freeze(DOFMipDownsample);
export default DOFMipDownsample;
