import RedGPUContext from "../../../../context/RedGPUContext";
import validateNumber from "../../../../runtimeChecker/validateFunc/validateNumber";
import validatePositiveNumberRange from "../../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import {NoiseDefine} from "../core/ANoiseTexture";
import ASimplexTexture from "../core/ASimplexTexture";
import {
	mergerNoiseHelperFunctions,
	mergerNoiseUniformDefault,
	mergerNoiseUniformStruct
} from "../core/noiseDegineMerges";

const BASIC_OPTIONS = {
	animationSpeed: 1,
	animationX: 1,
	animationY: 1
}

class NoiseSimplexTexture extends ASimplexTexture {
	#animationSpeed: number = 1
	#animationX: number = BASIC_OPTIONS.animationX
	#animationY: number = BASIC_OPTIONS.animationY

	get animationSpeed(): number {
		return this.#animationSpeed;
	}

	set animationSpeed(value: number) {
		validatePositiveNumberRange(value);
		this.#animationSpeed = value;
		this.updateUniform('animationSpeed', value);
	}

	get animationX(): number {
		return this.#animationX;
	}

	set animationX(value: number) {
		validateNumber(value);
		this.#animationX = value;
		this.updateUniform('animationX', value);
	}

	get animationY(): number {
		return this.#animationY;
	}

	set animationY(value: number) {
		validateNumber(value);
		this.#animationY = value;
		this.updateUniform('animationY', value);
	}

	constructor(
		redGPUContext: RedGPUContext,
		width: number = 1024,
		height: number = 1024,
		define?: NoiseDefine
	) {
		const mainLogic = define?.mainLogic || `
						let uv = vec2<f32>(
							(base_uv.x + uniforms.time * ( uniforms.animationX * uniforms.animationSpeed )) , 
							(base_uv.y + uniforms.time * ( uniforms.animationY * uniforms.animationSpeed )) 
						);
						let noise = getSimplexNoiseByDimension( uv,uniforms );
            
            /* 최종 색상 (그레이스케일) */
            let finalColor = vec4<f32>(noise, noise, noise, 1.0);
        `;
		const uniformStruct = mergerNoiseUniformStruct(
`
				animationSpeed: f32,
				animationX: f32,
				animationY: f32,
			`,
			define?.uniformStruct
		);
		const uniformDefaults = mergerNoiseUniformDefault(BASIC_OPTIONS, define?.uniformDefaults)
		const helperFunctions = mergerNoiseHelperFunctions('',define?.helperFunctions || '')
		super(redGPUContext, width, height, {
			uniformStruct,
			mainLogic,
			uniformDefaults,
			helperFunctions
		});
	}
}

export default NoiseSimplexTexture;
