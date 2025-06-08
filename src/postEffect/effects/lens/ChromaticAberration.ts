import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";

class ChromaticAberration extends ASinglePassPostEffect {
	#strength: number = 0.015
	#centerX: number = 0.5
	#centerY: number = 0.5
	#falloff: number = 1.0

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const computeCode = `
				let dimensions = textureDimensions(sourceTexture);
				let dimW = f32(dimensions.x);
				let dimH = f32(dimensions.y);
				
				let uv = vec2<f32>(f32(global_id.x), f32(global_id.y)) / vec2<f32>(dimW, dimH);
				let center = vec2<f32>(uniforms.centerX, uniforms.centerY);
				
				let offset = uv - center;
				let distance = length(offset);
				let distortion = uniforms.strength * pow(distance, uniforms.falloff);
				
				let redOffset = uv + offset * distortion * vec2<f32>(-1.0, -1.0);
				let greenOffset = uv;
				let blueOffset = uv + offset * distortion * vec2<f32>(1.0, 1.0);
				
				var finalColor = vec3<f32>(0.0);
				
				if (redOffset.x >= 0.0 && redOffset.x <= 1.0 && 
					redOffset.y >= 0.0 && redOffset.y <= 1.0) {
					let redCoord = vec2<i32>(
						i32(clamp(redOffset.x * dimW, 0.0, dimW - 1.0)),
						i32(clamp(redOffset.y * dimH, 0.0, dimH - 1.0))
					);
					finalColor.r = textureLoad(sourceTexture, redCoord).r;
				}
				
				let greenCoord = vec2<i32>(
					i32(clamp(greenOffset.x * dimW, 0.0, dimW - 1.0)),
					i32(clamp(greenOffset.y * dimH, 0.0, dimH - 1.0))
				);
				finalColor.g = textureLoad(sourceTexture, greenCoord).g;
				
				if (blueOffset.x >= 0.0 && blueOffset.x <= 1.0 && 
					blueOffset.y >= 0.0 && blueOffset.y <= 1.0) {
					let blueCoord = vec2<i32>(
						i32(clamp(blueOffset.x * dimW, 0.0, dimW - 1.0)),
						i32(clamp(blueOffset.y * dimH, 0.0, dimH - 1.0))
					);
					finalColor.b = textureLoad(sourceTexture, blueCoord).b;
				}
				
				let originalAlpha = textureLoad(sourceTexture, vec2<i32>(global_id.xy)).a;
				textureStore(outputTexture, vec2<i32>(global_id.xy), vec4<f32>(finalColor, originalAlpha));
		`
		const uniformStructCode = `
			struct Uniforms {
				strength: f32,
				centerX: f32,
				centerY: f32,
				falloff: f32
			};
		`
		this.init(
			redGPUContext,
			'POST_EFFECT_CHROMATIC_ABERRATION',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.strength = this.#strength
		this.centerX = this.#centerX
		this.centerY = this.#centerY
		this.falloff = this.#falloff
	}

	get strength(): number {
		return this.#strength;
	}

	set strength(value: number) {
		validateNumberRange(value, 0)
		this.#strength = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.strength, value)
	}

	get centerX(): number {
		return this.#centerX;
	}

	set centerX(value: number) {
		validateNumberRange(value, 0, 1)
		this.#centerX = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.centerX, value)
	}

	get centerY(): number {
		return this.#centerY;
	}

	set centerY(value: number) {
		validateNumberRange(value, 0, 1)
		this.#centerY = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.centerY, value)
	}

	get falloff(): number {
		return this.#falloff;
	}

	set falloff(value: number) {
		validateNumberRange(value, 0, 5)
		this.#falloff = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.falloff, value)
	}
}

Object.freeze(ChromaticAberration)
export default ChromaticAberration
