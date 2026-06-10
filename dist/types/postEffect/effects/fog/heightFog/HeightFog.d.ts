import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
interface HeightFog {
    /** [KO] 안개의 밀도 (0 ~ 5) [EN] Density of the fog (0 ~ 5) */
    density: number;
    /** [KO] 안개가 시작되는 월드 기준 높이 [EN] Base height in world space where the fog starts */
    baseHeight: number;
    /** [KO] 안개의 수직 두께 [EN] Vertical thickness of the fog */
    thickness: number;
    /** [KO] 높이에 따른 안개 감쇠율 [EN] Fog falloff rate based on height */
    falloff: number;
    /** [KO] 안개 계산 방식 (0: 지수형, 1: 지수제곱형) [EN] Fog calculation type (0: Exponential, 1: Exponential Squared) */
    fogType: number;
    /** [KO] 안개의 색상 [EN] Color of the fog */
    fogColor: string;
}
/**
 * [KO] 높이 기반 안개(Height Fog) 후처리 이펙트입니다.
 * [EN] Height Fog post-processing effect.
 *
 * [KO] 월드 좌표의 높이(Y축) 값을 기준으로 안개 농도를 결정하여 지표면 근처에 깔리는 안개나 구름 효과를 시뮬레이션합니다.
 * [EN] Simulates fog or cloud effects near the ground by determining fog density based on the world height (Y-axis).
 *
 * [KO] 이 효과는 HDR 공간에서 동작하며, 배경(Skybox)과의 정밀한 수직 높이 합성을 위해 고정밀 레이 캐스팅 로직을 포함합니다.
 * [EN] This effect operates in HDR space and includes high-precision ray casting logic for accurate vertical height composition with the skybox.
 *
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.HeightFog(redGPUContext);
 * effect.density = 0.5;
 * effect.baseHeight = 0.0;
 * effect.thickness = 10.0;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/fog/heightFog/"></iframe>
 * @category Fog
 */
declare class HeightFog extends ASinglePassPostEffect {
    /**
     * [KO] 지수 안개 타입
     * [EN] Exponential fog type
     */
    static EXPONENTIAL: number;
    /**
     * [KO] 지수제곱 안개 타입
     * [EN] Exponential Squared fog type
     */
    static EXPONENTIAL_SQUARED: number;
    /**
     * [KO] HeightFog 인스턴스를 생성합니다.
     * [EN] Creates a HeightFog instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
}
export default HeightFog;
