import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import DOF_CONFIG from "../DOF_CONFIG";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] 언리얼 엔진 `Diaphragm DOF` 규격에 맞춰 `Mip 0 ~ Mip 2` 적응형 샘플링과 조리개 날 꼭짓점 간 직선 선형 보간(`mix(V0, V1, t)`) 커널로 배경(`passMode = 0`) 및 전경(`passMode = 1`) 보케를 독립 개더링하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that independently gathers background (`passMode = 0`) and foreground (`passMode = 1`) bokeh using `Mip 0 ~ Mip 2` adaptive sampling and blade-vertex linear interpolation (`mix(V0, V1, t)`) matching Unreal Engine's `Diaphragm DOF`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class DOFBokehBlur extends ASinglePassPostEffect {
    #bokehBrightness: number = DOF_CONFIG.DEFAULT_BOKEH_BRIGHTNESS;
    #bladeCount: number = DOF_CONFIG.DEFAULT_BLADE_COUNT;
    #passMode: number = DOF_CONFIG.PASS_MODE.BACKGROUND;

    constructor(redGPUContext: RedGPUContext, passMode: number = DOF_CONFIG.PASS_MODE.BACKGROUND) {
        super(redGPUContext, {workSizeX: 16, workSizeY: 16, workSizeZ: 1});
        this.#passMode = passMode;
        this.init(
            redGPUContext,
            `POST_EFFECT_DOF_BOKEH_BLUR_MODE_${passMode}`,
            createBasicPostEffectCode(
                this,
                computeCode,
                uniformStructCode,
                [
                    {name: 'cocMip0Texture'},
                    {name: 'cocMip1Texture'},
                    {name: 'cocMip2Texture'},
                    {name: 'tileMaxTexture'}
                ],
                false
            )
        );
    }

    get bokehBrightness(): number {
        return this.#bokehBrightness;
    }

    set bokehBrightness(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_BOKEH_BRIGHTNESS, DOF_CONFIG.MAX_BOKEH_BRIGHTNESS);
        if (this.#bokehBrightness === value) return;
        this.#bokehBrightness = value;
        this.updateUniform('bokehBrightness', value);
    }

    get bladeCount(): number {
        return this.#bladeCount;
    }

    set bladeCount(value: number) {
        validateUintRange(value, DOF_CONFIG.MIN_BLADE_COUNT, DOF_CONFIG.MAX_BLADE_COUNT);
        if (this.#bladeCount === value) return;
        this.#bladeCount = value;
        this.updateUniform('bladeCount', value);
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
