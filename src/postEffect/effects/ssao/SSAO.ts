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
    /**
     * [KO] 블렌드 이펙트
     * [EN] Blend effect
     */
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
     * [KO] 블러 사용 여부를 반환합니다.
     * [EN] Returns whether blur is used.
     */
    get useBlur(): boolean {
        return this.#effect_ao.useBlur;
    }

    /**
     * [KO] 블러 사용 여부를 설정합니다.
     * [EN] Sets whether blur is used.
     */
    set useBlur(value: boolean) {
        this.#effect_ao.useBlur = value;
    }

    /**
     * [KO] 반경을 반환합니다.
     * [EN] Returns the radius.
     */
    get radius(): number {
        return this.#effect_ao.radius;
    }

    /**
     * [KO] 반경을 설정합니다.
     * [EN] Sets the radius.
     */
    set radius(value: number) {
        this.#effect_ao.radius = value;
    }

    /**
     * [KO] 강도를 반환합니다.
     * [EN] Returns the intensity.
     */
    get intensity(): number {
        return this.#effect_ao.intensity;
    }

    /**
     * [KO] 강도를 설정합니다.
     * [EN] Sets the intensity.
     */
    set intensity(value: number) {
        this.#effect_ao.intensity = value;
    }

    /**
     * [KO] 바이어스를 반환합니다.
     * [EN] Returns the bias.
     */
    get bias(): number {
        return this.#effect_ao.bias;
    }

    /**
     * [KO] 바이어스를 설정합니다.
     * [EN] Sets the bias.
     */
    set bias(value: number) {
        this.#effect_ao.bias = value;
    }

    /**
     * [KO] 바이어스 거리 스케일을 반환합니다.
     * [EN] Returns the bias distance scale.
     */
    get biasDistanceScale(): number {
        return this.#effect_ao.biasDistanceScale;
    }

    /**
     * [KO] 바이어스 거리 스케일을 설정합니다.
     * [EN] Sets the bias distance scale.
     */
    set biasDistanceScale(value: number) {
        this.#effect_ao.biasDistanceScale = value;
    }

    /**
     * [KO] 페이드 시작 거리를 반환합니다.
     * [EN] Returns the fade start distance.
     */
    get fadeDistanceStart(): number {
        return this.#effect_ao.fadeDistanceStart;
    }

    /**
     * [KO] 페이드 시작 거리를 설정합니다.
     * [EN] Sets the fade start distance.
     */
    set fadeDistanceStart(value: number) {
        this.#effect_ao.fadeDistanceStart = value;
    }

    /**
     * [KO] 페이드 거리 범위를 반환합니다.
     * [EN] Returns the fade distance range.
     */
    get fadeDistanceRange(): number {
        return this.#effect_ao.fadeDistanceRange;
    }

    /**
     * [KO] 페이드 거리 범위를 설정합니다.
     * [EN] Sets the fade distance range.
     */
    set fadeDistanceRange(value: number) {
        this.#effect_ao.fadeDistanceRange = value;
    }

    /**
     * [KO] 대비를 반환합니다.
     * [EN] Returns the contrast.
     */
    get contrast(): number {
        return this.#effect_ao.contrast;
    }

    /**
     * [KO] 대비를 설정합니다.
     * [EN] Sets the contrast.
     */
    set contrast(value: number) {
        this.#effect_ao.contrast = value;
    }


    /**
     * [KO] SSAO 효과를 렌더링합니다.
     * [EN] Renders the SSAO effect.
     *
     * @param view
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width
     * [KO] 너비
     * [EN] Width
     * @param height
     * [KO] 높이
     * [EN] Height
     * @param sourceTextureInfo
     * [KO] 소스 텍스처 정보
     * [EN] Source texture info
     * @returns
     * [KO] 렌더링 결과
     * [EN] Rendering result
     */
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
