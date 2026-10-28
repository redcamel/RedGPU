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
     * [KO] 안개 밀도 (0 ~ 1)
     * [EN] Fog density (0 ~ 1)
     * @defaultValue 0.1
     */
    density: number;
    /**
     * [KO] 안개 시작 거리 (0 이상)
     * [EN] Fog start distance from camera (0 or greater)
     * @defaultValue 5.0
     */
    nearDistance: number;
    /**
     * [KO] 안개 최대 밀도 도달 거리 (0.1 이상)
     * [EN] Fog maximum density distance (0.1 or greater)
     * @defaultValue 50
     */
    farDistance: number;
    /**
     * [KO] 안개 계산 방식 (`Fog.EXPONENTIAL`: 0, `Fog.EXPONENTIAL_SQUARED`: 1)
     * [EN] Fog calculation type (`Fog.EXPONENTIAL`: 0, `Fog.EXPONENTIAL_SQUARED`: 1)
     * @defaultValue 0
     */
    fogType: number;
    /**
     * [KO] 안개 색상 객체 (`ColorRGB`)
     * [EN] Fog color object (`ColorRGB`)
     * @defaultValue '#c8d2ff'
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
 * effect.fogColor.setColorByRGB(200, 210, 255);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/fog/fog/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Fog example](/RedGPU/examples/postEffect/fog/fog/)
 * @category Fog
 */
class Fog extends ASinglePassPostEffect {
    /**
     * [KO] 지수(Exponential) 안개 타입 (`0`)
     * [EN] Exponential fog type (`0`)
     */
    static EXPONENTIAL = 0;
    /**
     * [KO] 지수제곱(Exponential Squared) 안개 타입 (`1`)
     * [EN] Exponential Squared fog type (`1`)
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
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {isLdr: true});
        this.init(
            redGPUContext,
            'POST_EFFECT_FOG',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );

    }
}

definePositiveNumber(Fog, [
    {key: 'density', value: 0.1, min: 0, max: 1},
])
defineNumber(Fog, [
    {key: 'nearDistance', value: 5.0, min: 0},
    {key: 'farDistance', value: 50, min: 0.1},
])
defineUint(Fog, [
    {key: 'fogType', value: Fog.EXPONENTIAL, max: 1}
])
defineColorRGB(Fog, [
    {key: 'fogColor', value: '#c8d2ff'},
])
Object.freeze(Fog);
export default Fog;
