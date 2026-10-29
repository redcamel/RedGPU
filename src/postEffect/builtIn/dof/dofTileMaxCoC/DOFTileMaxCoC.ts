import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import DOF_CONFIG from "../DOF_CONFIG";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] `1/16` 해상도(Half-Res `8×8` 타일)에서 인접 반경 내 최소 전경 CoC(`minNearCoC`)와 최대 배경 CoC(`maxFarCoC`)를 산출 및 확장(Dilate)하여 보케 절단과 전경 블리딩 누락을 원천 방지하는 내부 서브패스입니다.
 * [EN] Internal sub-pass at `1/16` resolution (Half-Res `8×8` tiles) that computes and dilates the minimum foreground CoC (`minNearCoC`) and maximum background CoC (`maxFarCoC`) within the neighboring radius to prevent bokeh clipping and foreground bleeding gaps.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class DOFTileMaxCoC extends ASinglePassPostEffect {
    #maxCoC: number = DOF_CONFIG.DEFAULT_MAX_COC;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1});
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_TILE_MAX_COC',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }

    get maxCoC(): number {
        return this.#maxCoC;
    }

    set maxCoC(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_MAX_COC, DOF_CONFIG.MAX_MAX_COC);
        if (this.#maxCoC === value) return;
        this.#maxCoC = value;
        this.updateUniform('maxCoC', value);
    }
}

Object.freeze(DOFTileMaxCoC);
export default DOFTileMaxCoC;
