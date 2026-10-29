import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] 물리 카메라 센서(`sensorSize`) 및 Thin-Lens 광학 공식으로 절반 해상도(`1/2`) 착란원 반경(단위: 텍셀)을 산출하고 CoC-Aware 양방향 다운샘플링을 수행하는 내부 서브패스입니다.
 * [EN] Internal sub-pass that computes half-resolution (`1/2`) Circle of Confusion radius (in texels) using physical camera sensor (`sensorSize`) and Thin-Lens optics, and performs CoC-aware bilateral downsampling.
 *
 * ::: warning
 * [KO] 이 클래스는 `DOF` 내부에서 자동으로 생성 및 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created and managed inside `DOF`.<br/>Do not create an instance directly.
 * :::
 *
 * @category PostEffect
 */
class DOFCoCDownsample extends ASinglePassPostEffect {
    #focusDistance: number = 15.0;
    #aperture: number = 2.0;
    #focalLength: number = 65.0;
    #sensorSize: number = 24.0;
    #maxCoC: number = 32.0;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const {msaa, nonMsaa} = createBasicPostEffectCode(
            this,
            computeCode,
            uniformStructCode,
            [
                {name: 'sourceTexture'},
                {name: 'focusTexture'}
            ]
        );
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_COC_DOWNSAMPLE',
            {msaa, nonMsaa}
        );
        this.focusDistance = this.#focusDistance;
        this.aperture = this.#aperture;
        this.focalLength = this.#focalLength;
        this.sensorSize = this.#sensorSize;
        this.maxCoC = this.#maxCoC;
    }

    get focusDistance(): number {
        return this.#focusDistance;
    }

    set focusDistance(value: number) {
        validateNumberRange(value, 0.1, 10000);
        this.#focusDistance = value;
        this.updateUniform('focusDistance', value);
    }

    get aperture(): number {
        return this.#aperture;
    }

    set aperture(value: number) {
        validateNumberRange(value, 0.5, 32.0);
        this.#aperture = value;
        this.updateUniform('aperture', value);
    }

    get focalLength(): number {
        return this.#focalLength;
    }

    set focalLength(value: number) {
        validateNumberRange(value, 12.0, 300.0);
        this.#focalLength = value;
        this.updateUniform('focalLength', value);
    }

    get sensorSize(): number {
        return this.#sensorSize;
    }

    set sensorSize(value: number) {
        validateNumberRange(value, 4.0, 70.0);
        this.#sensorSize = value;
        this.updateUniform('sensorSize', value);
    }

    get maxCoC(): number {
        return this.#maxCoC;
    }

    set maxCoC(value: number) {
        validateNumberRange(value, 4.0, 64.0);
        this.#maxCoC = value;
        this.updateUniform('maxCoC', value);
    }

    render(
        view: View3D,
        width: number,
        height: number,
        sourceTextureInfo: IPostEffectResult,
        focusTextureInfo: IPostEffectResult
    ): IPostEffectResult {
        return super.render(view, width, height, sourceTextureInfo, focusTextureInfo);
    }
}

Object.freeze(DOFCoCDownsample);
export default DOFCoCDownsample;
