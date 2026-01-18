import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
/**
 * SSR(Screen Space Reflection) 후처리 이펙트입니다.
 * 화면 공간 반사 효과를 구현합니다. 최대 스텝, 거리, 스텝 크기, 반사 강도, 페이드 거리, 에지 페이드 등 다양한 파라미터를 지원합니다.
 *
 * @experimental
 * @example
 * ```javascript
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
 */
declare class SSR extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** 최대 스텝 수 반환 */
    get maxSteps(): number;
    /** 최대 스텝 수 설정. 1~512 */
    set maxSteps(value: number);
    /** 최대 반사 거리 반환 */
    get maxDistance(): number;
    /** 최대 반사 거리 설정. 1.0~200.0 */
    set maxDistance(value: number);
    /** 스텝 크기 반환 */
    get stepSize(): number;
    /** 스텝 크기 설정. 0.001~5.0 */
    set stepSize(value: number);
    /** 반사 강도 반환 */
    get reflectionIntensity(): number;
    /** 반사 강도 설정. 0.0~5.0 */
    set reflectionIntensity(value: number);
    /** 페이드 거리 반환 */
    get fadeDistance(): number;
    /** 페이드 거리 설정. 1.0~100.0 */
    set fadeDistance(value: number);
    /** 에지 페이드 반환 */
    get edgeFade(): number;
    /** 에지 페이드 설정. 0.0~0.5 */
    set edgeFade(value: number);
}
export default SSR;
