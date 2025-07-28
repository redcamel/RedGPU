import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import GPU_CULL_MODE from "../../gpuConst/GPU_CULL_MODE";
import Ground from "../../primitive/Ground";
import DefineForVertex from "../../resources/defineProperty/DefineForVertex";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import Mesh from "../mesh/Mesh";
import vertexModuleSource from "./shader/waterVertex.wgsl";
import WaterMaterial from "./waterMaterial/WaterMaterial";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_WATER'
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

// 🌊 Water 프리셋 타입들 (6개 웨이브)
export interface WaterPreset {
	// Primary Gerstner Wave parameters (4 primary waves)
	waveAmplitude: [number, number, number, number];
	waveWavelength: [number, number, number, number];
	waveSpeed: [number, number, number, number];
	waveSteepness: [number, number, number, number];
	waveDirection1: [number, number];
	waveDirection2: [number, number];
	waveDirection3: [number, number];
	waveDirection4: [number, number];
	// Detail waves (5th and 6th for fine details)
	detailWaveAmplitude: [number, number];
	detailWaveWavelength: [number, number];
	detailWaveSpeed: [number, number];
	detailWaveSteepness: [number, number];
	detailWaveDirection1: [number, number];
	detailWaveDirection2: [number, number];
	// Global parameters
	waveScale: number;
	waterLevel: number;
}

