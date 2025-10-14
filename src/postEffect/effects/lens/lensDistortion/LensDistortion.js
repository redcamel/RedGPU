import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
/**
 * 렌즈 왜곡(Lens Distortion) 후처리 이펙트입니다.
 * 배럴/핀쿠션 왜곡, 중심 위치를 조절할 수 있습니다.
 *
 * @category Lens
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.LensDistortion(redGPUContext);
 * effect.barrelStrength = 0.2;      // 배럴 왜곡 강도
 * effect.pincushionStrength = 0.1;  // 핀쿠션 왜곡 강도
 * effect.centerX = 0.5;             // 왜곡 중심 X
 * effect.centerY = 0.5;             // 왜곡 중심 Y
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/lens/lensDistortion/"></iframe>
 */
class LensDistortion extends ASinglePassPostEffect {
    /** 배럴 왜곡 강도. 기본값 0.1, 최소 0 */
    #barrelStrength = 0.1;
    /** 핀쿠션 왜곡 강도. 기본값 0.0, 최소 0 */
    #pincushionStrength = 0.0;
    /** 왜곡 중심 X. 기본값 0 */
    #centerX = 0;
    /** 왜곡 중심 Y. 기본값 0 */
    #centerY = 0;
    constructor(redGPUContext) {
        super(redGPUContext);
        this.init(redGPUContext, 'POST_EFFECT_LENS_DISTORTION', createBasicPostEffectCode(this, computeCode, uniformStructCode));
        this.barrelStrength = this.#barrelStrength;
        this.pincushionStrength = this.#pincushionStrength;
        this.centerX = this.#centerX;
        this.centerY = this.#centerY;
    }
    /** 배럴 왜곡 강도 반환 */
    get barrelStrength() {
        return this.#barrelStrength;
    }
    /** 배럴 왜곡 강도 설정. 최소 0 */
    set barrelStrength(value) {
        validateNumberRange(value, 0);
        this.#barrelStrength = value;
        this.updateUniform('barrelStrength', value);
    }
    /** 핀쿠션 왜곡 강도 반환 */
    get pincushionStrength() {
        return this.#pincushionStrength;
    }
    /** 핀쿠션 왜곡 강도 설정. 최소 0 */
    set pincushionStrength(value) {
        validateNumberRange(value, 0);
        this.#pincushionStrength = value;
        this.updateUniform('pincushionStrength', value);
    }
    /** 왜곡 중심 X 반환 */
    get centerX() {
        return this.#centerX;
    }
    /** 왜곡 중심 X 설정 */
    set centerX(value) {
        validateNumber(value);
        this.#centerX = value;
        this.updateUniform('centerX', value);
    }
    /** 왜곡 중심 Y 반환 */
    get centerY() {
        return this.#centerY;
    }
    /** 왜곡 중심 Y 설정 */
    set centerY(value) {
        validateNumber(value);
        this.#centerY = value;
        this.updateUniform('centerY', value);
    }
}
Object.freeze(LensDistortion);
export default LensDistortion;
