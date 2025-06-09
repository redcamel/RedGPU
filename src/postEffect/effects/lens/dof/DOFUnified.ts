import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import validateNumberRange from "../../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";

class DOFUnified extends ASinglePassPostEffect {
	#nearBlurSize: number = 16;
	#farBlurSize: number = 24;
	#nearStrength: number = 1.0;
	#farStrength: number = 1.0;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = this;
		const computeCode = `
            struct Uniforms {
                nearBlurSize: f32,
                farBlurSize: f32,
                nearStrength: f32,
                farStrength: f32,
            };
            
            @group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba8unorm,read>;
            @group(0) @binding(1) var cocTexture : texture_storage_2d<rgba8unorm,read>;
            @group(1) @binding(0) var outputTexture : texture_storage_2d<rgba8unorm, write>;
            @group(1) @binding(1) var<uniform> uniforms: Uniforms;
            
            @compute @workgroup_size(${WORK_SIZE_X},${WORK_SIZE_Y},${WORK_SIZE_Z})
            fn main (@builtin(global_invocation_id) global_id : vec3<u32>) {
                let index = vec2<u32>(global_id.xy);
                let dimensions: vec2<u32> = textureDimensions(sourceTexture);
                
                if (index.x >= dimensions.x || index.y >= dimensions.y) {
                    return;
                }
                
                let originalColor = textureLoad(sourceTexture, index).rgb;
                let cocValue = textureLoad(cocTexture, index).a;
                
                if (abs(cocValue) < 0.02) {
                    textureStore(outputTexture, index, vec4<f32>(originalColor, 1.0));
                    return;
                }
                
                var finalColor = originalColor;
                
                if (cocValue < 0.0) {
                    let nearBlur = calculateBlur(index, abs(cocValue), uniforms.nearBlurSize, true);
                    let nearBlend = saturate(abs(cocValue) * uniforms.nearStrength);
                    finalColor = mix(originalColor, nearBlur, nearBlend);
                }
                else if (cocValue > 0.0) {
                    let farBlur = calculateBlur(index, cocValue, uniforms.farBlurSize, false);
                    let rawBlend = cocValue * uniforms.farStrength;
                    let farBlend = saturate(smoothstep(0.0, 0.8, rawBlend));
                    finalColor = mix(originalColor, farBlur, farBlend);
                }
                
                textureStore(outputTexture, index, vec4<f32>(finalColor, 1.0));
            }
            
            fn calculateBlur(center: vec2<u32>, intensity: f32, maxBlurSize: f32, isNear: bool) -> vec3<f32> {
                let dimensions: vec2<u32> = textureDimensions(sourceTexture);
                let blurRadius = intensity * maxBlurSize;
                
                if (blurRadius < 0.5) {
                    return textureLoad(sourceTexture, center).rgb;
                }
                
                var sum: vec3<f32> = vec3<f32>(0.0);
                var totalWeight = 0.0;
                
                let maxRadius = min(blurRadius, maxBlurSize);
                let samples = select(12, 8, isNear); 
                let angleStep = 6.28318530718 / f32(samples);
                
                let originalColor = textureLoad(sourceTexture, center).rgb;
                let centerWeight = select(0.4, 0.3, isNear);
                sum += originalColor * centerWeight;
                totalWeight += centerWeight;
                
                for (var i = 0; i < samples; i = i + 1) {
                    for (var r = 1.0; r <= maxRadius; r = r + 1.0) {
                        let angle = f32(i) * angleStep;
                        let offset = vec2<f32>(cos(angle) * r, sin(angle) * r);
                        
                        let samplePos = vec2<i32>(
                            clamp(i32(f32(center.x) + offset.x), 0, i32(dimensions.x) - 1),
                            clamp(i32(f32(center.y) + offset.y), 0, i32(dimensions.y) - 1)
                        );
                        
                        let sampleColor = textureLoad(sourceTexture, vec2<u32>(samplePos)).rgb;
                        let sampleCoC = textureLoad(cocTexture, vec2<u32>(samplePos)).a;
                        
                        var weight = exp(-r * r / (maxRadius * maxRadius * 0.5));
                        
                        if (isNear) {
                            if (sampleCoC < 0.0 && abs(sampleCoC) >= intensity * 0.7) {
                                weight *= 1.2;
                            }
                        } else {
                            if (sampleCoC > 0.0 && sampleCoC >= intensity * 0.7) {
                                weight *= 1.2;
                            }
                        }
                        
                        sum += sampleColor * weight;
                        totalWeight += weight;
                    }
                }
                
                if (totalWeight > 0.0) {
                    return sum / totalWeight;
                } else {
                    return originalColor;
                }
            }
        `;
		this.init(
			redGPUContext,
			'POST_EFFECT_DOF_UNIFIED',
			{
				msaa: computeCode,
				nonMsaa: computeCode
			}
		);
		this.nearBlurSize = this.#nearBlurSize;
		this.farBlurSize = this.#farBlurSize;
		this.nearStrength = this.#nearStrength;
		this.farStrength = this.#farStrength;
	}

	get nearBlurSize(): number { return this.#nearBlurSize; }

	set nearBlurSize(value: number) {
		validateNumberRange(value);
		this.#nearBlurSize = value;
		this.updateUniform('nearBlurSize', value)
	}

	get farBlurSize(): number { return this.#farBlurSize; }

	set farBlurSize(value: number) {
		validateNumberRange(value);
		this.#farBlurSize = value;
		this.updateUniform('farBlurSize', value)
	}

	get nearStrength(): number { return this.#nearStrength; }

	set nearStrength(value: number) {
		validateNumberRange(value);
		this.#nearStrength = value;
		this.updateUniform('nearStrength', value)
	}

	get farStrength(): number { return this.#farStrength; }

	set farStrength(value: number) {
		validateNumberRange(value);
		this.#farStrength = value;
		this.updateUniform('farStrength', value)
	}

	render(view: View3D, width: number, height: number, sourceTextureView: GPUTextureView, cocTextureView: GPUTextureView) {
		return super.render(view, width, height, sourceTextureView, cocTextureView);
	}
}

Object.freeze(DOFUnified);
export default DOFUnified;
