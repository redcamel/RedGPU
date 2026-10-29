import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] 언리얼 엔진 `Diaphragm DOF` 규격에 맞춰 `Mip 0 ~ Mip 2` 적응형 샘플링과 조리개 날 꼭짓점 간 직선 선형 보간(`mix(V0, V1, t)`) 커널로 배경(`passMode = 0`) 및 전경(`passMode = 1`) 보케를 독립 개더링하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that independently gathers background (`passMode = 0`) and foreground (`passMode = 1`) bokeh using `Mip 0 ~ Mip 2` adaptive sampling and blade-vertex linear interpolation (`mix(V0, V1, t)`) matching Unreal Engine's `Diaphragm DOF`.
 *
 * ::: warning
 * [KO] 이 클래스는 `DOF` 내부에서 자동으로 생성 및 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created and managed inside `DOF`.<br/>Do not create an instance directly.
 * :::
 *
 * @category PostEffect
 */
class DOFBokehBlur extends ASinglePassPostEffect {
    #maxCoC: number = 32.0;
    #bokehBrightness: number = 1.5;
    #bladeCount: number = 6;
    #passMode: number = 0;

    constructor(redGPUContext: RedGPUContext, passMode: number = 0) {
        super(redGPUContext);
        this.#passMode = passMode;
        const {msaa, nonMsaa} = createBasicPostEffectCode(
            this,
            computeCode,
            uniformStructCode,
            [
                {name: 'cocMip0Texture'},
                {name: 'cocMip1Texture'},
                {name: 'cocMip2Texture'},
                {name: 'tileMaxTexture'}
            ]
        );
        this.init(
            redGPUContext,
            `POST_EFFECT_DOF_BOKEH_BLUR_MODE_${passMode}`,
            {msaa, nonMsaa}
        );
        this.maxCoC = this.#maxCoC;
        this.bokehBrightness = this.#bokehBrightness;
        this.bladeCount = this.#bladeCount;
        this.passMode = this.#passMode;
    }

    get maxCoC(): number {
        return this.#maxCoC;
    }

    set maxCoC(value: number) {
        validateNumberRange(value, 4.0, 64.0);
        this.#maxCoC = value;
        this.updateUniform('maxCoC', value);
    }

    get bokehBrightness(): number {
        return this.#bokehBrightness;
    }

    set bokehBrightness(value: number) {
        validateNumberRange(value, 0.0, 5.0);
        this.#bokehBrightness = value;
        this.updateUniform('bokehBrightness', value);
    }

    get bladeCount(): number {
        return this.#bladeCount;
    }

    set bladeCount(value: number) {
        validateUintRange(value, 0, 9);
        this.#bladeCount = value;
        this.updateUniform('bladeCount', value);
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
        cocMip0Info: IPostEffectResult,
        cocMip1Info: IPostEffectResult,
        cocMip2Info: IPostEffectResult,
        tileMaxTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return super.render(view, width, height, cocMip0Info, cocMip1Info, cocMip2Info, tileMaxTextureInfo);
    }
}

Object.freeze(DOFBokehBlur);
export default DOFBokehBlur;
