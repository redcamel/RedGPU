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
    /**
     * [KO] 안개 밀도 (범위: 0 ~ 5, 기본값: 1.0)
     * [EN] Fog density (range: 0 to 5, default: 1.0)
     */
    density: number;
    /**
     * [KO] 안개 시작 월드 기준 높이 (기본값: 0.0)
     * [EN] Base height in world space where the fog starts (default: 0.0)
     */
    baseHeight: number;
    /**
     * [KO] 안개의 수직 두께 (최소값: 0.1, 기본값: 100.0)
     * [EN] Vertical thickness of the fog (min: 0.1, default: 100.0)
     */
    thickness: number;
    /**
     * [KO] 높이에 따른 안개 감쇠율 (범위: 0.001 ~ 2, 기본값: 0.1)
     * [EN] Fog falloff rate based on height (range: 0.001 to 2, default: 0.1)
     */
    falloff: number;
    /**
     * [KO] 안개 시작 카메라 거리 (최소값: 0.0, 기본값: 0.0)
     * [EN] Start distance from camera for fog (min: 0.0, default: 0.0)
     */
    startDepth: number;
    /**
     * [KO] 안개 최대 밀도 도달 거리 (최소값: 0.0, 기본값: 0.0)
     * [EN] End distance from camera for fog (min: 0.0, default: 0.0)
     */
    endDepth: number;
    /**
     * [KO] 안개 계산 방식 (`HeightFog.EXPONENTIAL`: 0, `HeightFog.EXPONENTIAL_SQUARED`: 1, 기본값: 0)
     * [EN] Fog calculation type (`HeightFog.EXPONENTIAL`: 0, `HeightFog.EXPONENTIAL_SQUARED`: 1, default: 0)
     */
    fogType: number;
    /**
     * [KO] 안개 색상 (기본값: '#1b2866')
     * [EN] Fog color (default: '#1b2866')
     */
    fogColor: string;
}

/**
 * [KO] 월드 좌표의 높이(Y축)와 카메라 거리를 기준으로 안개 농도를 계산하는 높이 기반 안개 후처리 이펙트입니다.
 * [EN] Height Fog post-processing effect that calculates fog density based on world height (Y-axis) and camera distance.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.HeightFog(redGPUContext);
 * effect.density = 1.5;
 * effect.baseHeight = 0.0;
 * effect.thickness = 50.0;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * @see [HeightFog example](/RedGPU/examples/postEffect/fog/heightFog/)
 * @category Fog
 */
class HeightFog extends ASinglePassPostEffect {
    /**
     * [KO] 지수 안개 타입 (0)
     * [EN] Exponential fog type (0)
     */
    static EXPONENTIAL = 0;
    /**
     * [KO] 지수제곱 안개 타입 (1)
     * [EN] Exponential Squared fog type (1)
     */
    static EXPONENTIAL_SQUARED = 1;

    /**
     * [KO] HeightFog 인스턴스를 생성합니다.
     * [EN] Creates a HeightFog instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.HeightFog(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
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
