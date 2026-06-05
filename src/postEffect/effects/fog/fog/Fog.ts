import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineGPUProperty from "../../../../defineProperty/DefineGPUProperty";
import ColorRGB from "../../../../color/ColorRGB";

interface Fog {
    /** [KO] 안개의 밀도 (0 ~ 1) [EN] Density of the fog (0 ~ 1) */
    density: number;
    /** [KO] 안개가 시작되는 카메라로부터의 거리 [EN] Distance from the camera where the fog starts */
    nearDistance: number;
    /** [KO] 안개가 최대 밀도에 도달하는 거리 [EN] Distance where the fog reaches maximum density */
    farDistance: number;
    /** [KO] 안개 계산 방식 (0: 지수형, 1: 지수제곱형) [EN] Fog calculation type (0: Exponential, 1: Exponential Squared) */
    fogType: number;
    /** [KO] 안개의 색상 [EN] Color of the fog */
    fogColor: ColorRGB
}

/**
 * [KO] 거리 기반 안개(Fog) 후처리 이펙트입니다.
 * [EN] Distance-based Fog post-processing effect.
 *
 * [KO] 장면의 깊이 정보를 기반으로 원거리의 물체를 안개 색상과 합성하여 공간감을 부여합니다.
 * [EN] Blends distant objects with the fog color based on the scene's depth information to provide a sense of space.
 *
 * [KO] 이 효과는 HDR 공간에서 동작하여 스카이박스 및 밝은 광원과의 자연스러운 대기 산란 합성을 지원합니다.
 * [EN] This effect operates in HDR space, supporting natural atmospheric scattering composition with the skybox and bright light sources.
 *
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

DefineGPUProperty.definePositiveNumber(Fog, [
    {key: 'density', value: 0.5, min: 0, max: 1},
])
DefineGPUProperty.defineNumber(Fog, [
    {key: 'nearDistance', value: 4.5, min: 0},
    {key: 'farDistance', value: 50, min: 0.1},
])
DefineGPUProperty.defineUint(Fog, [
    {key: 'fogType', value: Fog.EXPONENTIAL, max: 1}
])
DefineGPUProperty.defineColorRGB(Fog, [
    {key: 'fogColor', value: '#1b2866'},
])
Object.freeze(Fog);
export default Fog;
