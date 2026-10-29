import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";

/**
 * [KO] `1/16` 해상도(Half-Res `8×8` 타일)에서 인접 반경 내 최소 전경 CoC(`minNearCoC`)와 최대 배경 CoC(`maxFarCoC`)를 산출 및 확장(Dilate)하여 보케 절단과 전경 블리딩 누락을 원천 방지하는 내부 서브패스입니다.
 * [EN] Internal sub-pass at `1/16` resolution (Half-Res `8×8` tiles) that computes and dilates the minimum foreground CoC (`minNearCoC`) and maximum background CoC (`maxFarCoC`) within the neighboring radius to prevent bokeh clipping and foreground bleeding gaps.
 *
 * ::: warning
 * [KO] 이 클래스는 `DOF` 내부에서 자동으로 생성 및 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created and managed inside `DOF`.<br/>Do not create an instance directly.
 * :::
 *
 * @category PostEffect
 */
class DOFTileMaxCoC extends ASinglePassPostEffect {
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const {msaa, nonMsaa} = createBasicPostEffectCode(this, computeCode);
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_TILE_MAX_COC',
            {msaa, nonMsaa}
        );
    }
}

Object.freeze(DOFTileMaxCoC);
export default DOFTileMaxCoC;
