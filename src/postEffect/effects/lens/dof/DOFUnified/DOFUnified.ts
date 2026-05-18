import RedGPUContext from "../../../../../context/RedGPUContext";
import View3D from "../../../../../display/view/View3D";
import validateNumberRange from "../../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../../core/createBasicPostEffectCode";
import {IPostEffectResult} from "../../../../core/types";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";

/**
 * [KO] DOF 통합 블러 및 합성 이펙트입니다.
 * [EN] DOF unified blur and compositing effect.
 * @category Lens
 */
class DOFUnified extends ASinglePassPostEffect {
    #nearBlurSize: number = 16;
    #farBlurSize: number = 24;
    #nearStrength: number = 1.0;
    #farStrength: number = 1.0;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_DOF_UNIFIED',
            createBasicPostEffectCode(this, computeCode, uniformStructCode, ['sourceTexture', 'cocTexture'])
        );
        this.nearBlurSize = this.#nearBlurSize;
        this.farBlurSize = this.#farBlurSize;
        this.nearStrength = this.#nearStrength;
        this.farStrength = this.#farStrength;
    }

    get nearBlurSize(): number {
        return this.#nearBlurSize;
    }

    set nearBlurSize(value: number) {
        validateNumberRange(value);
        this.#nearBlurSize = value;
        this.updateUniform('nearBlurSize', value)
    }

    get farBlurSize(): number {
        return this.#farBlurSize;
    }

    set farBlurSize(value: number) {
        validateNumberRange(value);
        this.#farBlurSize = value;
        this.updateUniform('farBlurSize', value)
    }

    get nearStrength(): number {
        return this.#nearStrength;
    }

    set nearStrength(value: number) {
        validateNumberRange(value);
        this.#nearStrength = value;
        this.updateUniform('nearStrength', value)
    }

    get farStrength(): number {
        return this.#farStrength;
    }

    set farStrength(value: number) {
        validateNumberRange(value);
        this.#farStrength = value;
        this.updateUniform('farStrength', value)
    }

    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult, cocTextureInfo: IPostEffectResult) {
        return super.render(view, width, height, sourceTextureInfo, cocTextureInfo);
    }
}

Object.freeze(DOFUnified);
export default DOFUnified;
