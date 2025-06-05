import RedGPUContext from "../../../context/RedGPUContext";
import validateNumber from "../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createPostEffectCode from "../../core/createPostEffectCode";

class LensDistortion extends ASinglePassPostEffect {
	#barrelStrength: number = 0.1
	#pincushionStrength: number = 0.0
	#centerX: number = 0
	#centerY: number = 0

	constructor(redGPUContext: RedGPUContext) {
		super();
		const computeCode = createPostEffectCode(
			this,
			`
				let dimensions = textureDimensions(sourceTexture);
				let dimW = f32(dimensions.x);
				let dimH = f32(dimensions.y);
				
				let center = vec2<f32>(dimW * 0.5 + uniforms.centerX, dimH * 0.5 + uniforms.centerY);
				let global_id_vec = vec2<f32>(f32(global_id.x), f32(global_id.y));
				
				let uv = global_id_vec / vec2<f32>(dimW, dimH);
				let uvCenter = center / vec2<f32>(dimW, dimH);
				
				let offset = uv - uvCenter;
				let distance = length(offset);
				
				let barrelFactor = 1.0 + uniforms.barrelStrength * distance * distance;
				let pincushionFactor = 1.0 - uniforms.pincushionStrength * distance * distance;
				let distortionFactor = barrelFactor * pincushionFactor;
				
				let distortedUV = uvCenter + offset * distortionFactor;
				
				if (distortedUV.x < 0.0 || distortedUV.x > 1.0 || 
					distortedUV.y < 0.0 || distortedUV.y > 1.0) {
					textureStore(outputTexture, vec2<i32>(global_id.xy), vec4<f32>(0.0, 0.0, 0.0, 1.0));
				} else {
					let sampleCoord = vec2<i32>(
						i32(clamp(distortedUV.x * dimW, 0.0, dimW - 1.0)),
						i32(clamp(distortedUV.y * dimH, 0.0, dimH - 1.0))
					);
					
					let sampledColor = textureLoad(sourceTexture, sampleCoord).xyzw;
					textureStore(outputTexture, vec2<i32>(global_id.xy), sampledColor);
				}
			`,
			`
			struct Uniforms {
				barrelStrength: f32,
				pincushionStrength: f32,
				centerX: f32,
				centerY: f32
			};
			`
		)
		this.init(
			redGPUContext,
			'POST_EFFECT_LENS_DISTORTION',
			computeCode
		)
		this.barrelStrength = this.#barrelStrength
		this.pincushionStrength = this.#pincushionStrength
		this.centerX = this.#centerX
		this.centerY = this.#centerY
	}

	get barrelStrength(): number {
		return this.#barrelStrength;
	}

	set barrelStrength(value: number) {
		validateNumberRange(value, 0)
		this.#barrelStrength = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.barrelStrength, value)
	}

	get pincushionStrength(): number {
		return this.#pincushionStrength;
	}

	set pincushionStrength(value: number) {
		validateNumberRange(value, 0)
		this.#pincushionStrength = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.pincushionStrength, value)
	}

	get centerX(): number {
		return this.#centerX;
	}

	set centerX(value: number) {
		validateNumber(value)
		this.#centerX = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.centerX, value)
	}

	get centerY(): number {
		return this.#centerY;
	}

	set centerY(value: number) {
		validateNumber(value)
		this.#centerY = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.centerY, value)
	}
}

Object.freeze(LensDistortion)
export default LensDistortion