// 🌊 물리적으로 정확한 6-웨이브 프리셋들 (Primary + Detail)
const WaterPresets: Record<string, WaterPreset> = {
	// 평온한 바다 - 주요 4개 + 디테일 2개
	calmOcean: {
		waveAmplitude: [0.25, 0.15, 0.08, 0.05],
		waveWavelength: [24.0, 17.0, 11.0, 7.5],
		waveSpeed: [0.7, 0.6, 0.8, 1.0],
		waveSteepness: [0.09, 0.06, 0.05, 0.03],
		waveDirection1: [1, 0],
		waveDirection2: [0.7, 0.7],
		waveDirection3: [0, 1],
		waveDirection4: [-0.7, 0.7],
		// 🌀 디테일 웨이브 (잔물결, 세부 표현)
		detailWaveAmplitude: [0.03, 0.015],
		detailWaveWavelength: [4.2, 2.8],
		detailWaveSpeed: [1.3, 1.6],
		detailWaveSteepness: [0.02, 0.01],
		detailWaveDirection1: [0.9, -0.4],
		detailWaveDirection2: [-0.5, -0.9],
		waveScale: 1.0,
		waterLevel: 0.0
	},
	// 고요한 호수 잔물결 - 디테일 웨이브가 주된 역할
	lakeRipples: {
		waveAmplitude: [0.04, 0.035, 0.025, 0.015],
		waveWavelength: [4.0, 3.2, 2.5, 1.7],
		waveSpeed: [0.25, 0.23, 0.28, 0.35],
		waveSteepness: [0.013, 0.011, 0.009, 0.007],
		waveDirection1: [1, 0],
		waveDirection2: [0.75, 0.35],
		waveDirection3: [0.12, 0.99],
		waveDirection4: [-0.6, 0.8],
		// 🌀 미세 디테일 웨이브
		detailWaveAmplitude: [0.008, 0.005],
		detailWaveWavelength: [1.2, 0.8],
		detailWaveSpeed: [0.42, 0.55],
		detailWaveSteepness: [0.005, 0.003],
		detailWaveDirection1: [0.85, -0.52],
		detailWaveDirection2: [-0.3, -0.95],
		waveScale: 2.8,
		waterLevel: 0.01
	},
	// 서핑 파도 - 강한 주요 웨이브 + 거품 디테일
	surfing: {
		waveAmplitude: [0.55, 0.4, 0.2, 0.08],
		waveWavelength: [14.0, 10.5, 6.0, 4.0],
		waveSpeed: [1.6, 1.4, 1.9, 2.05],
		waveSteepness: [0.11, 0.09, 0.07, 0.02],
		waveDirection1: [1, 0],
		waveDirection2: [0.87, 0.5],
		waveDirection3: [0.54, 0.84],
		waveDirection4: [-0.78, 0.62],
		// 🌀 거품/스프레이 디테일
		detailWaveAmplitude: [0.05, 0.025],
		detailWaveWavelength: [2.8, 1.9],
		detailWaveSpeed: [2.4, 2.8],
		detailWaveSteepness: [0.015, 0.01],
		detailWaveDirection1: [0.95, -0.31],
		detailWaveDirection2: [-0.42, -0.91],
		waveScale: 0.7,
		waterLevel: 0.0
	},
	// 깊은 대양 - 롱웨이브 + 풍성한 디테일
	deepOcean: {
		waveAmplitude: [0.85, 0.58, 0.33, 0.22],
		waveWavelength: [60.0, 40.0, 28.0, 19.0],
		waveSpeed: [1.2, 1.05, 1.6, 1.85],
		waveSteepness: [0.07, 0.05, 0.04, 0.027],
		waveDirection1: [1, 0],
		waveDirection2: [0.91, 0.42],
		waveDirection3: [0, 1],
		waveDirection4: [-0.3, 0.95],
		// 🌀 깊은 바다 디테일 (복잡한 교차파)
		detailWaveAmplitude: [0.12, 0.08],
		detailWaveWavelength: [12.5, 8.0],
		detailWaveSpeed: [2.1, 2.5],
		detailWaveSteepness: [0.02, 0.015],
		detailWaveDirection1: [0.88, -0.48],
		detailWaveDirection2: [-0.67, -0.74],
		waveScale: 0.7,
		waterLevel: 0.0
	},
	// 부드러운 파도 - 자연스러운 바람파 + 부드러운 디테일
	gentleWaves: {
		waveAmplitude: [0.36, 0.22, 0.15, 0.09],
		waveWavelength: [21.0, 15.0, 10.5, 8.0],
		waveSpeed: [0.9, 0.82, 1.1, 1.7],
		waveSteepness: [0.12, 0.08, 0.06, 0.04],
		waveDirection1: [1, 0],
		waveDirection2: [0.88, 0.47],
		waveDirection3: [-0.18, 0.98],
		waveDirection4: [-0.74, 0.67],
		// 🌀 부드러운 디테일
		detailWaveAmplitude: [0.05, 0.03],
		detailWaveWavelength: [5.5, 3.8],
		detailWaveSpeed: [2.0, 2.4],
		detailWaveSteepness: [0.025, 0.015],
		detailWaveDirection1: [0.93, -0.37],
		detailWaveDirection2: [-0.58, -0.81],
		waveScale: 0.65,
		waterLevel: 0.0
	},
	// 거친 파도 - 높은 주파수 + 격한 디테일
	choppy: {
		waveAmplitude: [0.63, 0.4, 0.22, 0.13],
		waveWavelength: [10.0, 8.0, 6.5, 3.5],
		waveSpeed: [1.8, 2.0, 2.3, 2.7],
		waveSteepness: [0.29, 0.21, 0.17, 0.13],
		waveDirection1: [1, 0],
		waveDirection2: [0.57, 0.82],
		waveDirection3: [-0.6, 0.8],
		waveDirection4: [0.91, -0.41],
		// 🌀 격렬한 디테일 (난류 효과)
		detailWaveAmplitude: [0.08, 0.05],
		detailWaveWavelength: [2.8, 1.9],
		detailWaveSpeed: [3.1, 3.5],
		detailWaveSteepness: [0.09, 0.06],
		detailWaveDirection1: [0.25, 0.97],
		detailWaveDirection2: [-0.89, -0.46],
		waveScale: 1.25,
		waterLevel: 0.0
	},
	// 폭풍우 바다 - 극한 주파수 + 폭풍 디테일
	stormyOcean: {
		waveAmplitude: [1.3, 0.9, 0.7, 0.48],
		waveWavelength: [38.0, 23.0, 19.0, 13.0],
		waveSpeed: [2.4, 1.6, 2.0, 2.4],
		waveSteepness: [0.18, 0.13, 0.10, 0.08],
		waveDirection1: [1, 0],
		waveDirection2: [0.7, 0.7],
		waveDirection3: [-0.57, 0.82],
		waveDirection4: [-0.84, 0.54],
		// 🌀 폭풍 디테일 (바람과 스프레이)
		detailWaveAmplitude: [0.3, 0.18],
		detailWaveWavelength: [9.5, 6.2],
		detailWaveSpeed: [2.8, 3.2],
		detailWaveSteepness: [0.06, 0.04],
		detailWaveDirection1: [0.31, 0.95],
		detailWaveDirection2: [-0.96, -0.28],
		waveScale: 0.45,
		waterLevel: 0.0
	},
	// 쓰나미 - 극한 상황 + 혼돈의 디테일
	tsunami: {
		waveAmplitude: [2.4, 1.7, 1.08, 0.85],
		waveWavelength: [110.0, 57.0, 41.0, 33.0],
		waveSpeed: [3.4, 2.29, 2.9, 3.3],
		waveSteepness: [0.195, 0.14, 0.12, 0.085],
		waveDirection1: [1, 0],
		waveDirection2: [0.9, 0.2],
		waveDirection3: [0.68, 0.77],
		waveDirection4: [-0.24, 1],
		// 🌀 혼돈의 디테일 (극한 난류)
		detailWaveAmplitude: [0.6, 0.4],
		detailWaveWavelength: [25.0, 18.0],
		detailWaveSpeed: [3.8, 4.2],
		detailWaveSteepness: [0.06, 0.04],
		detailWaveDirection1: [0.45, 0.89],
		detailWaveDirection2: [-0.82, -0.57],
		waveScale: 0.28,
		waterLevel: 0.01
	}
};

