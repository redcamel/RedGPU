import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] 언리얼 엔진 `Diaphragm DOF` 규격에 맞춰 절반 해상도(`1/2`) 배경 보케 버퍼(`passMode = 0`)와 전경 보케+불투명도 버퍼(`passMode = 1`)를 각각 독립적으로 9-Tap Tent 스무딩하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that independently performs 9-Tap Tent smoothing on the half-resolution (`1/2`) background bokeh buffer (`passMode = 0`) and foreground bokeh+opacity buffer (`passMode = 1`) matching Unreal Engine's `Diaphragm DOF`.
 *
 * ::: warning
 * [KO] 이 클래스는 `DOF` 내부에서 자동으로 생성 및 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created and managed inside `DOF`.<br/>Do not create an instance directly.
 * :::
 *
 * @category PostEffect
 */
class DOFPostFilter extends ASinglePassPostEffect {
    #passMode: number = 0;

    constructor(redGPUContext: RedGPUContext, passMode: number = 0) {
        super(redGPUContext);
        this.#passMode = passMode;
        const {msaa, nonMsaa} = createBasicPostEffectCode(
            this,
            computeCode,
            uniformStructCode,
            [
                {name: 'bokehTexture'},
                {name: 'cocTexture'}
            ]
        );
        this.init(
            redGPUContext,
            `POST_EFFECT_DOF_POST_FILTER_MODE_${passMode}`,
            {msaa, nonMsaa}
        );
        this.passMode = this.#passMode;
    }

    get passMode(): number {
        return this.#passMode;
    }

    set passMode(value: number) {
        validateUintRange(value, 0, 1);
        this.#passMode = value;
        this.updateUniform('passMode', value);
    }

    render(
        view: View3D,
        width: number,
        height: number,
        bokehTextureInfo: IPostEffectResult,
        cocTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return super.render(view, width, height, bokehTextureInfo, cocTextureInfo);
    }
}

Object.freeze(DOFPostFilter);
export default DOFPostFilter;
