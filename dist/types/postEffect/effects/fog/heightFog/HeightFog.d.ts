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
    /** [KO] 안개가 시작되는 카메라 기준 원거리 (m) [EN] Start distance from camera for fog (m) */
    startDepth: number;
    /** [KO] 안개가 최대 밀도에 도달하는 원거리 (m) [EN] End distance from camera for fog (m) */
    endDepth: number;
    /** [KO] 안개 계산 방식 (0: 지수형, 1: 지수제곱형) [EN] Fog calculation type (0: Exponential, 1: Exponential Squared) */
    fogType: number;
    /** [KO] 안개의 색상 [EN] Color of the fog */
    fogColor: string;
}
/**
 * [KO] 높이 기반 안개(Height Fog) 후처리 이펙트입니다.
 * [EN] Height Fog post-processing effect.
 *
 * [KO] 월드 좌표의 높이(Y축) 및 카메라 거리(startDepth~endDepth)를 기준으로 안개 농도를 결정하여 지표면 및 원경 지평선 안개를 시뮬레이션합니다.
 * [EN] Simulates fog effects near ground and distant horizons based on world height (Y-axis) and camera distance (startDepth~endDepth).
 */
declare class HeightFog extends ASinglePassPostEffect {
    static EXPONENTIAL: number;
    static EXPONENTIAL_SQUARED: number;
    constructor(redGPUContext: RedGPUContext);
}
export default HeightFog;
