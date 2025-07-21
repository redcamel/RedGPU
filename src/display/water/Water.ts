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
	calmOcean: {
		waveAmplitude: [0.3, 0.2, 0.15, 0.1],
		waveWavelength: [20.0, 15.0, 12.0, 8.0],
		waveSpeed: [1.0, 0.8, 1.2, 1.5],
		waveSteepness: [0.1, 0.08, 0.06, 0.04],
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.7, 0.7],
		waveDirection3: [0.0, 1.0],
		waveDirection4: [-0.7, 0.7],
		waveScale: 0.8,  // 🔥 증가: 차분한 바다의 넓은 파도 패턴
		waterLevel: 0.0
	},
	gentleWaves: {
		waveAmplitude: [0.4, 0.3, 0.2, 0.12],
		waveWavelength: [25.0, 18.0, 14.0, 10.0],
		waveSpeed: [1.2, 1.0, 1.4, 1.8],
		waveSteepness: [0.12, 0.1, 0.08, 0.05],
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.8, 0.6],
		waveDirection3: [-0.3, 1.0],
		waveDirection4: [-0.6, 0.8],
		waveScale: 0.6,  // 🔥 증가: 부드러운 파도의 자연스러운 크기
		waterLevel: 0.0
	},
	stormyOcean: {
		waveAmplitude: [1.2, 0.9, 0.6, 0.4],
		waveWavelength: [40.0, 30.0, 20.0, 15.0],
		waveSpeed: [2.0, 1.8, 2.2, 2.5],
		waveSteepness: [0.15, 0.12, 0.1, 0.08],
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.6, 0.8],
		waveDirection3: [-0.4, 0.9],
		waveDirection4: [-0.8, 0.6],
		waveScale: 0.4,  // 🔥 증가: 폭풍우 속 거대한 파도
		waterLevel: 0.0
	},
	lakeRipples: {
		waveAmplitude: [0.05, 0.04, 0.03, 0.02],
		waveWavelength: [5.0, 4.0, 3.0, 2.0],
		waveSpeed: [0.3, 0.25, 0.35, 0.4],
		waveSteepness: [0.02, 0.015, 0.01, 0.008],
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.9, 0.4],
		waveDirection3: [0.3, 0.95],
		waveDirection4: [-0.6, 0.8],
		waveScale: 2.5,  // 🔥 증가: 호수 잔물결의 세밀한 디테일
		waterLevel: 0.0
	},
	deepOcean: {
		waveAmplitude: [0.8, 0.6, 0.4, 0.25],
		waveWavelength: [60.0, 45.0, 30.0, 20.0],
		waveSpeed: [1.5, 1.2, 1.8, 2.0],
		waveSteepness: [0.08, 0.06, 0.05, 0.03],
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.8, 0.6],
		waveDirection3: [0.0, 1.0],
		waveDirection4: [-0.6, 0.8],
		waveScale: 0.3,  // 🔥 증가: 깊은 바다의 장대한 파도
		waterLevel: 0.0
	},
	choppy: {
		waveAmplitude: [0.5, 0.4, 0.3, 0.2],
		waveWavelength: [10.0, 8.0, 6.0, 4.0],
		waveSpeed: [2.0, 2.2, 2.5, 3.0],
		waveSteepness: [0.25, 0.2, 0.18, 0.15],
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.5, 0.87],
		waveDirection3: [-0.5, 0.87],
		waveDirection4: [0.87, -0.5],
		waveScale: 1.2,  // 🔥 증가: 거친 파도의 복잡한 패턴
		waterLevel: 0.0
	},
	tsunami: {
		waveAmplitude: [2.0, 1.5, 1.0, 0.8],
		waveWavelength: [80.0, 60.0, 40.0, 30.0],
		waveSpeed: [3.0, 2.5, 3.2, 3.5],
		waveSteepness: [0.2, 0.15, 0.12, 0.1],
		waveDirection1: [1.0, 0.0],
		waveDirection2: [0.9, 0.4],
		waveDirection3: [0.7, 0.7],
		waveDirection4: [-0.3, 0.95],
		waveScale: 0.2,  // 🔥 증가: 쓰나미의 극대형 파도
		waterLevel: 0.5
	},
	surfing: {
		waveAmplitude: [1.5, 1.0, 0.7, 0.4],
		waveWavelength: [35.0, 25.0, 18.0, 12.0],
		waveSpeed: [2.5, 2.0, 2.8, 3.2],
		waveSteepness: [0.2, 0.18, 0.15, 0.12],
		waveDirection1: [0.7, 0.7],
		waveDirection2: [0.8, 0.6],
		waveDirection3: [0.6, 0.8],
		waveDirection4: [0.9, 0.4],
		waveScale: 0.5,  // 🔥 증가: 서핑하기 좋은 규칙적인 파도
		waterLevel: 0.0
	}
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
