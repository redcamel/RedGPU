import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";

class DOFFarField extends ASinglePassPostEffect {
	#blurSize: number = 24

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = this
		const computeCode = `
			struct Uniforms {
				blurSize: f32,
			};
			@group(0) @binding(0) var sourceTexture0 : texture_storage_2d<rgba8unorm,read>;
			@group(0) @binding(1) var sourceTexture1 : texture_storage_2d<rgba8unorm,read>;
			@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba8unorm, write>;
			@group(1) @binding(1) var<uniform> uniforms: Uniforms;
			@compute @workgroup_size(${WORK_SIZE_X},${WORK_SIZE_Y},${WORK_SIZE_Z})
			fn main (
			  @builtin(global_invocation_id) global_id : vec3<u32>,
			){
				let index = vec2<u32>(global_id.xy);
				let dimensions: vec2<u32> = textureDimensions(sourceTexture0);
				
				if (index.x >= dimensions.x || index.y >= dimensions.y) {
					return;
				}
				
				let cocValue = textureLoad(sourceTexture1, index).a;
				
				if (cocValue <= 0.0) {
					let originalColor = textureLoad(sourceTexture0, index);
					textureStore(outputTexture, index, vec4<f32>(originalColor.rgb, 0.0));
					return;
				}
				
				let blurRadius = cocValue * uniforms.blurSize;
				
				if (blurRadius < 0.5) {
					let originalColor = textureLoad(sourceTexture0, index);
					textureStore(outputTexture, index, vec4<f32>(originalColor.rgb, cocValue));
					return;
				}
				
				var sum: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
				var totalWeight = 0.0;
				
				let maxRadius = min(blurRadius, 24.0);
				let samples = 20;
				let angleStep = 6.28318530718 / f32(samples);
				
				for (var i = 0; i < samples; i = i + 1) {
					for (var r = 1.0; r <= maxRadius; r = r + 1.0) {
						let angle = f32(i) * angleStep;
						let offset = vec2<f32>(cos(angle) * r, sin(angle) * r);
						
						let samplePos = vec2<i32>(
							clamp(i32(f32(index.x) + offset.x), 0, i32(dimensions.x) - 1),
							clamp(i32(f32(index.y) + offset.y), 0, i32(dimensions.y) - 1)
						);
						
						let sampleColor = textureLoad(sourceTexture0, vec2<u32>(samplePos)).rgb;
						let sampleCoC = textureLoad(sourceTexture1, vec2<u32>(samplePos)).a;
						
						if (sampleCoC > 0.0) {
							var weight = 1.0 / (r * r + 1.0);
							
							if (sampleCoC >= cocValue * 0.8) {
								weight *= 1.5;
							}
							
							sum += sampleColor * weight;
							totalWeight += weight;
						}
					}
				}
				
				let originalColor = textureLoad(sourceTexture0, index).rgb;
				sum += originalColor * 0.3;
				totalWeight += 0.3;
				
				if (totalWeight > 0.0) {
					sum /= totalWeight;
					textureStore(outputTexture, index, vec4<f32>(sum, cocValue));
				} else {
					textureStore(outputTexture, index, vec4<f32>(originalColor, cocValue));
				}
			};
		`

		this.init(
			redGPUContext,
			'POST_EFFECT_DOF_FAR_FIELD',
			{
				msaa: computeCode,
				nonMsaa: computeCode
			}
		)
		this.blurSize = this.#blurSize
	}

	get blurSize(): number {
		return this.#blurSize;
	}

	set blurSize(value: number) {
		validateNumberRange(value)
		this.#blurSize = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.blurSize, value)
	}

	render(view: View3D, width: number, height: number, sourceTextureView: GPUTextureView, cocTextureView: GPUTextureView) {
		return super.render(view, width, height, sourceTextureView, cocTextureView)
	}
}

Object.freeze(DOFFarField)
export default DOFFarField
