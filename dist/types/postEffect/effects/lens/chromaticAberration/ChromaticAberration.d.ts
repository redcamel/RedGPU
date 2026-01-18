import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 색수차(Chromatic Aberration) 후처리 이펙트입니다.
 *
 * @category Lens
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.ChromaticAberration(redGPUContext);
 * effect.strength = 0.02;
 * effect.centerX = 0.5;
 * effect.centerY = 0.5;
 * effect.falloff = 1.0;
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/postEffect/lens/chromaticAberration/"></iframe>
 */
declare class ChromaticAberration extends ASinglePassPostEffect {
    #private;
    /**
     * ChromaticAberration 인스턴스 생성
     * @param redGPUContext 렌더링 컨텍스트
     */
    constructor(redGPUContext: RedGPUContext);
    /** 강도 반환 */
    get strength(): number;
    /**
     * 강도 설정
     * 최소값 0
     */
    set strength(value: number);
    /** 중심 X 반환 */
    get centerX(): number;
    /**
     * 중심 X 설정
     * 범위 0~1
     */
    set centerX(value: number);
    /** 중심 Y 반환 */
    get centerY(): number;
    /**
     * 중심 Y 설정
     * 범위 0~1
     */
    set centerY(value: number);
    /** falloff 반환 */
    get falloff(): number;
    /**
     * falloff 설정
     * 범위 0~5
     */
    set falloff(value: number);
}
export default ChromaticAberration;
