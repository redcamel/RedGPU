import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import {DefineUniformProperty} from "../../../../defineProperty";

interface HeightFog {
    density: number;
    baseHeight: number;
    thickness: number;
    falloff: number;
    fogType: number;
    fogColor: string;
}

/**
 * [KO] 높이 기반 안개(Height Fog) 후처리 이펙트입니다.
 * [EN] Height Fog post-processing effect.
 *
 * [KO] 안개 타입, 밀도, 시작 높이, 두께, 감쇠율, 색상 등 다양한 파라미터를 지원합니다.
 * [EN] Supports various parameters such as fog type, density, base height, thickness, falloff, and color.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.HeightFog(redGPUContext);
 * effect.fogType = RedGPU.PostEffect.HeightFog.EXPONENTIAL_SQUARED;
 * effect.density = 0.5;
 * effect.baseHeight = 10.0;
 * effect.thickness = 80.0;
 * effect.falloff = 0.2;
 * effect.fogColor.setRGB(180, 200, 255);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/fog/heightFog/"></iframe>
 * @category Fog
 */
class HeightFog extends ASinglePassPostEffect {
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
     * [KO] HeightFog 인스턴스를 생성합니다.
     * [EN] Creates a HeightFog instance.
     *
     * @param redGPUContext
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

DefineUniformProperty.definePositiveNumber(HeightFog, [
    {key: 'density', value: 1.0, min: 0, max: 5},
    {key: 'falloff', value: 0.1, min: 0.001, max: 2},
    {key: 'thickness', value: 100.0, min: 0.1},
])
DefineUniformProperty.defineNumber(HeightFog, [
    {key: 'baseHeight', value: 0.0},

])
DefineUniformProperty.defineUint(HeightFog, [
    {key: 'fogType', value: HeightFog.EXPONENTIAL, max: 1}
])
DefineUniformProperty.defineColorRGB(HeightFog, [
    {key: 'fogColor', value: '#1b2866'}
])
Object.freeze(HeightFog);
export default HeightFog;
