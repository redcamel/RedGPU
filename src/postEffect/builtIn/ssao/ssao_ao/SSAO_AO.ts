import RedGPUContext from "../../../../context/RedGPUContext";
import ASingleComputePassPostEffect from "../../../core/ASingleComputePassPostEffect";
import createBasicComputePassPostEffectCode from "../../../core/createBasicComputePassPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";


interface SSAO_AO {
    /**
     * [KO] AO 대비 (0.5 ~ 4.0)
     * [EN] AO contrast (0.5 ~ 4.0)
     * @defaultValue 1.0
     */
    contrast: number;
    /**
     * [KO] 샘플링 반경 (단위: 월드 거리, 0.01 ~ 5.0)
     * [EN] Sampling radius in world units (0.01 ~ 5.0)
     * @defaultValue 0.5
     */
    radius: number;
    /**
     * [KO] AO 효과 강도 (0 ~ 10)
     * [EN] AO effect intensity (0 ~ 10)
     * @defaultValue 1.0
     */
    intensity: number;
    /**
     * [KO] 자기 차폐 방지용 깊이 바이어스 값 (0.0 ~ 0.1)
     * [EN] Depth bias value to prevent self-occlusion (0.0 ~ 0.1)
     * @defaultValue 0.01
     */
    bias: number;
    /**
     * [KO] 거리에 따른 바이어스 가중치 (0.0 ~ 0.5)
     * [EN] Distance-based bias scale (0.0 ~ 0.5)
     * @defaultValue 0.01
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
     * @defaultValue 50.0
     */
    fadeDistanceRange: number;
}

/**
 * [KO] 2D 화면 공간 지평선 탐색(GTAO)을 통해 주변광 차폐(Visibility)와 선형 깊이·법선 데이터를 패킹하는 내부 후처리 패스입니다.
 * [EN] Internal post-processing pass that computes Ground Truth Ambient Occlusion (GTAO) via 2D screen-space horizon search and packs visibility, linear depth, and normal data.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @see [SSAO example](/RedGPU/examples/postEffect/builtIn/screenSpace/ssao/)
 * @category PostEffect
 */
class SSAO_AO extends ASingleComputePassPostEffect {

    /**
     * [KO] SSAO_AO 인스턴스를 생성합니다.
     * [EN] Creates an SSAO_AO instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {workSizeX: 8, workSizeY: 8, workSizeZ: 1, isLdr: false});

        this.init(
            redGPUContext,
            'POST_EFFECT_SSAO',
            createBasicComputePassPostEffectCode(this, computeCode, uniformStructCode)
        );

    }

}

definePositiveNumber(SSAO_AO, [
    {key: 'contrast', value: 1.0, min: 0.5, max: 4.0},
    {key: 'radius', value: 0.5, min: 0.01, max: 5.0},
    {key: 'intensity', value: 1.0, min: 0, max: 10},
    {key: 'bias', value: 0.01, min: 0.0, max: 0.1},
    {key: 'biasDistanceScale', value: 0.01, min: 0.0, max: 0.5},
    {key: 'fadeDistanceStart', value: 30.0, min: 1.0, max: 200.0},
    {key: 'fadeDistanceRange', value: 50.0, min: 1.0, max: 100.0},
])
Object.freeze(SSAO_AO);
export default SSAO_AO;
