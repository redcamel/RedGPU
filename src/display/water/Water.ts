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

// 🌊 Water 프리셋 타입들
export interface WaterPreset {
	// Primary Gerstner Wave parameters (4 waves)
	waveAmplitude: [number, number, number, number];
	waveWavelength: [number, number, number, number];
	waveSpeed: [number, number, number, number];
	waveSteepness: [number, number, number, number];
	waveDirection1: [number, number];
	waveDirection2: [number, number];
	waveDirection3: [number, number];
	waveDirection4: [number, number];
	// Global parameters
	waveScale: number;
	waterLevel: number;
}

// 🌊 Water 프리셋들 (표준 Gerstner Wave 계산에 맞게 조정)
const WaterPresets: Record<string, WaterPreset> = {
	// 평온한 바다 - 잔잔, 롱파도
	calmOcean: {
		waveAmplitude: [0.25, 0.15, 0.08, 0.05],
		waveWavelength: [24.0, 17.0, 11.0, 7.5],
		waveSpeed: [0.7, 0.6, 0.8, 1.0],
		waveSteepness: [0.09, 0.06, 0.05, 0.03],
		waveDirection1: [1, 0],
		waveDirection2: [0.7, 0.7],
		waveDirection3: [0, 1],
		waveDirection4: [-0.7, 0.7],
		waveScale: 1.0,
		waterLevel: 0.0
	},
	// 고요한 호수 잔물결
	lakeRipples: {
		waveAmplitude: [0.04, 0.035, 0.025, 0.010],
		waveWavelength: [4.0, 3.2, 2.5, 1.7],
		waveSpeed: [0.25, 0.23, 0.28, 0.35],
		waveSteepness: [0.013, 0.011, 0.009, 0.007],
		waveDirection1: [1, 0],
		waveDirection2: [0.75, 0.35],
		waveDirection3: [0.12, 0.99],
		waveDirection4: [-0.6, 0.8],
		waveScale: 2.8,
		waterLevel: 0.01
	},
	// 큰 파도가 없는 근해, 서핑에 적합
	surfing: {
		waveAmplitude: [0.55, 0.4, 0.2, 0.08],
		waveWavelength: [14.0, 10.5, 6.0, 4.0],
		waveSpeed: [1.6, 1.4, 1.9, 2.05],
		waveSteepness: [0.11, 0.09, 0.07, 0.02],
		waveDirection1: [1, 0],
		waveDirection2: [0.87, 0.5],
		waveDirection3: [0.54, 0.84],
		waveDirection4: [-0.78, 0.62],
		waveScale: 0.7,
		waterLevel: 0.0
	},
	// 멀리, 깊은 대양 - 큼직하며 느린 파동
	deepOcean: {
		waveAmplitude: [0.85, 0.58, 0.33, 0.22],
		waveWavelength: [60.0, 40.0, 28.0, 19.0],
		waveSpeed: [1.2, 1.05, 1.6, 1.85],
		waveSteepness: [0.07, 0.05, 0.04, 0.027],
		waveDirection1: [1, 0],
		waveDirection2: [0.91, 0.42],
		waveDirection3: [0, 1],
		waveDirection4: [-0.3, 0.95],
		waveScale: 0.7,
		waterLevel: 0.0
	},
	// 바람 많은 날의 낮은 파도, 비교적 밝은 모양
	gentleWaves: {
		waveAmplitude: [0.36, 0.22, 0.15, 0.09],
		waveWavelength: [21.0, 15.0, 10.5, 8.0],
		waveSpeed: [0.9, 0.82, 1.1, 1.7],
		waveSteepness: [0.12, 0.08, 0.06, 0.04],
		waveDirection1: [1, 0],
		waveDirection2: [0.88, 0.47],
		waveDirection3: [-0.18, 0.98],
		waveDirection4: [-0.74, 0.67],
		waveScale: 0.65,
		waterLevel: 0.0
	},
	// 아주 거칠거나 빠른 패턴. 혼란스럽고, 파도간 교차 효과가 잘 보임
	choppy: {
		waveAmplitude: [0.63, 0.4, 0.22, 0.13],
		waveWavelength: [10.0, 8.0, 6.5, 3.5],
		waveSpeed: [1.8, 2.0, 2.3, 2.7],
		waveSteepness: [0.29, 0.21, 0.17, 0.13],
		waveDirection1: [1, 0],
		waveDirection2: [0.57, 0.82],
		waveDirection3: [-0.6, 0.8],
		waveDirection4: [0.91, -0.41],
		waveScale: 1.25,
		waterLevel: 0.0
	},
	// 난폭한 폭풍우 바다
	stormyOcean: {
		waveAmplitude: [1.3, 0.9, 0.7, 0.48],
		waveWavelength: [38.0, 23.0, 19.0, 13.0],
		waveSpeed: [2.4, 1.6, 2.0, 2.4],
		waveSteepness: [0.18, 0.13, 0.10, 0.08],
		waveDirection1: [1, 0],
		waveDirection2: [0.7, 0.7],
		waveDirection3: [-0.57, 0.82],
		waveDirection4: [-0.84, 0.54],
		waveScale: 0.45,
		waterLevel: 0.0
	},
	// 극한 상황의 거대파, 속도와 높이 최상급 (비정상적 효과용)
	tsunami: {
		waveAmplitude: [2.4, 1.7, 1.08, 0.85],
		waveWavelength: [110.0, 57.0, 41.0, 33.0],
		waveSpeed: [3.4, 2.29, 2.9, 3.3],
		waveSteepness: [0.195, 0.14, 0.12, 0.085],
		waveDirection1: [1, 0],
		waveDirection2: [0.9, 0.2],
		waveDirection3: [0.68, 0.77],
		waveDirection4: [-0.24, 1],
		waveScale: 0.28,
		waterLevel: 0.01
	},

};

