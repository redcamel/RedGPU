import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import validateUintRange from "../../../../runtimeChecker/validateFunc/validateUintRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import DOF_CONFIG from "../DOF_CONFIG";
import dofOpticsCommon from "../wgsl/dofOpticsCommon.wgsl";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] 35mm 풀프레임 센서(`24mm`) 및 Thin-Lens 광학 공식으로 절반 해상도(`1/2`) 착란원 반경(단위: 텍셀)을 자동 산출하고 CoC-Aware 양방향 다운샘플링을 수행하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that automatically computes half-resolution (`1/2`) Circle of Confusion radius (in texels) using a 35mm full-frame sensor (`24mm`) and Thin-Lens optics, and performs CoC-aware bilateral downsampling.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class DOFCoCDownsample extends ASinglePassPostEffect {
    #focusDistance: number = DOF_CONFIG.DEFAULT_FOCUS_DISTANCE;
    #aperture: number = DOF_CONFIG.DEFAULT_APERTURE;
    #focalLength: number = DOF_CONFIG.DEFAULT_FOCAL_LENGTH;
    #useAutoFocus: number = 0;
    #historyValid: number = 0;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_COC_DOWNSAMPLE',
            createBasicPostEffectCode(
                this,
                computeCode,
                `${dofOpticsCommon}\n${uniformStructCode}`,
                [
                    {name: 'sourceTexture'},
                    {name: 'focusTexture'},
                    {name: 'prevCoCTexture'}
                ]
            )
        );
    }

    get focusDistance(): number {
        return this.#focusDistance;
    }

    set focusDistance(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_FOCUS_DISTANCE, DOF_CONFIG.MAX_FOCUS_DISTANCE);
        if (this.#focusDistance === value) return;
        this.#focusDistance = value;
        this.updateUniform('focusDistance', value);
    }

    get aperture(): number {
        return this.#aperture;
    }

    set aperture(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_APERTURE, DOF_CONFIG.MAX_APERTURE);
        if (this.#aperture === value) return;
        this.#aperture = value;
        this.updateUniform('aperture', value);
    }

    get focalLength(): number {
        return this.#focalLength;
    }

    set focalLength(value: number) {
        validateNumberRange(value, DOF_CONFIG.MIN_FOCAL_LENGTH, DOF_CONFIG.MAX_FOCAL_LENGTH);
        if (this.#focalLength === value) return;
        this.#focalLength = value;
        this.updateUniform('focalLength', value);
    }

    get useAutoFocus(): number {
        return this.#useAutoFocus;
    }

    set useAutoFocus(value: number) {
        validateUintRange(value, 0, 1);
        if (this.#useAutoFocus === value) return;
        this.#useAutoFocus = value;
        this.updateUniform('useAutoFocus', value);
    }

    get historyValid(): number {
        return this.#historyValid;
    }

    set historyValid(value: number) {
        validateUintRange(value, 0, 1);
        if (this.#historyValid === value) return;
        this.#historyValid = value;
        this.updateUniform('historyValid', value);
    }

    render(
        view: View3D,
        width: number,
        height: number,
        sourceTextureInfo: IPostEffectResult,
        focusTextureInfo: IPostEffectResult,
        prevCoCTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return super.render(view, width, height, sourceTextureInfo, focusTextureInfo, prevCoCTextureInfo);
    }
}

Object.freeze(DOFCoCDownsample);
export default DOFCoCDownsample;
