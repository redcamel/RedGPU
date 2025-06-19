import RedGPUContext from "../../../../context/RedGPUContext";
import validatePositiveNumberRange from "../../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import {NoiseDefine} from "../core/ANoiseTexture";
import {mergerNoiseUniformDefault, mergerNoiseUniformStruct} from "../core/noiseDegineMerges";
import NoiseSimplexTexture from "./NoiseSimplexTexture";

const BASIC_OPTIONS = {
	strength: 1
}

class NoiseSimplexNormalTexture extends NoiseSimplexTexture {
	#strength: number = BASIC_OPTIONS.strength

	constructor(
		redGPUContext: RedGPUContext,
		width: number = 1024,
		height: number = 1024,
		define?:NoiseDefine
	) {
		const mainLogic = `
            /* 현재 픽셀의 높이 */
	          var center_height: f32 = getNoiseByDimension(uv, uniforms);
						
						/* 텍셀 크기 계산 */
						let texel_size = 1.0 / vec2<f32>(textureDimensions(outputTexture));
						
						/* 주변 픽셀의 높이값 샘플링 */
						let height_left = getNoiseByDimension(uv + vec2<f32>(-texel_size.x, 0.0), uniforms);
						let height_right = getNoiseByDimension(uv + vec2<f32>(texel_size.x, 0.0), uniforms);
						let height_up = getNoiseByDimension(uv + vec2<f32>(0.0, -texel_size.y), uniforms);
						let height_down = getNoiseByDimension(uv + vec2<f32>(0.0, texel_size.y), uniforms);
						
						/* 그라디언트 계산 */
						let gradient_x = (height_right - height_left) * 0.5;
						let gradient_y = (height_down - height_up) * 0.5;
						
						/* 노멀 벡터 계산 */
						let normal = normalize(vec3<f32>(
						    gradient_x * uniforms.strength,
						    gradient_y * uniforms.strength,
						    1.0
						));
						
						/* 노멀을 0~1 범위로 변환 (탄젠트 스페이스) */
						let normal_color = normal * 0.5 + 0.5;
						
						/* 최종 색상 (노멀맵 RGB) */
						let color = vec4<f32>(normal_color, 1.0);

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

export default NoiseSimplexNormalTexture;
