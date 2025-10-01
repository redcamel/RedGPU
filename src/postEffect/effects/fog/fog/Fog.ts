import ColorRGB from "../../../../color/ColorRGB";
import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * 안개(Fog) 후처리 이펙트입니다.
 * 지수/지수제곱 타입, 밀도, 시작/끝 거리, 색상 등 다양한 안개 효과를 지원합니다.
 *
 * @category Fog
 *
 * @example
 * ```javascript
 * const effect = new RedGPU.PostEffect.Fog(redGPUContext);
 * effect.fogType = RedGPU.PostEffect.Fog.EXPONENTIAL_SQUARED;
 * effect.density = 0.1;
 * effect.nearDistance = 5.0;
 * effect.farDistance = 40.0;
 * effect.fogColor.setRGB(200, 220, 255);
 * view.postEffectManager.addEffect(effect);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/postEffect/fog/fog/"></iframe>
 */
class Fog extends ASinglePassPostEffect {
	/** 지수 안개 타입 */
	static EXPONENTIAL = 0;
	/** 지수제곱 안개 타입 */
	static EXPONENTIAL_SQUARED = 1;
	/** 안개 타입. 0=지수, 1=지수제곱. 기본값 0 */
	#fogType: number = Fog.EXPONENTIAL;
	/** 안개 밀도. 0~1, 기본값 0.05 */
	#density: number = 0.05;
	/** 안개 시작 거리. 기본값 4.5 */
	#nearDistance: number = 4.5;
	/** 안개 끝 거리. 기본값 50.0 */
	#farDistance: number = 50.0;
	/** 안개 색상(RGB) */
	#fogColor: ColorRGB;

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
			this.updateUniform('fogColor', this.#fogColor.rgbNormal);
		});
		// 초기값 설정 (카메라 관련 필드 제거)
		this.fogType = this.#fogType;
		this.density = this.#density;
		this.nearDistance = this.#nearDistance;
		this.farDistance = this.#farDistance;
	}

	/** 안개 타입 반환 */
	get fogType(): number {
		return this.#fogType;
	}

	/** 안개 타입 설정. 0 또는 1 */
	set fogType(value: number) {
		validateNumberRange(value, 0, 1);
		this.#fogType = Math.floor(value);
		this.updateUniform('fogType', this.#fogType);
	}

	/** 안개 밀도 반환 */
	get density(): number {
		return this.#density;
	}

	/** 안개 밀도 설정. 0~1 */
	set density(value: number) {
		validateNumberRange(value, 0, 1);
		this.#density = Math.max(0, Math.min(1, value));
		this.updateUniform('density', this.#density);
	}

	/** 안개 시작 거리 반환 */
	get nearDistance(): number {
		return this.#nearDistance;
	}

	/** 안개 시작 거리 설정. 최소 0.1 */
	set nearDistance(value: number) {
		validateNumberRange(value, 0);
		this.#nearDistance = Math.max(0.1, value);
		if (this.#farDistance <= this.#nearDistance) {
			this.#farDistance = this.#nearDistance + 0.1;
			this.updateUniform('farDistance', this.#farDistance);
		}
		this.updateUniform('nearDistance', this.#nearDistance);
	}

	/** 안개 끝 거리 반환 */
	get farDistance(): number {
		return this.#farDistance;
	}

	/** 안개 끝 거리 설정. nearDistance+0.1 이상 */
	set farDistance(value: number) {
		validateNumberRange(value, 0);
		this.#farDistance = Math.max(this.#nearDistance + 0.1, value);
		this.updateUniform('farDistance', this.#farDistance);
	}

	/** 안개 색상 반환 (ColorRGB) */
	get fogColor(): ColorRGB {
		return this.#fogColor;
	}

	render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult) {
		return super.render(view, width, height, sourceTextureInfo);
	}
}

Object.freeze(Fog);
export default Fog;
