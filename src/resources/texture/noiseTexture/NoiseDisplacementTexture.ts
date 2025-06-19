import RedGPUContext from "../../../context/RedGPUContext";
import validatePositiveNumberRange from "../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import NoiseTexture from "./NoiseTexture";

const BASIC_OPEIONS = {
	strength: 1
}

class NoiseDisplacementTexture extends NoiseTexture {
	#strength: number = BASIC_OPEIONS.strength

	constructor(
		redGPUContext: RedGPUContext,
		width: number = 1024,
		height: number = 1024,
	) {
		const mainLogic = `
					let noiseValue = getNoiseByDimension(uv, uniforms);
					let displacement = (noiseValue - 0.5) * uniforms.strength;
					let normalizedDisplacement = clamp(displacement * 0.5 + 0.5, 0.0, 1.0);
					let color = vec4<f32>(normalizedDisplacement, normalizedDisplacement, normalizedDisplacement, 1.0);
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
	applyPreset(preset: 'mountains' | 'waves' | 'crater' | 'wrinkles' | 'cobblestone' | 'dunes' | 'coral' | 'bark'): void {
		switch (preset) {
			case 'mountains':
				this.frequency = 2.0;           // 큰 산맥
				this.octaves = 6;               // 복잡한 지형
				this.persistence = 0.6;         // 강한 기복
				this.lacunarity = 2.0;
				this.strength = 2.5;   // 극적인 높낮이
				break;

			case 'waves':
				this.frequency = 8.0;           // 물결 패턴
				this.octaves = 3;               // 부드러운 곡선
				this.persistence = 0.4;         // 자연스러운 흐름
				this.lacunarity = 2.1;
				this.strength = 1.2;   // 부드러운 물결
				break;

			case 'crater':
				this.frequency = 4.0;           // 큰 구멍들
				this.octaves = 4;               // 중간 복잡도
				this.persistence = 0.8;         // 극명한 높낮이
				this.lacunarity = 2.5;
				this.strength = 3.0;   // 깊은 크레이터
				break;

			case 'wrinkles':
				this.frequency = 16.0;          // 세밀한 주름
				this.octaves = 5;               // 복잡한 패턴
				this.persistence = 0.3;         // 미묘한 변화
				this.lacunarity = 2.2;
				this.strength = 0.8;   // 미세한 주름
				break;

			case 'cobblestone':
				this.frequency = 12.0;          // 자갈 크기
				this.octaves = 4;               // 불규칙성
				this.persistence = 0.5;         // 중간 높낮이
				this.lacunarity = 2.0;
				this.strength = 1.5;   // 적당한 돌출
				break;

			case 'dunes':
				this.frequency = 3.0;           // 큰 모래언덕
				this.octaves = 3;               // 부드러운 곡선
				this.persistence = 0.7;         // 뚜렷한 기복
				this.lacunarity = 1.8;
				this.strength = 2.0;   // 큰 모래 언덕
				break;

			case 'coral':
				this.frequency = 20.0;          // 복잡한 구조
				this.octaves = 6;               // 매우 디테일
				this.persistence = 0.6;         // 불규칙한 성장
				this.lacunarity = 2.3;
				this.strength = 1.8;   // 복잡한 표면
				break;

			case 'bark':
				this.frequency = 14.0;          // 나무껍질 텍스처
				this.octaves = 4;               // 자연스러운 패턴
				this.persistence = 0.4;         // 미묘한 굴곡
				this.lacunarity = 2.1;
				this.strength = 1.0;   // 자연스러운 껍질
				break;
		}
	}
}

export default NoiseDisplacementTexture;