interface Water {
	// 🌊 Primary 4개 Gerstner Wave 파라미터들
	waveAmplitude: [number, number, number, number];
	waveWavelength: [number, number, number, number];
	waveSpeed: [number, number, number, number];
	waveSteepness: [number, number, number, number];
	waveDirection1: [number, number];
	waveDirection2: [number, number];
	waveDirection3: [number, number];
	waveDirection4: [number, number];
	// 🌀 Detail waves (5번째, 6번째 웨이브) - 더 간단한 네이밍
	detailWaveAmplitude: [number, number];
	detailWaveWavelength: [number, number];
	detailWaveSpeed: [number, number];
	detailWaveSteepness: [number, number];
	detailWaveDirection1: [number, number];
	detailWaveDirection2: [number, number];
	// 🌊 전역 파라미터들
	waveScale: number;
	waterLevel: number;
}

class Water extends Mesh {
	static WaterPresets = WaterPresets;

	constructor(redGPUContext: RedGPUContext, width: number = 50, height: number = 50, subdivisions: number = 500) {
		super(redGPUContext);
		this._geometry = new Ground(redGPUContext, width, height, subdivisions, subdivisions);
		this._material = new WaterMaterial(redGPUContext);
		this._material.transparent = true;
		this.dirtyPipeline = true;
		this.dirtyTransform = true;
		this.primitiveState.cullMode = GPU_CULL_MODE.NONE;
		// 🌊 기본 설정 적용
		this.applyPreset(WaterPresets.calmOcean);
	}

