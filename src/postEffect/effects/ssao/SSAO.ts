import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {ASinglePassPostEffectResult} from "../../core/ASinglePassPostEffect";
import GaussianBlur from "../blur/GaussianBlur";
import SSAO_AO from "./ssao_ao/SSAO_AO";
import SSAOBlend from "./SSAOBlend";

class SSAO extends AMultiPassPostEffect {
    /** 임계값 이펙트 */
    #effect_ao: SSAO_AO
    /** 가우시안 블러 이펙트 */
    #effect_blur: GaussianBlur
    #effect_blend: SSAOBlend


    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            [
                new SSAO_AO(redGPUContext),
                new GaussianBlur(redGPUContext),
                new SSAOBlend(redGPUContext),
            ],
        );
        this.#effect_ao = this.passList[0] as SSAO_AO
        this.#effect_blur = this.passList[1] as GaussianBlur
        this.#effect_blur.size = 1.5
        this.#effect_blend = this.passList[2] as SSAOBlend
    }

    get useBlur(): boolean {
        return this.#effect_ao.useBlur;
    }

    set useBlur(value: boolean) {
        this.#effect_ao.useBlur = value;
    }

    get radius(): number {
        return this.#effect_ao.radius;
    }

    set radius(value: number) {
        this.#effect_ao.radius = value;
    }

    get intensity(): number {
        return this.#effect_ao.intensity;
    }

    set intensity(value: number) {
        this.#effect_ao.intensity = value;
    }

    get bias(): number {
        return this.#effect_ao.bias;
    }

    set bias(value: number) {
        this.#effect_ao.bias = value;
    }

    get biasDistanceScale(): number {
        return this.#effect_ao.biasDistanceScale;
    }

    set biasDistanceScale(value: number) {
        this.#effect_ao.biasDistanceScale = value;
    }

    get fadeDistanceStart(): number {
        return this.#effect_ao.fadeDistanceStart;
    }

    set fadeDistanceStart(value: number) {
        this.#effect_ao.fadeDistanceStart = value;
    }

    get fadeDistanceRange(): number {
        return this.#effect_ao.fadeDistanceRange;
    }

    set fadeDistanceRange(value: number) {
        this.#effect_ao.fadeDistanceRange = value;
    }

    get contrast(): number {
        return this.#effect_ao.contrast;
    }

    set contrast(value: number) {
        this.#effect_ao.contrast = value;
    }


    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult) {
        const aoResult = this.#effect_ao.render(
            view, width, height, sourceTextureInfo
        )
        if (this.useBlur) {
            const blurResult = this.#effect_blur.render(
                view, width, height, aoResult
            )
            return this.#effect_blend.render(
                view, width, height, sourceTextureInfo, blurResult
            )
        } else {
            return aoResult
        }
    }
}

Object.freeze(SSAO)
export default SSAO
