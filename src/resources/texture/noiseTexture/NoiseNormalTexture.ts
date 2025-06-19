import RedGPUContext from "../../../context/RedGPUContext";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";
import ANoiseTexture from "./core/ANoiseTexture";
import NoiseTexture from "./NoiseTexture";

const BASIC_OPEIONS = {
	strength: 1
}

class NoiseNormalTexture extends NoiseTexture {
	#strength: number = BASIC_OPEIONS.strength

	constructor(
		redGPUContext: RedGPUContext,
		width: number = 1024,
		height: number = 1024,
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
		const uniformStruct = `strength: f32`;
		const uniformDefaults = {
			...BASIC_OPEIONS
		}
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

	applyPreset(preset: 'rock' | 'metal' | 'leather' | 'concrete' | 'water' | 'skin' | 'fabric'): void {
		switch (preset) {
			case 'rock':
				this.frequency = 8.0;
				this.octaves = 6;
				this.persistence = 0.5;
				this.lacunarity = 2.0;
				this.strength = 2.0;
				break;
			case 'metal':
				this.frequency = 32.0;
				this.octaves = 4;
				this.persistence = 0.4;
				this.lacunarity = 2.5;
				this.strength = 1.5;
				break;
			case 'leather':
				this.frequency = 16.0;
				this.octaves = 5;
				this.persistence = 0.6;
				this.lacunarity = 2.2;
				this.strength = 1.2;
				break;
			case 'concrete':
				this.frequency = 12.0;
				this.octaves = 7;
				this.persistence = 0.6;
				this.lacunarity = 2.0;
				this.strength = 1.8;
				break;
			case 'water':
				this.frequency = 24.0;
				this.octaves = 3;
				this.persistence = 0.3;
				this.lacunarity = 2.2;
				this.strength = 0.5;
				break;
			case 'skin':
				this.frequency = 64.0;
				this.octaves = 5;
				this.persistence = 0.3;
				this.lacunarity = 2.1;
				this.strength = 0.3;
				break;
			case 'fabric':
				this.frequency = 20.0;
				this.octaves = 2;
				this.persistence = 0.3;
				this.lacunarity = 2.0;
				this.strength = 0.8;
				break;
		}
	}
}

export default NoiseNormalTexture;
