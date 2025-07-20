import RedGPUContext from "../../context/RedGPUContext";
import GPU_CULL_MODE from "../../gpuConst/GPU_CULL_MODE";
import PhongMaterial from "../../material/phongMaterial/PhongMaterial";
import Ground from "../../primitive/Ground";
import DefineForVertex from "../../resources/defineProperty/DefineForVertex";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import Mesh from "../mesh/Mesh";
import vertexModuleSource from "./shader/waterVertex.wgsl";

const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_WATER'
const SHADER_INFO = parseWGSL(vertexModuleSource);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

// 🌊 Water 프리셋 타입들
export interface WaterPreset {
	// Gerstner Wave parameters (4 waves)
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

// 🌊 Water 프리셋들 - 개선된 버전
const WaterPresets: Record<string, WaterPreset> = {
	calmOcean: {
		waveAmplitude: [0.3, 0.2, 0.1, 0.05],
		waveWavelength: [8.0, 6.0, 4.0, 2.0],
		waveSpeed: [0.8, 0.6, 1.0, 1.2],
		waveSteepness: [0.2, 0.15, 0.1, 0.05],
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.7, 0.7],
		waveDirection3: [0.0, 1.0],
		waveDirection4: [-0.7, 0.7],
		waveScale: 0.1,
		waterLevel: 0.0
	},

	gentleWaves: {
		waveAmplitude: [0.5, 0.35, 0.18, 0.08],
		waveWavelength: [6.0, 4.5, 3.0, 1.8],
		waveSpeed: [1.0, 0.8, 1.2, 1.5],
		waveSteepness: [0.25, 0.2, 0.15, 0.08], // 🔧 약간 증가
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.8, 0.6], // 🔧 더 자연스러운 분산
		waveDirection3: [-0.3, 1.0], // 🔧 역방향 추가
		waveDirection4: [-0.6, 0.8],
		waveScale: 0.12,
		waterLevel: 0.0
	},

	stormyOcean: {
		waveAmplitude: [1.2, 0.8, 0.6, 0.4],
		waveWavelength: [15.0, 10.0, 6.0, 3.0],
		waveSpeed: [2.0, 1.8, 2.5, 3.0],
		waveSteepness: [0.35, 0.25, 0.2, 0.15], // 🔧 더 가파른 파도
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.6, 0.8], // 🔧 더 혼란스러운 방향
		waveDirection3: [-0.4, 0.9], // 🔧 역류 효과
		waveDirection4: [-0.8, 0.6],
		waveScale: 0.06, // 🔧 더 큰 스케일
		waterLevel: 0.0
	},

	lakeRipples: {
		waveAmplitude: [0.04, 0.03, 0.02, 0.01],
		waveWavelength: [3.0, 2.0, 1.5, 1.0],
		waveSpeed: [0.2, 0.18, 0.25, 0.3],
		waveSteepness: [0.01, 0.008, 0.006, 0.004], // 🔧 더 부드러운 ripple
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.9, 0.4], // 🔧 더 미묘한 방향성
		waveDirection3: [0.3, 0.95],
		waveDirection4: [-0.6, 0.8],
		waveScale: 0.25, // 🔧 더 섬세한 스케일
		waterLevel: 0.0
	},

	// 🌊 추가 프리셋들
	deepOcean: {
		waveAmplitude: [0.8, 0.5, 0.3, 0.15],
		waveWavelength: [25.0, 18.0, 12.0, 8.0],
		waveSpeed: [1.2, 1.0, 1.4, 1.8],
		waveSteepness: [0.15, 0.12, 0.08, 0.05],
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.8, 0.6],
		waveDirection3: [0.0, 1.0],
		waveDirection4: [-0.6, 0.8],
		waveScale: 0.04,
		waterLevel: 0.0
	},

	choppy: {
		waveAmplitude: [0.4, 0.35, 0.25, 0.2],
		waveWavelength: [4.0, 3.0, 2.0, 1.5],
		waveSpeed: [1.8, 2.2, 2.8, 3.5],
		waveSteepness: [0.4, 0.35, 0.3, 0.25],
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.5, 0.87],
		waveDirection3: [-0.5, 0.87],
		waveDirection4: [0.87, -0.5],
		waveScale: 0.15,
		waterLevel: 0.0
	},

	tsunami: {
		waveAmplitude: [2.0, 1.5, 1.0, 0.8],
		waveWavelength: [20.0, 15.0, 10.0, 5.0],
		waveSpeed: [3.0, 2.8, 3.5, 4.0],
		waveSteepness: [0.5, 0.4, 0.3, 0.2],
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.9, 0.4],
		waveDirection3: [0.7, 0.7],
		waveDirection4: [-0.3, 0.95],
		waveScale: 0.03,
		waterLevel: 0.5
	},

	surfing: {
		waveAmplitude: [1.5, 1.0, 0.7, 0.3],
		waveWavelength: [12.0, 8.0, 5.0, 3.0],
		waveSpeed: [2.2, 2.0, 2.8, 3.2],
		waveSteepness: [0.45, 0.35, 0.25, 0.15],
		waveDirection1: [0.7, 0.7], // 45도 방향
		waveDirection2: [0.8, 0.6],
		waveDirection3: [0.6, 0.8],
		waveDirection4: [0.9, 0.4],
		waveScale: 0.08,
		waterLevel: 0.0
	}
};