	createCustomMeshVertexShaderModule() {
		return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);
	}

	// 🌊 6개 웨이브 프리셋 적용 (Primary 4 + Detail 2)
	applyPreset(preset: WaterPreset) {
		// Primary 4 waves
		this.waveAmplitude = [...preset.waveAmplitude];
		this.waveWavelength = [...preset.waveWavelength];
		this.waveSpeed = [...preset.waveSpeed];
		this.waveSteepness = [...preset.waveSteepness];
		this.waveDirection1 = [...preset.waveDirection1];
		this.waveDirection2 = [...preset.waveDirection2];
		this.waveDirection3 = [...preset.waveDirection3];
		this.waveDirection4 = [...preset.waveDirection4];

		// Detail 2 waves (5th and 6th)
		this.detailWaveAmplitude = [...preset.detailWaveAmplitude];
		this.detailWaveWavelength = [...preset.detailWaveWavelength];
		this.detailWaveSpeed = [...preset.detailWaveSpeed];
		this.detailWaveSteepness = [...preset.detailWaveSteepness];
		this.detailWaveDirection1 = [...preset.detailWaveDirection1];
		this.detailWaveDirection2 = [...preset.detailWaveDirection2];

		this.waveScale = preset.waveScale;
		this.waterLevel = preset.waterLevel;
	}

	// 🌊 편리한 프리셋 메서드들
	applyOceanPreset() { this.applyPreset(WaterPresets.calmOcean); }
	applyStormPreset() { this.applyPreset(WaterPresets.stormyOcean); }
	applyLakePreset() { this.applyPreset(WaterPresets.lakeRipples); }
	applyGentlePreset() { this.applyPreset(WaterPresets.gentleWaves); }
	applyDeepOceanPreset() { this.applyPreset(WaterPresets.deepOcean); }
	applyChoppyPreset() { this.applyPreset(WaterPresets.choppy); }
	applyTsunamiPreset() { this.applyPreset(WaterPresets.tsunami); }
	applySurfingPreset() { this.applyPreset(WaterPresets.surfing); }

	// 🌊 물 크기 조정
	setWaterSize(width: number, height: number, subdivisions?: number) {
		const newGeometry = new Ground(
			this.redGPUContext,
			width,
			height,
			subdivisions || 500,
			subdivisions || 500
		);
		this._geometry = newGeometry;
		this.dirtyPipeline = true;
	}

	// 🌊 각도로 전체 흐름 방향 설정 (6개 웨이브)
	setFlowDirectionByDegrees(degrees: number) {
		const radians = (degrees * Math.PI) / 180;
		this.setNaturalFlowDirection(radians);
	}

	// 🌊 자연스러운 6개 wave 방향 설정
	setNaturalFlowDirection(baseAngle: number, variation: number = 0.3) {
		this.waveDirection1 = this.#angleToDirection(baseAngle);
		this.waveDirection2 = this.#angleToDirection(baseAngle + variation * 0.5);
		this.waveDirection3 = this.#angleToDirection(baseAngle - variation * 0.3);
		this.waveDirection4 = this.#angleToDirection(baseAngle + variation * 0.8);
		this.detailWaveDirection1 = this.#angleToDirection(baseAngle + variation * 1.2);
		this.detailWaveDirection2 = this.#angleToDirection(baseAngle - variation * 1.1);
	}

	#angleToDirection(angle: number): [number, number] {
		return [Math.cos(angle), Math.sin(angle)];
	}

	// 🌊 랜덤 프리셋 적용
	applyRandomPreset() {
		const presetNames = Object.keys(WaterPresets);
		const randomPreset = presetNames[Math.floor(Math.random() * presetNames.length)];
		this.applyPreset(WaterPresets[randomPreset]);
		return randomPreset;
	}

	// 🌊 현재 6개 웨이브 설정을 프리셋 형태로 내보내기
	exportCurrentSettings(): WaterPreset {
		return {
			waveAmplitude: [...this.waveAmplitude],
			waveWavelength: [...this.waveWavelength],
			waveSpeed: [...this.waveSpeed],
			waveSteepness: [...this.waveSteepness],
			waveDirection1: [...this.waveDirection1],
			waveDirection2: [...this.waveDirection2],
			waveDirection3: [...this.waveDirection3],
			waveDirection4: [...this.waveDirection4],
			detailWaveAmplitude: [...this.detailWaveAmplitude],
			detailWaveWavelength: [...this.detailWaveWavelength],
			detailWaveSpeed: [...this.detailWaveSpeed],
			detailWaveSteepness: [...this.detailWaveSteepness],
			detailWaveDirection1: [...this.detailWaveDirection1],
			detailWaveDirection2: [...this.detailWaveDirection2],
			waveScale: this.waveScale,
			waterLevel: this.waterLevel
		};
	}

	// 🌊 파도 강도 전체 조정 (Primary + Detail)
	setOverallIntensity(intensity: number) {
		const basePreset = WaterPresets.calmOcean;
		for (let i = 0; i < 4; i++) {
			this.waveAmplitude[i] = basePreset.waveAmplitude[i] * intensity;
		}
		this.detailWaveAmplitude[0] = basePreset.detailWaveAmplitude[0] * intensity;
		this.detailWaveAmplitude[1] = basePreset.detailWaveAmplitude[1] * intensity;
		// 변경 트리거
		this.waveAmplitude = this.waveAmplitude;
		this.detailWaveAmplitude = this.detailWaveAmplitude;
	}

	// 🌊 파도 속도 전체 조정 (Primary + Detail)
	setOverallSpeed(speedMultiplier: number) {
		const basePreset = WaterPresets.calmOcean;
		for (let i = 0; i < 4; i++) {
			this.waveSpeed[i] = basePreset.waveSpeed[i] * speedMultiplier;
		}
		this.detailWaveSpeed[0] = basePreset.detailWaveSpeed[0] * speedMultiplier;
		this.detailWaveSpeed[1] = basePreset.detailWaveSpeed[1] * speedMultiplier;
		// 변경 트리거
		this.waveSpeed = this.waveSpeed;
		this.detailWaveSpeed = this.detailWaveSpeed;
	}

	// 🌊 개별 파도 접근자들
	getIOR(): number {
		return this._material.ior
	}
	setIOR(value: number) {
		this._material.ior = value
	}

	// Primary Wave Amplitude (1-4)
	get amplitude1(): number { return this.waveAmplitude[0]; }
	set amplitude1(value: number) { this.waveAmplitude[0] = value; this.waveAmplitude = this.waveAmplitude }
	get amplitude2(): number { return this.waveAmplitude[1]; }
	set amplitude2(value: number) { this.waveAmplitude[1] = value; this.waveAmplitude = this.waveAmplitude }
	get amplitude3(): number { return this.waveAmplitude[2]; }
	set amplitude3(value: number) { this.waveAmplitude[2] = value; this.waveAmplitude = this.waveAmplitude }
	get amplitude4(): number { return this.waveAmplitude[3]; }
	set amplitude4(value: number) { this.waveAmplitude[3] = value; this.waveAmplitude = this.waveAmplitude }

	// Detail Wave Amplitude (5-6)
	get detailAmplitude1(): number { return this.detailWaveAmplitude[0]; }
	set detailAmplitude1(value: number) { this.detailWaveAmplitude[0] = value; this.detailWaveAmplitude = this.detailWaveAmplitude }
	get detailAmplitude2(): number { return this.detailWaveAmplitude[1]; }
	set detailAmplitude2(value: number) { this.detailWaveAmplitude[1] = value; this.detailWaveAmplitude = this.detailWaveAmplitude }

	// Primary Wave Wavelength (1-4)
	get wavelength1(): number { return this.waveWavelength[0]; }
	set wavelength1(value: number) { this.waveWavelength[0] = value; this.waveWavelength = this.waveWavelength }
	get wavelength2(): number { return this.waveWavelength[1]; }
	set wavelength2(value: number) { this.waveWavelength[1] = value; this.waveWavelength = this.waveWavelength }
	get wavelength3(): number { return this.waveWavelength[2]; }
	set wavelength3(value: number) { this.waveWavelength[2] = value; this.waveWavelength = this.waveWavelength }
	get wavelength4(): number { return this.waveWavelength[3]; }
	set wavelength4(value: number) { this.waveWavelength[3] = value; this.waveWavelength = this.waveWavelength }

	// Detail Wave Wavelength (5-6)
	get detailWavelength1(): number { return this.detailWaveWavelength[0]; }
	set detailWavelength1(value: number) { this.detailWaveWavelength[0] = value; this.detailWaveWavelength = this.detailWaveWavelength }
	get detailWavelength2(): number { return this.detailWaveWavelength[1]; }
	set detailWavelength2(value: number) { this.detailWaveWavelength[1] = value; this.detailWaveWavelength = this.detailWaveWavelength }

	// Primary Wave Speed (1-4)
	get speed1(): number { return this.waveSpeed[0]; }
	set speed1(value: number) { this.waveSpeed[0] = value; this.waveSpeed = this.waveSpeed }
	get speed2(): number { return this.waveSpeed[1]; }
	set speed2(value: number) { this.waveSpeed[1] = value; this.waveSpeed = this.waveSpeed }
	get speed3(): number { return this.waveSpeed[2]; }
	set speed3(value: number) { this.waveSpeed[2] = value; this.waveSpeed = this.waveSpeed }
	get speed4(): number { return this.waveSpeed[3]; }
	set speed4(value: number) { this.waveSpeed[3] = value; this.waveSpeed = this.waveSpeed }

	// Detail Wave Speed (5-6)
	get detailSpeed1(): number { return this.detailWaveSpeed[0]; }
	set detailSpeed1(value: number) { this.detailWaveSpeed[0] = value; this.detailWaveSpeed = this.detailWaveSpeed }
	get detailSpeed2(): number { return this.detailWaveSpeed[1]; }
	set detailSpeed2(value: number) { this.detailWaveSpeed[1] = value; this.detailWaveSpeed = this.detailWaveSpeed }

	// Primary Wave Steepness (1-4)
	get steepness1(): number { return this.waveSteepness[0]; }
	set steepness1(value: number) { this.waveSteepness[0] = value; this.waveSteepness = this.waveSteepness }
	get steepness2(): number { return this.waveSteepness[1]; }
	set steepness2(value: number) { this.waveSteepness[1] = value; this.waveSteepness = this.waveSteepness }
	get steepness3(): number { return this.waveSteepness[2]; }
	set steepness3(value: number) { this.waveSteepness[2] = value; this.waveSteepness = this.waveSteepness }
	get steepness4(): number { return this.waveSteepness[3]; }
	set steepness4(value: number) { this.waveSteepness[3] = value; this.waveSteepness = this.waveSteepness }

	// Detail Wave Steepness (5-6)
	get detailSteepness1(): number { return this.detailWaveSteepness[0]; }
	set detailSteepness1(value: number) { this.detailWaveSteepness[0] = value; this.detailWaveSteepness = this.detailWaveSteepness }
	get detailSteepness2(): number { return this.detailWaveSteepness[1]; }
	set detailSteepness2(value: number) { this.detailWaveSteepness[1] = value; this.detailWaveSteepness = this.detailWaveSteepness }

	// Primary Wave Direction (1-4)
	get direction1(): [number, number] { return this.waveDirection1; }
	set direction1(value: [number, number]) { this.waveDirection1 = value; this.waveDirection1 = this.waveDirection1 }
	get direction2(): [number, number] { return this.waveDirection2; }
	set direction2(value: [number, number]) { this.waveDirection2 = value; this.waveDirection2 = this.waveDirection2 }
	get direction3(): [number, number] { return this.waveDirection3; }
	set direction3(value: [number, number]) { this.waveDirection3 = value; this.waveDirection3 = this.waveDirection3 }
	get direction4(): [number, number] { return this.waveDirection4; }
	set direction4(value: [number, number]) { this.waveDirection4 = value; this.waveDirection4 = this.waveDirection4 }

	// Detail Wave Direction (5-6)
	get detailDirection1(): [number, number] { return this.detailWaveDirection1; }
	set detailDirection1(value: [number, number]) { this.detailWaveDirection1 = value; this.detailWaveDirection1 = this.detailWaveDirection1 }
	get detailDirection2(): [number, number] { return this.detailWaveDirection2; }
	set detailDirection2(value: [number, number]) { this.detailWaveDirection2 = value; this.detailWaveDirection2 = this.detailWaveDirection2 }

	get waterColor(): ColorRGB {
		return this._material.color
	}
}

