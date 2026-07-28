import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import defineUint from "../../../../defineProperty/funcs/number/defineUint";
import defineColorRGB from "../../../../defineProperty/funcs/color/defineColorRGB";


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
class HeightFog extends ASinglePassPostEffect {
    static EXPONENTIAL = 0;
    static EXPONENTIAL_SQUARED = 1;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.init(
            redGPUContext,
            'POST_EFFECT_HEIGHT_FOG',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

definePositiveNumber(HeightFog, [
    {key: 'density', value: 1.0, min: 0, max: 5},
    {key: 'falloff', value: 0.1, min: 0.001, max: 2},
    {key: 'thickness', value: 100.0, min: 0.1},
    {key: 'startDepth', value: 0.0, min: 0.0},
    {key: 'endDepth', value: 0.0, min: 0.0},
])
defineNumber(HeightFog, [
    {key: 'baseHeight', value: 0.0},
])
defineUint(HeightFog, [
    {key: 'fogType', value: HeightFog.EXPONENTIAL, max: 1}
])
defineColorRGB(HeightFog, [
    {key: 'fogColor', value: '#1b2866'}
])
Object.freeze(HeightFog);
export default HeightFog;
