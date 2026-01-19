import ColorRGB from "../../../../color/ColorRGB";
import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] 안개(Fog) 후처리 이펙트입니다.
 * [EN] Fog post-processing effect.
 *
 * [KO] 지수/지수제곱 타입, 밀도, 시작/끝 거리, 색상 등 다양한 안개 효과를 지원합니다.
 * [EN] Supports various fog effects including Exponential/Exponential Squared types, density, near/far distance, and color.
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
     * [KO] 안개 타입 (0: 지수, 1: 지수제곱)
     * [EN] Fog type (0: Exponential, 1: Exponential Squared)
     * @defaultValue 0
     */
    #fogType: number = Fog.EXPONENTIAL;
    /**
     * [KO] 안개 밀도 (0 ~ 1)
     * [EN] Fog density (0 ~ 1)
     * @defaultValue 0.05
     */
    #density: number = 0.05;
    /**
     * [KO] 안개 시작 거리
     * [EN] Fog near distance
     * @defaultValue 4.5
     */
    #nearDistance: number = 4.5;
    /**
     * [KO] 안개 끝 거리
     * [EN] Fog far distance
     * @defaultValue 50.0
     */
    #farDistance: number = 50.0;
    /**
     * [KO] 안개 색상 (RGB)
     * [EN] Fog color (RGB)
     */
    #fogColor: ColorRGB;

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
        this.useDepthTexture = true;
        this.init(
            redGPUContext,
            'POST_EFFECT_FOG',
            createBasicPostEffectCode(this, computeCode, uniformStructCode)
        );
        // ColorRGB 초기화 (onChange 콜백과 함께)
        this.#fogColor = new ColorRGB(178, 178, 204, () => {
            this.updateUniform('fogColor', this.#fogColor.rgbNormalLinear);
        });
        // 초기값 설정 (카메라 관련 필드 제거)
        this.fogType = this.#fogType;
        this.density = this.#density;
        this.nearDistance = this.#nearDistance;
        this.farDistance = this.#farDistance;
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
     * [KO] 안개 밀도를 설정합니다. (0 ~ 1)
     * [EN] Sets the fog density. (0 ~ 1)
     */
    set density(value: number) {
        validateNumberRange(value, 0, 1);
        this.#density = Math.max(0, Math.min(1, value));
        this.updateUniform('density', this.#density);
    }

    /**
     * [KO] 안개 시작 거리를 반환합니다.
     * [EN] Returns the fog near distance.
     */
    get nearDistance(): number {
        return this.#nearDistance;
    }

    /**
     * [KO] 안개 시작 거리를 설정합니다. (최소 0.1)
     * [EN] Sets the fog near distance. (Minimum 0.1)
     */
    set nearDistance(value: number) {
        validateNumberRange(value, 0);
        this.#nearDistance = Math.max(0.1, value);
        if (this.#farDistance <= this.#nearDistance) {
            this.#farDistance = this.#nearDistance + 0.1;
            this.updateUniform('farDistance', this.#farDistance);
        }
        this.updateUniform('nearDistance', this.#nearDistance);
    }

    /**
     * [KO] 안개 끝 거리를 반환합니다.
     * [EN] Returns the fog far distance.
     */
    get farDistance(): number {
        return this.#farDistance;
    }

    /**
     * [KO] 안개 끝 거리를 설정합니다. (nearDistance + 0.1 이상)
     * [EN] Sets the fog far distance. (Greater than nearDistance + 0.1)
     */
    set farDistance(value: number) {
        validateNumberRange(value, 0);
        this.#farDistance = Math.max(this.#nearDistance + 0.1, value);
        this.updateUniform('farDistance', this.#farDistance);
    }

    /**
     * [KO] 안개 색상을 반환합니다.
     * [EN] Returns the fog color.
     */
    get fogColor(): ColorRGB {
        return this.#fogColor;
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

Object.freeze(Fog);
export default Fog;