DefineForVertex.defineByPreset(Water, [])

// 🌊 Primary 4개 Gerstner Wave 파라미터들 - vec4로 정의
DefineForVertex.defineVec4(Water, [
	['waveAmplitude', [0.3, 0.2, 0.15, 0.1]],
	['waveWavelength', [20.0, 15.0, 12.0, 8.0]],
	['waveSpeed', [1.0, 0.8, 1.2, 1.5]],
	['waveSteepness', [0.1, 0.08, 0.06, 0.04]],
])

// 🌀 Detail Waves (5-6) 파라미터들 - vec2로 정의
DefineForVertex.defineVec2(Water, [
	['detailWaveAmplitude', [0.08, 0.05]],      // waveAmplitude56
	['detailWaveWavelength', [6.0, 4.0]],       // waveWavelength56
	['detailWaveSpeed', [1.8, 2.2]],            // waveSpeed56
	['detailWaveSteepness', [0.03, 0.02]],      // waveSteepness56
])

// 🌊 6개 Wave 방향들 - vec2로 정의 (Primary 4 + Detail 2)
DefineForVertex.defineVec2(Water, [
	['waveDirection1', [1.0, 0.0]],
	['waveDirection2', [0.7, 0.7]],
	['waveDirection3', [0.0, 1.0]],
	['waveDirection4', [-0.7, 0.7]],
	['detailWaveDirection1', [0.9, -0.4]],      // waveDirection5
	['detailWaveDirection2', [-0.5, -0.9]],     // waveDirection6
])

// 🌊 전역 파라미터들 정의
DefineForVertex.definePositiveNumber(Water, [
	['waveScale', 0.5, 0.001, 2.0],
	['waterLevel', 0.0, -100.0, 100.0],
])

Object.freeze(Water)
export default Water
