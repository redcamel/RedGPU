import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface SSAO_AO {
    /** [KO] 블러 사용 여부. true 시 AO 노이즈를 억제하기 위한 가우시안 블러가 수행됩니다. [EN] Whether to use blur. If true, Gaussian blur is performed to suppress AO noise. */
    useBlur: boolean;
    /** [KO] AO의 대비(Contrast). 값이 클수록 그림자가 더 진해집니다. [EN] Contrast of AO. Higher values result in darker shadows. */
    contrast: number;
    /** [KO] 샘플링 반경 (월드 단위). 물체로부터 어느 정도 거리까지 차폐를 계산할지 결정합니다. [EN] Sampling radius (in world units). Determines the distance up to which occlusion is calculated from an object. */
    radius: number;
    /** [KO] AO 효과의 전체적인 강도. [EN] Overall intensity of the AO effect. */
    intensity: number;
    /** [KO] 자기 차폐 방지를 위한 바이어스 값. [EN] Bias value to prevent self-occlusion. */
    bias: number;
    /** [KO] 거리에 따른 바이어스 가중치. [EN] Bias weight based on distance. */
    biasDistanceScale: number;
    /** [KO] AO 효과가 사라지기 시작하는 거리. [EN] Distance where the AO effect starts to fade out. */
    fadeDistanceStart: number;
    /** [KO] AO 효과의 페이드 범위. [EN] Fade range of the AO effect. */
    fadeDistanceRange: number;
}
/**
 * [KO] SSAO의 핵심인 차폐도(Occlusion) 계산을 담당하는 이펙트입니다.
 * [EN] Effect responsible for calculating Occlusion, the core of SSAO.
 *
 * [KO] 뷰 공간(View Space)에서 법선 방향의 반구(Hemisphere) 샘플링을 수행하여 주변 지형에 의한 빛의 차폐 정도를 산출합니다.
 * [EN] Performs hemisphere sampling in the normal direction within view space to calculate the degree of light occlusion by surrounding terrain.
 *
 * @category PostEffect
 */
declare class SSAO_AO extends ASinglePassPostEffect {
    constructor(redGPUContext: RedGPUContext);
}
export default SSAO_AO;
