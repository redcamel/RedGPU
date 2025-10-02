import RedGPUContext from "../../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
/**
 * 비네팅(Vignetting) 후처리 이펙트입니다.
 * 화면 가장자리를 어둡게 하여 집중도를 높이는 효과를 만듭니다.
 * size(범위), smoothness(부드러움)를 조절할 수 있습니다.
 *
 * @category Lens
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Vignetting(redGPUContext);
 * effect.size = 0.6;        // 비네팅 범위
 * effect.smoothness = 0.3;  // 경계 부드러움
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/lens/vignetting/"></iframe>
 */
declare class Vignetting extends ASinglePassPostEffect {
    #private;
    constructor(redGPUContext: RedGPUContext);
    /** 비네팅 범위 반환 */
    get size(): number;
    /**
     * 비네팅 범위 설정
     * 최소값 0
     */
    set size(value: number);
    /** 비네팅 부드러움 반환 */
    get smoothness(): number;
    /**
     * 비네팅 부드러움 설정
     * 범위 0~1
     */
    set smoothness(value: number);
}
export default Vignetting;
