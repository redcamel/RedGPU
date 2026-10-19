import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

import ColorRGB from "../../../../color/ColorRGB";
import definePositiveNumber from "../../../../defineProperty/funcs/number/definePositiveNumber";
import defineNumber from "../../../../defineProperty/funcs/number/defineNumber";
import defineUint from "../../../../defineProperty/funcs/number/defineUint";
import defineColorRGB from "../../../../defineProperty/funcs/color/defineColorRGB";

interface Fog {
    /**
     * [KO] 안개 밀도 (범위: 0 ~ 1, 기본값: 0.5)
     * [EN] Fog density (range: 0 to 1, default: 0.5)
     */
    density: number;
    /**
     * [KO] 안개 시작 거리 (최소값: 0, 기본값: 4.5)
     * [EN] Fog start distance from camera (min: 0, default: 4.5)
     */
    nearDistance: number;
    /**
     * [KO] 안개 최대 밀도 도달 거리 (최소값: 0.1, 기본값: 50)
     * [EN] Fog maximum density distance (min: 0.1, default: 50)
     */
    farDistance: number;
    /**
     * [KO] 안개 계산 방식 (`Fog.EXPONENTIAL`: 0, `Fog.EXPONENTIAL_SQUARED`: 1, 기본값: 0)
     * [EN] Fog calculation type (`Fog.EXPONENTIAL`: 0, `Fog.EXPONENTIAL_SQUARED`: 1, default: 0)
     */
    fogType: number;
    /**
     * [KO] 안개 색상 (기본값: '#1b2866')
     * [EN] Fog color (default: '#1b2866')
     */
    fogColor: ColorRGB
}

/**
 * [KO] 깊이 정보를 기반으로 원거리 물체를 안개 색상과 합성하는 거리 기반 안개 후처리 이펙트입니다.
 * [EN] Distance-based Fog post-processing effect that blends distant objects with fog color based on depth information.
 *
 * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.Fog(redGPUContext);
 * effect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL_SQUARED;
 * effect.density = 0.1;
 * effect.nearDistance = 5.0;
 * effect.farDistance = 40.0;
 * effect.fogColor.setRGB(200, 220, 255);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/fog/fog/" style="width:100%; height:500px;"></iframe>
 * @see [Fog example](/RedGPU/examples/postEffect/fog/fog/)
 * @category Fog
 */
class Fog extends ASinglePassPostEffect {
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
     * [KO] Fog 인스턴스를 생성합니다.
     * [EN] Creates a Fog instance.
     *
     * ### Example
     * ```typescript
     * const effect = new RedGPU.PostEffect.Fog(redGPUContext);
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
            'POST_EFFECT_FOG',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );

    }
}

definePositiveNumber(Fog, [
    {key: 'density', value: 0.5, min: 0, max: 1},
])
defineNumber(Fog, [
    {key: 'nearDistance', value: 4.5, min: 0},
    {key: 'farDistance', value: 50, min: 0.1},
])
defineUint(Fog, [
    {key: 'fogType', value: Fog.EXPONENTIAL, max: 1}
])
defineColorRGB(Fog, [
    {key: 'fogColor', value: '#1b2866'},
])
Object.freeze(Fog);
export default Fog;
