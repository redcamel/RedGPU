import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
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
declare class SSR extends ASinglePassPostEffect {
    #private;
    /**
     * [KO] SSR 인스턴스를 생성합니다.
     * [EN] Creates an SSR instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 최대 스텝 수를 반환합니다.
     * [EN] Returns the max steps.
     */
    get maxSteps(): number;
    /**
     * [KO] 최대 스텝 수를 설정합니다. (1 ~ 512)
     * [EN] Sets the max steps. (1 ~ 512)
     */
    set maxSteps(value: number);
    /**
     * [KO] 최대 반사 거리를 반환합니다.
     * [EN] Returns the max reflection distance.
     */
    get maxDistance(): number;
    /**
     * [KO] 최대 반사 거리를 설정합니다. (1.0 ~ 200.0)
     * [EN] Sets the max reflection distance. (1.0 ~ 200.0)
     */
    set maxDistance(value: number);
    /**
     * [KO] 스텝 크기를 반환합니다.
     * [EN] Returns the step size.
     */
    get stepSize(): number;
    /**
     * [KO] 스텝 크기를 설정합니다. (0.001 ~ 5.0)
     * [EN] Sets the step size. (0.001 ~ 5.0)
     */
    set stepSize(value: number);
    /**
     * [KO] 반사 강도를 반환합니다.
     * [EN] Returns the reflection intensity.
     */
    get reflectionIntensity(): number;
    /**
     * [KO] 반사 강도를 설정합니다. (0.0 ~ 5.0)
     * [EN] Sets the reflection intensity. (0.0 ~ 5.0)
     */
    set reflectionIntensity(value: number);
    /**
     * [KO] 페이드 거리를 반환합니다.
     * [EN] Returns the fade distance.
     */
    get fadeDistance(): number;
    /**
     * [KO] 페이드 거리를 설정합니다. (1.0 ~ 100.0)
     * [EN] Sets the fade distance. (1.0 ~ 100.0)
     */
    set fadeDistance(value: number);
    /**
     * [KO] 에지 페이드를 반환합니다.
     * [EN] Returns the edge fade.
     */
    get edgeFade(): number;
    /**
     * [KO] 에지 페이드를 설정합니다. (0.0 ~ 0.5)
     * [EN] Sets the edge fade. (0.0 ~ 0.5)
     */
    set edgeFade(value: number);
}
export default SSR;
