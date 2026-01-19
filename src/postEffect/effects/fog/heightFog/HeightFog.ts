import ColorRGB from "../../../../color/ColorRGB";
import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

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
     * [KO] 안개 타입 (0: 지수, 1: 지수제곱)
     * [EN] Fog type (0: Exponential, 1: Exponential Squared)
     * @defaultValue 0
     */
    #fogType: number = HeightFog.EXPONENTIAL;
    /**
     * [KO] 안개 밀도 (0 ~ 5)
     * [EN] Fog density (0 ~ 5)
     * @defaultValue 1.0
     */
    #density: number = 1.0;
    /**
     * [KO] 안개 색상 (RGB)
     * [EN] Fog color (RGB)
     */
    #fogColor: ColorRGB;
    /**
     * [KO] 안개 시작 높이
     * [EN] Fog base height
     * @defaultValue 0.0
     */
    #baseHeight: number = 0.0;
    /**
     * [KO] 안개 레이어 두께
     * [EN] Fog layer thickness
     * @defaultValue 100.0
     */
    #thickness: number = 100.0;
    /**
     * [KO] 높이별 감쇠율
     * [EN] Height falloff
     * @defaultValue 0.1
     */
    #falloff: number = 0.1;

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
        this.useDepthTexture = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_HEIGHT_FOG',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
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

    /**
     * [KO] 안개 타입을 반환합니다.
     * [EN] Returns the fog type.
     */
    get fogType(): number {
        return this.#fogType;
    }

    /**
     * [KO] 안개 타입을 설정합니다. (0 또는 1)
     * [EN] Sets the fog type. (0 or 1)
     */
    set fogType(value: number) {
        validateNumberRange(value, 0, 1);
        this.#fogType = Math.floor(value);
        this.updateUniform('fogType', this.#fogType);
    }

    /**
     * [KO] 안개 밀도를 반환합니다.
     * [EN] Returns the fog density.
     */
    get density(): number {
        return this.#density;
    }

    /**
     * [KO] 안개 밀도를 설정합니다. (0 ~ 5)
     * [EN] Sets the fog density. (0 ~ 5)
     */
    set density(value: number) {
        validateNumberRange(value, 0, 5);
        this.#density = Math.max(0, Math.min(5, value));
        this.updateUniform('density', this.#density);
    }

    /**
     * [KO] 안개 색상을 반환합니다.
     * [EN] Returns the fog color.
     */
    get fogColor(): ColorRGB {
        return this.#fogColor;
    }

    /**
     * [KO] 안개 시작 높이를 반환합니다.
     * [EN] Returns the fog base height.
     */
    get baseHeight(): number {
        return this.#baseHeight;
    }

    /**
     * [KO] 안개 시작 높이를 설정합니다.
     * [EN] Sets the fog base height.
     */
    set baseHeight(value: number) {
        validateNumberRange(value);
        this.#baseHeight = value;
        this.updateUniform('baseHeight', this.#baseHeight);
        // thickness 기반으로 maxHeight 자동 계산
        this.updateUniform('maxHeight', this.maxHeight);
    }

    /**
     * [KO] 안개 최대 높이를 반환합니다. (baseHeight + thickness)
     * [EN] Returns the fog max height. (baseHeight + thickness)
     */
    get maxHeight(): number {
        return this.#baseHeight + this.#thickness
    }

    /**
     * [KO] 안개 레이어 두께를 반환합니다.
     * [EN] Returns the fog layer thickness.
     */
    get thickness(): number {
        return this.#thickness;
    }

    /**
     * [KO] 안개 레이어 두께를 설정합니다. (최소 0.1)
     * [EN] Sets the fog layer thickness. (Minimum 0.1)
     */
    set thickness(value: number) {
        validateNumberRange(value, 0.1);
        this.#thickness = Math.max(0.1, value);
        // baseHeight + thickness로 maxHeight 계산
        this.updateUniform('maxHeight', this.#baseHeight + this.#thickness);
    }

    /**
     * [KO] 높이별 감쇠율을 반환합니다.
     * [EN] Returns the height falloff.
     */
    get falloff(): number {
        return this.#falloff;
    }

    /**
     * [KO] 높이별 감쇠율을 설정합니다. (0.001 ~ 2)
     * [EN] Sets the height falloff. (0.001 ~ 2)
     */
    set falloff(value: number) {
        validateNumberRange(value, 0, 2);
        this.#falloff = Math.max(0.001, Math.min(2, value));
        this.updateUniform('falloff', this.#falloff);
    }

    /**
     * [KO] 안개 효과를 렌더링합니다.
     * [EN] Renders the fog effect.
     *
     * @param view
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width
     * [KO] 너비
     * [EN] Width
     * @param height
     * [KO] 높이
     * [EN] Height
     * @param sourceTextureInfo
     * [KO] 소스 텍스처 정보
     * [EN] Source texture info
     * @returns
     * [KO] 렌더링 결과
     * [EN] Rendering result
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult) {
        return super.render(view, width, height, sourceTextureInfo);
    }
}

Object.freeze(HeightFog);
export default HeightFog;