interface Water {
	// 🌊 Primary Gerstner Wave 파라미터들
	waveAmplitude: [number, number, number, number];
	waveWavelength: [number, number, number, number];
	waveSpeed: [number, number, number, number];
	waveSteepness: [number, number, number, number];
	waveDirection1: [number, number];
	waveDirection2: [number, number];
	waveDirection3: [number, number];
	waveDirection4: [number, number];
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

	// 🌊 프리셋 적용
	applyPreset(preset: WaterPreset) {
		this.waveAmplitude = [...preset.waveAmplitude];
		this.waveWavelength = [...preset.waveWavelength];
		this.waveSpeed = [...preset.waveSpeed];
		this.waveSteepness = [...preset.waveSteepness];
		this.waveDirection1 = [...preset.waveDirection1];
		this.waveDirection2 = [...preset.waveDirection2];
		this.waveDirection3 = [...preset.waveDirection3];
		this.waveDirection4 = [...preset.waveDirection4];
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

	// 🌊 각도로 전체 흐름 방향 설정
	setFlowDirectionByDegrees(degrees: number) {
		const radians = (degrees * Math.PI) / 180;
		this.setNaturalFlowDirection(radians);
	}

	// 🌊 자연스러운 wave 방향 설정
	setNaturalFlowDirection(baseAngle: number, variation: number = 0.3) {
		this.waveDirection1 = this.#angleToDirection(baseAngle);
		this.waveDirection2 = this.#angleToDirection(baseAngle + variation * 0.5);
		this.waveDirection3 = this.#angleToDirection(baseAngle - variation * 0.3);
		this.waveDirection4 = this.#angleToDirection(baseAngle + variation * 0.8);
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

	// 🌊 현재 설정을 프리셋 형태로 내보내기
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
			waveScale: this.waveScale,
			waterLevel: this.waterLevel
		};
	}

	// 🌊 파도 강도 전체 조정
	setOverallIntensity(intensity: number) {
		const basePreset = WaterPresets.calmOcean;
		for (let i = 0; i < 4; i++) {
			this.waveAmplitude[i] = basePreset.waveAmplitude[i] * intensity;
		}
	}

	// 🌊 파도 속도 전체 조정
	setOverallSpeed(speedMultiplier: number) {
		const basePreset = WaterPresets.calmOcean;
		for (let i = 0; i < 4; i++) {
			this.waveSpeed[i] = basePreset.waveSpeed[i] * speedMultiplier;
		}
	}

	// 🌊 개별 파도 접근자들
	getIOR():number{
		return this._material.ior
	}
	setIOR(value:number){
		this._material.ior = value
	}

	// Primary Wave Amplitude
	get amplitude1(): number { return this.waveAmplitude[0]; }
	set amplitude1(value: number) { this.waveAmplitude[0] = value; this.waveAmplitude = this.waveAmplitude }
	get amplitude2(): number { return this.waveAmplitude[1]; }
	set amplitude2(value: number) { this.waveAmplitude[1] = value; this.waveAmplitude = this.waveAmplitude }
	get amplitude3(): number { return this.waveAmplitude[2]; }
	set amplitude3(value: number) { this.waveAmplitude[2] = value; this.waveAmplitude = this.waveAmplitude }
	get amplitude4(): number { return this.waveAmplitude[3]; }
	set amplitude4(value: number) { this.waveAmplitude[3] = value; this.waveAmplitude = this.waveAmplitude }

