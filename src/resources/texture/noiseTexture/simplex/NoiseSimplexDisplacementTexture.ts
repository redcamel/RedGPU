import RedGPUContext from "../../../../context/RedGPUContext";
import validatePositiveNumberRange from "../../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import {NoiseDefine} from "../core/ANoiseTexture";
import {mergerNoiseUniformDefault, mergerNoiseUniformStruct} from "../core/noiseDegineMerges";
import NoiseSimplexTexture from "./NoiseSimplexTexture";

const BASIC_OPTIONS = {
	strength: 1
}

class NoiseSimplexDisplacementTexture extends NoiseSimplexTexture {
	#strength: number = BASIC_OPTIONS.strength

	constructor(
		redGPUContext: RedGPUContext,
		width: number = 1024,
		height: number = 1024,
		define?:NoiseDefine
	) {
		const mainLogic = `
					let uv = vec2<f32>(
						(base_uv.x + uniforms.time * ( uniforms.animationX * uniforms.animationSpeed )) , 
						(base_uv.y + uniforms.time * ( uniforms.animationY * uniforms.animationSpeed )) 
					);
					let noiseValue = getNoiseByDimension(uv, uniforms);
					let displacement = (noiseValue - 0.5) * uniforms.strength;
					let normalizedDisplacement = clamp(displacement * 0.5 + 0.5, 0.0, 1.0);
					let color = vec4<f32>(normalizedDisplacement, normalizedDisplacement, normalizedDisplacement, 1.0);
        `;
		const uniformStruct = mergerNoiseUniformStruct(`strength: f32`, define?.uniformStruct);
		const uniformDefaults = mergerNoiseUniformDefault(BASIC_OPTIONS, define?.uniformDefaults)
		const helperFunctions = ``
		super(redGPUContext, width, height, {
			uniformStruct,
			mainLogic,
			uniformDefaults,
			helperFunctions
		});
	}

	/* Frequency (주파수/스케일) */
	get strength(): number {
		return this.#strength;
	}

	set strength(value: number) {
		validatePositiveNumberRange(value);
		this.#strength = value;
		this.updateUniform('strength', value);
	}
}

export default NoiseSimplexDisplacementTexture;
