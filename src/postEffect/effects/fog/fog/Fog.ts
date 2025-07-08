import ColorRGB from "../../../../color/ColorRGB";
import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../../core/createBasicPostEffectCode";
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

class Fog extends ASinglePassPostEffect {
	static EXPONENTIAL = 0;
	static EXPONENTIAL_SQUARED = 1;
	#fogType: number = Fog.EXPONENTIAL;
	#density: number = 0.05;
	#nearDistance: number = 4.5;
	#farDistance: number = 50.0;
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

	get fogType(): number {
		return this.#fogType;
	}

	set fogType(value: number) {
		validateNumberRange(value, 0, 1);
		this.#fogType = Math.floor(value);
		this.updateUniform('fogType', this.#fogType);
	}

	get density(): number {
		return this.#density;
	}

	set density(value: number) {
		validateNumberRange(value, 0, 1);
		this.#density = Math.max(0, Math.min(1, value));
		this.updateUniform('density', this.#density);
	}

	get nearDistance(): number {
		return this.#nearDistance;
	}

	set nearDistance(value: number) {
		validateNumberRange(value,0);
		this.#nearDistance = Math.max(0.1, value);
		if (this.#farDistance <= this.#nearDistance) {
			this.#farDistance = this.#nearDistance + 0.1;
			this.updateUniform('farDistance', this.#farDistance);
		}
		this.updateUniform('nearDistance', this.#nearDistance);
	}

	get farDistance(): number {
		return this.#farDistance;
	}

	set farDistance(value: number) {
		validateNumberRange(value,0);
		this.#farDistance = Math.max(this.#nearDistance + 0.1, value);
		this.updateUniform('farDistance', this.#farDistance);
	}

	get fogColor(): ColorRGB {
		return this.#fogColor;
	}

	render(view: View3D, width: number, height: number, sourceTextureView: GPUTextureView) {
		return super.render(view, width, height, sourceTextureView);
	}
}

Object.freeze(Fog);
export default Fog;
