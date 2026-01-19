import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import AMultiPassPostEffect from "../../core/AMultiPassPostEffect";
import {ASinglePassPostEffectResult} from "../../core/ASinglePassPostEffect";
import GaussianBlur from "../blur/GaussianBlur";
import SSAO_AO from "./ssao_ao/SSAO_AO";
import SSAOBlend from "./SSAOBlend";

/**
 * [KO] SSAO(Screen Space Ambient Occlusion) 후처리 이펙트입니다.
 * [EN] SSAO (Screen Space Ambient Occlusion) post-processing effect.
 *
 * @category PostEffect
 */
class SSAO extends AMultiPassPostEffect {
    /** 
     * [KO] 임계값 이펙트 
     * [EN] Threshold effect
     */
    #effect_ao: SSAO_AO
    /** 
     * [KO] 가우시안 블러 이펙트 
     * [EN] Gaussian blur effect
     */
    #effect_blur: GaussianBlur
    #effect_blend: SSAOBlend


    /**
     * [KO] SSAO 인스턴스를 생성합니다.
     * [EN] Creates an SSAO instance.
     * 
     * @param redGPUContext 
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
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
        this.#effect_blur.size = 3.0
        this.#effect_blend = this.passList[2] as SSAOBlend
    }

    /**
     * [KO] 블러 사용 여부
     * [EN] Whether to use blur
     */
    get useBlur(): boolean {
        return this.#effect_ao.useBlur;
    }

    set useBlur(value: boolean) {
        this.#effect_ao.useBlur = value;
    }

    /**
     * [KO] 반경
     * [EN] Radius
     */
    get radius(): number {
        return this.#effect_ao.radius;
    }

    set radius(value: number) {
        this.#effect_ao.radius = value;
    }

    /**
     * [KO] 강도
     * [EN] Intensity
     */
    get intensity(): number {
        return this.#effect_ao.intensity;
    }

    set intensity(value: number) {
        this.#effect_ao.intensity = value;
    }

    /**
     * [KO] 바이어스
     * [EN] Bias
     */
    get bias(): number {
        return this.#effect_ao.bias;
    }

    set bias(value: number) {
        this.#effect_ao.bias = value;
    }

    /**
     * [KO] 바이어스 거리 스케일
     * [EN] Bias distance scale
     */
    get biasDistanceScale(): number {
        return this.#effect_ao.biasDistanceScale;
    }

    set biasDistanceScale(value: number) {
        this.#effect_ao.biasDistanceScale = value;
    }

    /**
     * [KO] 페이드 시작 거리
     * [EN] Fade start distance
     */
    get fadeDistanceStart(): number {
        return this.#effect_ao.fadeDistanceStart;
    }

    set fadeDistanceStart(value: number) {
        this.#effect_ao.fadeDistanceStart = value;
    }

    /**
     * [KO] 페이드 거리 범위
     * [EN] Fade distance range
     */
    get fadeDistanceRange(): number {
        return this.#effect_ao.fadeDistanceRange;
    }

    set fadeDistanceRange(value: number) {
        this.#effect_ao.fadeDistanceRange = value;
    }

    /**
     * [KO] 대비
     * [EN] Contrast
     */
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