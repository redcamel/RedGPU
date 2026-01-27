import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] SSAO AO 계산 이펙트입니다. (내부용)
 * [EN] SSAO AO calculation effect. (Internal use)
 * @category PostEffect
 */
class SSAO_AO extends ASinglePassPostEffect {


    #radius: number = 0.253;
    #intensity: number = 1.0;
    #bias: number = 0.02;
    #biasDistanceScale: number = 0.02;
    #fadeDistanceStart: number = 30.0;
    #fadeDistanceRange: number = 20.0;
    #contrast: number = 1.5;
    #useBlur: boolean = true

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.useDepthTexture = true;
        this.useGBufferNormalTexture = true;

        this.init(
            redGPUContext,
            'POST_EFFECT_SSAO',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );

        this.radius = this.#radius;
        this.intensity = this.#intensity;
        this.bias = this.#bias;
        this.biasDistanceScale = this.#biasDistanceScale;
        this.fadeDistanceStart = this.#fadeDistanceStart;
        this.fadeDistanceRange = this.#fadeDistanceRange;
        this.contrast = this.#contrast;
        this.useBlur = true
    }

    get useBlur(): boolean {
        return this.#useBlur;
    }

    set useBlur(value: boolean) {
        this.#useBlur = value;
        this.updateUniform('useBlur', value ? 1 : 0);
    }

    get radius(): number {
        return this.#radius;
    }

    set radius(value: number) {
        validatePositiveNumberRange(value, 0.01, 5.0);
        this.#radius = value;
        this.updateUniform('radius', value);
    }

    get intensity(): number {
        return this.#intensity;
    }

    set intensity(value: number) {
        validateNumberRange(value, 0.0, 10.0);
        this.#intensity = value;
        this.updateUniform('intensity', value);
    }

    get bias(): number {
        return this.#bias;
    }

    set bias(value: number) {
        validateNumberRange(value, 0.0, 0.1);
        this.#bias = value;
        this.updateUniform('bias', value);
    }

    get biasDistanceScale(): number {
        return this.#biasDistanceScale;
    }

    set biasDistanceScale(value: number) {
        validateNumberRange(value, 0.0, 0.5);
        this.#biasDistanceScale = value;
        this.updateUniform('biasDistanceScale', value);
    }

    get fadeDistanceStart(): number {
        return this.#fadeDistanceStart;
    }

    set fadeDistanceStart(value: number) {
        validatePositiveNumberRange(value, 1.0, 200.0);
        this.#fadeDistanceStart = value;
        this.updateUniform('fadeDistanceStart', value);
    }

    get fadeDistanceRange(): number {
        return this.#fadeDistanceRange;
    }

    set fadeDistanceRange(value: number) {
        validatePositiveNumberRange(value, 1.0, 100.0);
        this.#fadeDistanceRange = value;
        this.updateUniform('fadeDistanceRange', value);
    }

    get contrast(): number {
        return this.#contrast;
    }

    set contrast(value: number) {
        validateNumberRange(value, 0.5, 4.0);
        this.#contrast = value;
        this.updateUniform('contrast', value);
    }

}

Object.freeze(SSAO_AO);
export default SSAO_AO;
