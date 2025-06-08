import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";

class DOFNearFarBlend extends ASinglePassPostEffect {
	#nearStrength: number = 1.0
	#farStrength: number = 1.0

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = this
		const computeCode = `
			struct Uniforms {
				nearStrength: f32,
				farStrength: f32,
			};
			@group(0) @binding(0) var sourceTexture0 : texture_storage_2d<rgba8unorm,read>; 
			@group(0) @binding(1) var sourceTexture1 : texture_storage_2d<rgba8unorm,read>; 
			@group(0) @binding(2) var sourceTexture2 : texture_storage_2d<rgba8unorm,read>; 
			@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba8unorm, write>;
			@group(1) @binding(1) var<uniform> uniforms: Uniforms;
			@compute @workgroup_size(${WORK_SIZE_X},${WORK_SIZE_Y},${WORK_SIZE_Z})
			fn main (
			  @builtin(global_invocation_id) global_id : vec3<u32>,
			){
				let index = vec2<u32>(global_id.xy);
				
				let originalColor = textureLoad(sourceTexture0, index);
				let nearColor = textureLoad(sourceTexture1, index);
				let farColor = textureLoad(sourceTexture2, index);
				
				var result = originalColor.rgb;
				
				if (nearColor.a > 0.01) {
					let nearBlend = nearColor.a * uniforms.nearStrength;
					result = mix(result, nearColor.rgb, nearBlend);
				}
				
				if (farColor.a > 0.01) {
					let farBlend = farColor.a * uniforms.farStrength;
					result = mix(result, farColor.rgb, farBlend);
				}
				
				textureStore(outputTexture, index, vec4<f32>(result, 1.0));
			};
		`
		this.init(
			redGPUContext,
			'POST_EFFECT_DOF_NEAR_FAR_BLEND',
			{
				msaa: computeCode,
				nonMsaa: computeCode
			}
		)
		this.nearStrength = this.#nearStrength
		this.farStrength = this.#farStrength
	}

	get nearStrength(): number {
		return this.#nearStrength;
	}

	set nearStrength(value: number) {
		validateNumberRange(value)
		this.#nearStrength = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.nearStrength, value)
	}

	get farStrength(): number {
		return this.#farStrength;
	}

	set farStrength(value: number) {
		validateNumberRange(value)
		this.#farStrength = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.farStrength, value)
	}

	render(view: View3D, width: number, height: number, originalTextureView: GPUTextureView, nearTextureView: GPUTextureView, farTextureView: GPUTextureView) {
		return super.render(view, width, height, originalTextureView, nearTextureView, farTextureView)
	}
}

export default DOFNearFarBlend
