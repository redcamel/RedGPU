import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"
import DefineUniformProperty from "../../../defineProperty/DefineUniformProperty";
interface SSR {
    maxSteps: number;
    maxDistance: number;
    stepSize: number;
    reflectionIntensity: number;
    fadeDistance: number;
    edgeFade: number;
}
/**
 * [KO] SSR(Screen Space Reflection) 후처리 이펙트입니다.
 * [EN] SSR (Screen Space Reflection) post-processing effect.
 *
 * [KO] 화면 공간 반사 효과를 구현합니다. 최대 스텝, 거리, 스텝 크기, 반사 강도, 페이드 거리, 에지 페이드 등 다양한 파라미터를 지원합니다.
 * [EN] Implements screen space reflection effects. Supports various parameters such as max steps, distance, step size, reflection intensity, fade distance, and edge fade.
 * * ### Example
 * ```typescript
 * const effect = new RedGPU.PostEffect.SSR(redGPUContext);
 * effect.maxSteps = 128;            // 최대 스텝 수
 * effect.maxDistance = 20.0;        // 최대 반사 거리
 * effect.stepSize = 0.05;           // 스텝 크기
 * effect.reflectionIntensity = 1.2; // 반사 강도
 * effect.fadeDistance = 15.0;       // 페이드 거리
 * effect.edgeFade = 0.2;            // 에지 페이드
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/ssr/ssr/"></iframe>
 * @category PostEffect
 */
class SSR extends ASinglePassPostEffect {

    /**
     * [KO] SSR 인스턴스를 생성합니다.
     * [EN] Creates an SSR instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {x: 8, y: 8, z: 1});
        this.init(
            redGPUContext,
            'POST_EFFECT_SSR',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
    }
}

DefineUniformProperty.definePositiveNumber(SSR, [
    {key: 'maxSteps', value: 64, min: 1, max: 512},
    {key: 'maxDistance', value: 15.0, min: 1.0, max: 200.0},
    {key: 'stepSize', value: 0.02, min: 0.001, max: 5.0},
    {key: 'reflectionIntensity', value: 1, min: 0.0, max: 10},
    {key: 'fadeDistance', value: 12.0, min: 1.0, max: 100.0},
    {key: 'edgeFade', value: 0.15, min: 0.0, max: 0.5}
])
Object.freeze(SSR);
export default SSR;
