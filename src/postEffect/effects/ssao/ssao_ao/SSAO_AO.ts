import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import defineBoolean from "../../../../defineProperty/funcs/defineBoolean";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";


interface SSAO_AO {
    /**
     * [KO] 가우시안 블러 사용 여부
     * [EN] Whether to use Gaussian blur
     * @defaultValue true
     */
    useBlur: boolean;
    /**
     * [KO] AO 대비 (0.5 ~ 4.0)
     * [EN] AO contrast (0.5 ~ 4.0)
     * @defaultValue 1.5
     */
    contrast: number;
    /**
     * [KO] 샘플링 반경 (월드 단위, 0.01 ~ 5.0)
     * [EN] Sampling radius in world units (0.01 ~ 5.0)
     * @defaultValue 0.25
     */
    radius: number;
    /**
     * [KO] AO 효과 강도 (0 ~ 10)
     * [EN] AO effect intensity (0 ~ 10)
     * @defaultValue 1
     */
    intensity: number;
    /**
     * [KO] 자기 차폐 방지용 바이어스 값 (0.0 ~ 0.1)
     * [EN] Bias value to prevent self-occlusion (0.0 ~ 0.1)
     * @defaultValue 0.02
     */
    bias: number;
    /**
     * [KO] 거리에 따른 바이어스 가중치 (0.0 ~ 0.5)
     * [EN] Distance-based bias scale (0.0 ~ 0.5)
     * @defaultValue 0.02
     */
    biasDistanceScale: number;
    /**
     * [KO] AO 페이드 아웃 시작 거리 (1.0 ~ 200.0)
     * [EN] Distance where AO fade-out starts (1.0 ~ 200.0)
     * @defaultValue 30.0
     */
    fadeDistanceStart: number;
    /**
     * [KO] AO 페이드 거리 범위 (1.0 ~ 100.0)
     * [EN] AO fade distance range (1.0 ~ 100.0)
     * @defaultValue 20.0
     */
    fadeDistanceRange: number;
}

/**
 * [KO] 뷰 공간에서 반구(Hemisphere) 샘플링을 통해 화면 공간 주변광 차폐(SSAO) 값을 계산하는 내부 후처리 패스입니다.
 * [EN] Internal post-processing pass that calculates Screen Space Ambient Occlusion (SSAO) via hemisphere sampling in view space.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class SSAO_AO extends ASinglePassPostEffect {

    /**
     * [KO] SSAO_AO 인스턴스를 생성합니다.
     * [EN] Creates an SSAO_AO instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1});

        this.init(
            redGPUContext,
            'POST_EFFECT_SSAO',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );

    }

}

defineBoolean(SSAO_AO, [
    {key: 'useBlur', value: true}
])
definePositiveNumber(SSAO_AO, [
    {key: 'contrast', value: 1.5, min: 0.5, max: 4.0},
    {key: 'radius', value: 0.25, min: 0.01, max: 5.0},
    {key: 'intensity', value: 1, min: 0, max: 10},
    {key: 'bias', value: 0.02, min: 0.0, max: 0.1},
    {key: 'biasDistanceScale', value: 0.02, min: 0.0, max: 0.5},
    {key: 'fadeDistanceStart', value: 30.0, min: 1.0, max: 200.0},
    {key: 'fadeDistanceRange', value: 20.0, min: 1.0, max: 100.0},
])
Object.freeze(SSAO_AO);
export default SSAO_AO;