	// Primary Wave Wavelength
	get wavelength1(): number { return this.waveWavelength[0]; }
	set wavelength1(value: number) { this.waveWavelength[0] = value; this.waveWavelength = this.waveWavelength }
	get wavelength2(): number { return this.waveWavelength[1]; }
	set wavelength2(value: number) { this.waveWavelength[1] = value; this.waveWavelength = this.waveWavelength }
	get wavelength3(): number { return this.waveWavelength[2]; }
	set wavelength3(value: number) { this.waveWavelength[2] = value; this.waveWavelength = this.waveWavelength }
	get wavelength4(): number { return this.waveWavelength[3]; }
	set wavelength4(value: number) { this.waveWavelength[3] = value; this.waveWavelength = this.waveWavelength }

	// Primary Wave Speed
	get speed1(): number { return this.waveSpeed[0]; }
	set speed1(value: number) { this.waveSpeed[0] = value; this.waveSpeed = this.waveSpeed }
	get speed2(): number { return this.waveSpeed[1]; }
	set speed2(value: number) { this.waveSpeed[1] = value; this.waveSpeed = this.waveSpeed }
	get speed3(): number { return this.waveSpeed[2]; }
	set speed3(value: number) { this.waveSpeed[2] = value; this.waveSpeed = this.waveSpeed }
	get speed4(): number { return this.waveSpeed[3]; }
	set speed4(value: number) { this.waveSpeed[3] = value; this.waveSpeed = this.waveSpeed }

	// Primary Wave Steepness
	get steepness1(): number { return this.waveSteepness[0]; }
	set steepness1(value: number) { this.waveSteepness[0] = value; this.waveSteepness = this.waveSteepness }
	get steepness2(): number { return this.waveSteepness[1]; }
	set steepness2(value: number) { this.waveSteepness[1] = value; this.waveSteepness = this.waveSteepness }
	get steepness3(): number { return this.waveSteepness[2]; }
	set steepness3(value: number) { this.waveSteepness[2] = value; this.waveSteepness = this.waveSteepness }
	get steepness4(): number { return this.waveSteepness[3]; }
	set steepness4(value: number) { this.waveSteepness[3] = value; this.waveSteepness = this.waveSteepness }

	// Primary Wave Direction
	get direction1(): [number, number] { return this.waveDirection1; }
	set direction1(value: [number, number]) { this.waveDirection1 = value; this.waveDirection1 = this.waveDirection1 }
	get direction2(): [number, number] { return this.waveDirection2; }
	set direction2(value: [number, number]) { this.waveDirection2 = value; this.waveDirection2 = this.waveDirection2 }
	get direction3(): [number, number] { return this.waveDirection3; }
	set direction3(value: [number, number]) { this.waveDirection3 = value; this.waveDirection3 = this.waveDirection3 }
	get direction4(): [number, number] { return this.waveDirection4; }
	set direction4(value: [number, number]) { this.waveDirection4 = value; this.waveDirection4 = this.waveDirection4 }

	get waterColor(): ColorRGB {
		return this._material.color
	}
}

DefineForVertex.defineByPreset(Water, [])

// 🌊 Primary Gerstner Wave 파라미터들 - vec4로 정의 (기본값 조정)
DefineForVertex.defineVec4(Water, [
	['waveAmplitude', [0.3, 0.2, 0.15, 0.1]],
	['waveWavelength', [20.0, 15.0, 12.0, 8.0]],
	['waveSpeed', [1.0, 0.8, 1.2, 1.5]],
	['waveSteepness', [0.1, 0.08, 0.06, 0.04]],
])

// 🌊 Wave 방향들 - vec2로 정의 (WGSL vec2<f32>와 매칭)
DefineForVertex.defineVec2(Water, [
	['waveDirection1', [1.0, 0.0]],
	['waveDirection2', [0.7, 0.7]],
	['waveDirection3', [0.0, 1.0]],
	['waveDirection4', [-0.7, 0.7]],
])

// 🌊 전역 파라미터들 정의 (기본값 조정)
DefineForVertex.definePositiveNumber(Water, [
	['waveScale', 0.5, 0.001, 2.0],
	['waterLevel', 0.0, -100.0, 100.0],
])

Object.freeze(Water)
export default Water
