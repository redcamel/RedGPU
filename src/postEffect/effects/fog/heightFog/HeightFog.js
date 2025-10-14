import ColorRGB from "../../../../color/ColorRGB";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl";
import uniformStructCode from "./wgsl/uniformStructCode.wgsl";
/**
 * 높이 기반 안개(Height Fog) 후처리 이펙트입니다.
 * 안개 타입, 밀도, 시작 높이, 두께, 감쇠율, 색상 등 다양한 파라미터를 지원합니다.
 *
 * @category Fog
 *
 * @example
 * ```javascript
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
 * <iframe src="/RedGPU/examples/3d/postEffect/fog/heightFog/"></iframe>
 */
class HeightFog extends ASinglePassPostEffect {
    /** 지수 안개 타입 */
    static EXPONENTIAL = 0;
    /** 지수제곱 안개 타입 */
    static EXPONENTIAL_SQUARED = 1;
    /** 안개 타입. 0=지수, 1=지수제곱. 기본값 0 */
    #fogType = HeightFog.EXPONENTIAL;
    /** 안개 밀도. 0~5, 기본값 1.0 */
    #density = 1.0;
    /** 안개 색상(RGB) */
    #fogColor;
    /** 안개 시작 높이. 기본값 0.0 */
    #baseHeight = 0.0;
    /** 안개 레이어 두께. 기본값 100.0 */
    #thickness = 100.0;
    /** 높이별 감쇠율. 기본값 0.1 */
    #falloff = 0.1;
    constructor(redGPUContext) {
        super(redGPUContext);
        this.useDepthTexture = true;
        this.init(redGPUContext, 'POST_EFFECT_HEIGHT_FOG', createBasicPostEffectCode(this, computeCode, uniformStructCode));
        this.#fogColor = new ColorRGB(178, 178, 204, () => {
            this.updateUniform('fogColor', this.#fogColor.rgbNormal);
        });
        // 초기값 설정
        this.fogType = this.#fogType;
        this.density = this.#density;
        this.baseHeight = this.#baseHeight;
        this.thickness = this.#thickness;
        this.falloff = this.#falloff;
    }
    // 🎨 Fog Mode (Unity: Mode)
    get fogType() { return this.#fogType; }
    /** 안개 타입 설정. 0 또는 1 */
    set fogType(value) {
        validateNumberRange(value, 0, 1);
        this.#fogType = Math.floor(value);
        this.updateUniform('fogType', this.#fogType);
    }
    // 🌫️ Fog Density (Unity: Density)
    get density() { return this.#density; }
    /** 안개 밀도 설정. 0~5 */
    set density(value) {
        validateNumberRange(value, 0, 5);
        this.#density = Math.max(0, Math.min(5, value));
        this.updateUniform('density', this.#density);
    }
    /** 안개 색상 반환 (ColorRGB) */
    get fogColor() { return this.#fogColor; }
    /** 안개 시작 높이 반환 */
    get baseHeight() { return this.#baseHeight; }
    /** 안개 시작 높이 설정 */
    set baseHeight(value) {
        validateNumberRange(value);
        this.#baseHeight = value;
        this.updateUniform('baseHeight', this.#baseHeight);
        // thickness 기반으로 maxHeight 자동 계산
        this.updateUniform('maxHeight', this.maxHeight);
    }
    /** 안개 최대 높이 반환 (baseHeight+thickness) */
    get maxHeight() {
        return this.#baseHeight + this.#thickness;
    }
    // 📏 Thickness - 안개 레이어 두께 (Unity: Thickness)
    get thickness() { return this.#thickness; }
    /** 안개 레이어 두께 설정. 최소 0.1 */
    set thickness(value) {
        validateNumberRange(value, 0.1);
        this.#thickness = Math.max(0.1, value);
        // baseHeight + thickness로 maxHeight 계산
        this.updateUniform('maxHeight', this.#baseHeight + this.#thickness);
    }
    // 📉 Falloff - 높이별 감쇠율 (Unity: Falloff)
    get falloff() { return this.#falloff; }
    /** 높이별 감쇠율 설정. 0.001~2 */
    set falloff(value) {
        validateNumberRange(value, 0, 2);
        this.#falloff = Math.max(0.001, Math.min(2, value));
        this.updateUniform('falloff', this.#falloff);
    }
    render(view, width, height, sourceTextureInfo) {
        return super.render(view, width, height, sourceTextureInfo);
    }
}
Object.freeze(HeightFog);
export default HeightFog;
