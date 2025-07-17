import RedGPUContext from "../../../context/RedGPUContext";
import {NoiseDefine} from "../../../resources/texture/noiseTexture/core/ANoiseTexture";
import SimplexTexture from "../../../resources/texture/noiseTexture/simplex/SimplexTexture";
import {WaterTextureSettings} from "../WaterMaterial";
import helperFunctions from "./helperFunctions.wgsl";
import mainLogic from "./mainLogic.wgsl";

class WaterTexture extends SimplexTexture {
	#currentSettings: WaterTextureSettings;

	constructor(
		redGPUContext: RedGPUContext,
		width: number = 1024,
		height: number = 1024,
	) {
		const waterDefine: NoiseDefine = {
			mainLogic,
			helperFunctions,
			uniformStruct: `
        
        amplitude1: f32,
        wavelength1: f32, 
        speed1: f32,
        steepness1: f32,
        direction1: vec2<f32>, 
        
        
        amplitude2: f32,
        wavelength2: f32,
        speed2: f32,
        steepness2: f32,
        direction2: vec2<f32>,
        
        
        amplitude3: f32,
        wavelength3: f32,
        speed3: f32,
        steepness3: f32,
        direction3: vec2<f32>,
        
        
        amplitude4: f32,
        wavelength4: f32,
        speed4: f32,
        steepness4: f32,
        direction4: vec2<f32>,
        
        
        detailScale1: f32,
        detailSpeed1: f32,
        detailStrength1: f32,
        detailScale2: f32,
        detailSpeed2: f32,
        detailStrength2: f32,
        
        
        waveRange: f32,
        foamThreshold: f32,
        normalOffset: f32,
        normalStrength: f32,
        
        
        noiseScale: f32,
    `,
			uniformDefaults: {
				// Wave 1 - 큰 주파수 (긴 파장)
				amplitude1: 0.8,
				wavelength1: 6.0,
				speed1: 1.2,
				steepness1: 0.5,
				direction1: [1.0, 0.0],

				// Wave 2 - 중간 주파수
				amplitude2: 0.5,
				wavelength2: 4.0,
				speed2: 1.0,
				steepness2: 0.3,
				direction2: [0.7, 0.7],

				// Wave 3 - 작은 주파수
				amplitude3: 0.3,
				wavelength3: 2.5,
				speed3: 1.5,
				steepness3: 0.2,
				direction3: [0.0, 1.0],

				// Wave 4 - 매우 작은 주파수
				amplitude4: 0.15,
				wavelength4: 1.67,
				speed4: 1.8,
				steepness4: 0.1,
				direction4: [-0.7, 0.7],

				// 디테일 노이즈
				detailScale1: 10.0,
				detailSpeed1: 0.4,
				detailStrength1: 0.08,
				detailScale2: 20.0,
				detailSpeed2: 0.25,
				detailStrength2: 0.04,

				// 전역 설정
				waveRange: 2.0,
				foamThreshold: 0.75,
				normalOffset: 0.01,
				normalStrength: 1.0,

				// 랜덤화
				seed: 42.0,
				noiseScale: 1.0
			}
		};
		super(redGPUContext, width, height, waterDefine);
		this.#currentSettings = {...waterDefine.uniformDefaults} as WaterTextureSettings;
	}

	setProperty(key: string, value: number | number[]) {
		(this.#currentSettings as any)[key] = value;
		this.updateUniform(key, value);
	}

	getProperty(key: string): number | number[] {
		return (this.#currentSettings as any)[key];
	}

	// 🌊 WaterTextureSettings 부분만 처리하는 프리셋 적용
	applyPreset(preset: Partial<WaterTextureSettings>) {
		Object.entries(preset).forEach(([key, value]) => {
			if (key in this.#currentSettings) {
				this.setProperty(key, value);
			}
		});
	}

	getWaterSettings(): WaterTextureSettings {
		return {...this.#currentSettings};
	}
}

export default WaterTexture;
