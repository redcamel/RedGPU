import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineUniformProperty from "../../../../defineProperty/DefineUniformProperty";
import ColorRGB from "../../../../color/ColorRGB";

interface Fog {
    density: number;
    nearDistance: number;
    farDistance: number;
    fogType:number;
    fogColor:ColorRGB
}

/**
 * [KO] 안개(Fog) 후처리 이펙트입니다.
 * [EN] Fog post-processing effect.
 *
 * [KO] 지수/지수제곱 타입, 밀도, 시작/끝 거리, 색상 등 다양한 안개 효과를 지원합니다.
 * [EN] Supports various fog effects including Exponential/Exponential Squared types, density, near/far distance, and color.
 * * ### Example
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
 * <iframe src="/RedGPU/examples/postEffect/fog/fog/"></iframe>
 * @category Fog
 */
class Fog extends ASinglePassPostEffect {
    /**
     * [KO] 지수 안개 타입
     * [EN] Exponential fog type
     */
    static EXPONENTIAL = 0;
    /**
     * [KO] 지수제곱 안개 타입
     * [EN] Exponential Squared fog type
     */
    static EXPONENTIAL_SQUARED = 1;


    /**
     * [KO] Fog 인스턴스를 생성합니다.
     * [EN] Creates a Fog instance.
     *
     * @param redGPUContext
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

DefineUniformProperty.definePositiveNumber(Fog, [
    {key: 'density', value: 0.5, min: 0, max: 1},
])
DefineUniformProperty.defineNumber(Fog, [
    {key: 'nearDistance', value: 4.5, min: 0},
    {key: 'farDistance', value: 50, min: 0.1},
])
DefineUniformProperty.defineUint(Fog, [
    {key: 'fogType', value: Fog.EXPONENTIAL, max: 1}
])
DefineUniformProperty.defineColorRGB(Fog, [
    {key: 'fogColor', value: '#1b2866'},
])
Object.freeze(Fog);
export default Fog;
