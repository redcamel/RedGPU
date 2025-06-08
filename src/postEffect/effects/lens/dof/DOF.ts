import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import AMultiPassPostEffect from "../../../core/AMultiPassPostEffect";
import DOFCoC from "./DOFCoC";
import DOFComposite from "./DOFComposite";
import DOFFarField from "./DOFFarField";
import DOFNearFarBlend from "./DOFNearFarBlend";
import DOFNearField from "./DOFNearField";

class DOF extends AMultiPassPostEffect {
	#effect_coc: DOFCoC
	#effect_nearField: DOFNearField
	#effect_farField: DOFFarField
	#effect_nearFarBlend: DOFNearFarBlend
	#effect_composite: DOFComposite
	#focusDistance: number = 15.0    // 카메라 거리와 동일 (중앙 오브젝트에 포커스)
	#aperture: number = 2.8          // 적당한 조리개 (F/2.8, 자연스러운 효과)
	#maxCoC: number = 25.0           // 적당한 흐림 원
	#nearBlurSize: number = 15       // 근거리 블러 크기
	#farBlurSize: number = 15        // 원거리 블러 크기
	#nearStrength: number = 1.0      // 적당한 근거리 강도
	#farStrength: number = 1.0       // 적당한 원거리 강도
	#nearPlane: number = 0.1
	#farPlane: number = 1000.0

	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			[
				new DOFCoC(redGPUContext),
				new DOFNearField(redGPUContext),
				new DOFFarField(redGPUContext),
				new DOFNearFarBlend(redGPUContext),
				new DOFComposite(redGPUContext),
			],
		);
		this.#effect_coc = this.passList[0] as DOFCoC
		this.#effect_nearField = this.passList[1] as DOFNearField
		this.#effect_farField = this.passList[2] as DOFFarField
		this.#effect_nearFarBlend = this.passList[3] as DOFNearFarBlend
		this.#effect_composite = this.passList[4] as DOFComposite
		this.#effect_coc.focusDistance = this.#focusDistance
		this.#effect_coc.aperture = this.#aperture
		this.#effect_coc.maxCoC = this.#maxCoC
		this.#effect_coc.nearPlane = this.#nearPlane
		this.#effect_coc.farPlane = this.#farPlane
		this.#effect_nearField.blurSize = this.#nearBlurSize
		this.#effect_farField.blurSize = this.#farBlurSize
		this.#effect_nearFarBlend.nearStrength = this.#nearStrength
		this.#effect_nearFarBlend.farStrength = this.#farStrength
	}

	get focusDistance(): number {
		return this.#focusDistance;
	}

	set focusDistance(value: number) {
		this.#focusDistance = value;
		this.#effect_coc.focusDistance = value
	}

	get aperture(): number {
		return this.#aperture;
	}

	set aperture(value: number) {
		this.#aperture = value;
		this.#effect_coc.aperture = value
	}

	get maxCoC(): number {
		return this.#maxCoC;
	}

	set maxCoC(value: number) {
		this.#maxCoC = value;
		this.#effect_coc.maxCoC = value
	}

	get nearPlane(): number {
		return this.#nearPlane;
	}

	set nearPlane(value: number) {
		this.#nearPlane = value;
		this.#effect_coc.nearPlane = value
	}

	get farPlane(): number {
		return this.#farPlane;
	}

	set farPlane(value: number) {
		this.#farPlane = value;
		this.#effect_coc.farPlane = value
	}

	get nearBlurSize(): number {
		return this.#nearBlurSize;
	}

	set nearBlurSize(value: number) {
		this.#nearBlurSize = value;
		this.#effect_nearField.blurSize = value
	}

	get farBlurSize(): number {
		return this.#farBlurSize;
	}

	set farBlurSize(value: number) {
		this.#farBlurSize = value;
		this.#effect_farField.blurSize = value
	}

	get nearStrength(): number {
		return this.#nearStrength;
	}

	set nearStrength(value: number) {
		this.#nearStrength = value;
		this.#effect_nearFarBlend.nearStrength = value
	}

	get farStrength(): number {
		return this.#farStrength;
	}

	set farStrength(value: number) {
		this.#farStrength = value;
		this.#effect_nearFarBlend.farStrength = value
	}

	render(view: View3D, width: number, height: number, sourceTextureView: GPUTextureView) {
		const cocResult = this.#effect_coc.render(
			view, width, height, sourceTextureView
		)
		const nearResult = this.#effect_nearField.render(
			view, width, height, sourceTextureView, cocResult
		)
		const farResult = this.#effect_farField.render(
			view, width, height, sourceTextureView, cocResult
		)
		const blendedResult = this.#effect_nearFarBlend.render(
			view, width, height, sourceTextureView, nearResult, farResult
		)
		return this.#effect_composite.render(
			view, width, height, blendedResult, cocResult
		)
	}
}

Object.freeze(DOF)
export default DOF
