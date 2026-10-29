import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import DOF_CONFIG from "../DOF_CONFIG";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] 언리얼 엔진 `Diaphragm DOF` 규격에 맞춰 절반 해상도(`1/2`) 배경 보케 버퍼(`passMode = 0`)와 전경 보케+불투명도 버퍼(`passMode = 1`)를 각각 독립적으로 9-Tap Tent 스무딩하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that independently performs 9-Tap Tent smoothing on the half-resolution (`1/2`) background bokeh buffer (`passMode = 0`) and foreground bokeh+opacity buffer (`passMode = 1`) matching Unreal Engine's `Diaphragm DOF`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class DOFPostFilter extends ASinglePassPostEffect {
    #passMode: number = DOF_CONFIG.PASS_MODE.BACKGROUND;

    constructor(redGPUContext: RedGPUContext, passMode: number = DOF_CONFIG.PASS_MODE.BACKGROUND) {
        super(redGPUContext);
        this.#passMode = passMode;
        this.init(
            redGPUContext,
            `POST_EFFECT_DOF_POST_FILTER_MODE_${passMode}`,
            createBasicPostEffectCode(
                this,
                computeCode,
                uniformStructCode,
                [
                    {name: 'bokehTexture'}
                ]
            )
        );
    }

    get passMode(): number {
        return this.#passMode;
    }

    set passMode(value: number) {
        validateUintRange(value, DOF_CONFIG.PASS_MODE.BACKGROUND, DOF_CONFIG.PASS_MODE.FOREGROUND);
        if (this.#passMode === value) return;
        this.#passMode = value;
        this.updateUniform('passMode', value);
    }

    render(
        view: View3D,
        width: number,
        height: number,
        bokehTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return super.render(view, width, height, bokehTextureInfo);
    }
}

Object.freeze(DOFPostFilter);
export default DOFPostFilter;