interface Water {
	// 🌊 Gerstner Wave 파라미터들
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
		this._material = new PhongMaterial(redGPUContext);
		this._material.color.setColorByHEX('#4D99CC')
		this._material.shininess = 128
		this._material.specularStrength	= 0.8
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
		this.waveAmplitude = [...preset.waveAmplitude]; // 배열 복사
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
	applyOceanPreset() {
		this.applyPreset(WaterPresets.calmOcean);
	}

	applyStormPreset() {
		this.applyPreset(WaterPresets.stormyOcean);
	}

	applyLakePreset() {
		this.applyPreset(WaterPresets.lakeRipples);
	}

	applyGentlePreset() {
		this.applyPreset(WaterPresets.gentleWaves);
	}

	// 🌊 새로운 프리셋 메서드들
	applyDeepOceanPreset() {
		this.applyPreset(WaterPresets.deepOcean);
	}

	applyChoppyPreset() {
		this.applyPreset(WaterPresets.choppy);
	}

	applyTsunamiPreset() {
		this.applyPreset(WaterPresets.tsunami);
	}

	applySurfingPreset() {
		this.applyPreset(WaterPresets.surfing);
	}

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
		this.direction1 = this.#angleToDirection(baseAngle);
		this.direction2 = this.#angleToDirection(baseAngle + variation * 0.5);
		this.direction3 = this.#angleToDirection(baseAngle - variation * 0.3);
		this.direction4 = this.#angleToDirection(baseAngle + variation * 0.8);
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

	// 🌊 개별 파도 접근자들 - Amplitude
	get amplitude1(): number { return this.waveAmplitude[0]; }
	set amplitude1(value: number) { this.waveAmplitude[0] = value; }

	get amplitude2(): number { return this.waveAmplitude[1]; }
	set amplitude2(value: number) { this.waveAmplitude[1] = value; }

	get amplitude3(): number { return this.waveAmplitude[2]; }
	set amplitude3(value: number) { this.waveAmplitude[2] = value; }

	get amplitude4(): number { return this.waveAmplitude[3]; }
	set amplitude4(value: number) { this.waveAmplitude[3] = value; }

	// 🌊 개별 파도 접근자들 - Wavelength
	get wavelength1(): number { return this.waveWavelength[0]; }
	set wavelength1(value: number) { this.waveWavelength[0] = value; }

	get wavelength2(): number { return this.waveWavelength[1]; }
	set wavelength2(value: number) { this.waveWavelength[1] = value; }

	get wavelength3(): number { return this.waveWavelength[2]; }
	set wavelength3(value: number) { this.waveWavelength[2] = value; }

	get wavelength4(): number { return this.waveWavelength[3]; }
	set wavelength4(value: number) { this.waveWavelength[3] = value; }

	// 🌊 개별 파도 접근자들 - Speed
	get speed1(): number { return this.waveSpeed[0]; }
	set speed1(value: number) { this.waveSpeed[0] = value; }

	get speed2(): number { return this.waveSpeed[1]; }
	set speed2(value: number) { this.waveSpeed[1] = value; }

	get speed3(): number { return this.waveSpeed[2]; }
	set speed3(value: number) { this.waveSpeed[2] = value; }

	get speed4(): number { return this.waveSpeed[3]; }
	set speed4(value: number) { this.waveSpeed[3] = value; }

	// 🌊 개별 파도 접근자들 - Steepness
	get steepness1(): number { return this.waveSteepness[0]; }
	set steepness1(value: number) { this.waveSteepness[0] = value; }

	get steepness2(): number { return this.waveSteepness[1]; }
	set steepness2(value: number) { this.waveSteepness[1] = value; }

	get steepness3(): number { return this.waveSteepness[2]; }
	set steepness3(value: number) { this.waveSteepness[2] = value; }

	get steepness4(): number { return this.waveSteepness[3]; }
	set steepness4(value: number) { this.waveSteepness[3] = value; }

	// 🌊 개별 파도 접근자들 - Direction
	get direction1(): [number, number] { return this.waveDirection1; }
	set direction1(value: [number, number]) { this.waveDirection1 = value; }

	get direction2(): [number, number] { return this.waveDirection2; }
	set direction2(value: [number, number]) { this.waveDirection2 = value; }

	get direction3(): [number, number] { return this.waveDirection3; }
	set direction3(value: [number, number]) { this.waveDirection3 = value; }

	get direction4(): [number, number] { return this.waveDirection4; }
	set direction4(value: [number, number]) { this.waveDirection4 = value; }
}

DefineForVertex.defineByPreset(Water, [
])

// 🌊 Gerstner Wave 파라미터들 - vec4로 정의 (WGSL vec4<f32>와 매칭)
DefineForVertex.defineVec4(Water, [
	['waveAmplitude', [0.3, 0.2, 0.1, 0.05]],
	['waveWavelength', [8.0, 6.0, 4.0, 2.0]],
	['waveSpeed', [0.8, 0.6, 1.0, 1.2]],
	['waveSteepness', [0.2, 0.15, 0.1, 0.05]],
])

// 🌊 Wave 방향들 - vec2로 정의 (WGSL vec2<f32>와 매칭)
DefineForVertex.defineVec2(Water, [
	['waveDirection1', [1.0, 0.0]],
	['waveDirection2', [0.7, 0.7]],
	['waveDirection3', [0.0, 1.0]],
	['waveDirection4', [-0.7, 0.7]],
])

// 🌊 전역 파라미터들 정의
DefineForVertex.definePositiveNumber(Water, [
	['waveScale', 0.1, 0.01, 1.0],
	['waterLevel', 0.0, -5.0, 5.0],
])

Object.freeze(Water)
export default Water
