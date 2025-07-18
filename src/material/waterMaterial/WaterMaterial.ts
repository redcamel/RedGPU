import ColorRGB from "../../color/ColorRGB";
import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../resources/defineProperty/DefineForFragment";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
import fragmentModuleSource from './fragment.wgsl'
import WaterTexture from "./texture/WaterTexture";

const SHADER_INFO = parseWGSL(fragmentModuleSource)

// 🌊 WaterTexture 설정 인터페이스
export interface WaterTextureSettings {
	// Wave 1
	amplitude1: number;
	wavelength1: number;
	speed1: number;
	steepness1: number;
	direction1: number[];
	// Wave 2
	amplitude2: number;
	wavelength2: number;
	speed2: number;
	steepness2: number;
	direction2: number[];
	// Wave 3
	amplitude3: number;
	wavelength3: number;
	speed3: number;
	steepness3: number;
	direction3: number[];
	// Wave 4
	amplitude4: number;
	wavelength4: number;
	speed4: number;
	steepness4: number;
	direction4: number[];
	// Detail noise - 방향 추가
	detailScale1: number;
	detailSpeed1: number;
	detailStrength1: number;
	detailDirection1: number[];
	detailScale2: number;
	detailSpeed2: number;
	detailStrength2: number;
	detailDirection2: number[];
	// Global settings
	waveRange: number;
	foamThreshold: number;
	normalOffset: number;
	normalStrength: number;
	// Randomization
	seed: number;
	noiseScale: number;
}

// 🌊 전체 WaterSettings 구조
export interface WaterSettings {
	displacementTexture: WaterTextureSettings;
	opacity: number;
	waterIOR: number;
	waterColor: string; // HEX 색상
	waterColorStrength: number;
}

// 프리셋 타입들
export type WaterPreset = Partial<{
	displacementTexture: Partial<WaterTextureSettings>;
	opacity: number;
	waterIOR: number;
	waterColor: string;
	waterColorStrength: number;
}>;
let WaterPresets: {
	calmOcean: WaterPreset;
	stormyOcean: WaterPreset;
	gentleWaves: WaterPreset;
	lakeRipples: WaterPreset
};
WaterPresets = {
	calmOcean: {
		displacementTexture: {
			amplitude1: 0.3, wavelength1: 8.0, speed1: 0.8, steepness1: 0.2, direction1: [1.0, 0.0],
			amplitude2: 0.2, wavelength2: 6.0, speed2: 0.6, steepness2: 0.15, direction2: [0.7, 0.7], // 정규화
			amplitude3: 0.1, wavelength3: 4.0, speed3: 1.0, steepness3: 0.1, direction3: [0.0, 1.0],
			amplitude4: 0.05, wavelength4: 2.0, speed4: 1.2, steepness4: 0.05, direction4: [-0.7, 0.7], // 정규화
			detailScale1: 4.0, detailSpeed1: 0.3, detailStrength1: 0.04, detailDirection1: [0.3, 0.1],
			detailScale2: 8.0, detailSpeed2: 0.2, detailStrength2: 0.02, detailDirection2: [-0.2, 0.4],
			waveRange: 1.0, foamThreshold: 0.8,
			normalOffset: 0.01, normalStrength: 1.0,
			seed: 42.0, noiseScale: 0.8
		},
		opacity: 0.6,
		waterIOR: 1.333,
		waterColor: '#4A90E2',
		waterColorStrength: 0.7
	} as WaterPreset,

	stormyOcean: {
		displacementTexture: {
			amplitude1: 1.2, wavelength1: 15.0, speed1: 2.0, steepness1: 0.4, direction1: [1.0, 0.0], // steepness 감소
			amplitude2: 0.8, wavelength2: 10.0, speed2: 1.8, steepness2: 0.3, direction2: [0.8, 0.6], // steepness 감소
			amplitude3: 0.6, wavelength3: 6.0, speed3: 2.5, steepness3: 0.25, direction3: [0.0, 1.0], // steepness 감소
			amplitude4: 0.4, wavelength4: 3.0, speed4: 3.0, steepness4: 0.2, direction4: [-0.6, 0.8], // steepness 감소
			detailScale1: 8.0, detailSpeed1: 0.8, detailStrength1: 0.1, detailDirection1: [0.6, 0.3],
			detailScale2: 16.0, detailSpeed2: 0.6, detailStrength2: 0.06, detailDirection2: [-0.4, 0.7],
			waveRange: 2.8, foamThreshold: 0.4,
			normalOffset: 0.008, normalStrength: 1.4,
			seed: 123.0, noiseScale: 1.2
		},
		opacity: 0.4,
		waterIOR: 1.333,
		waterColor: '#2E4F6B',
		waterColorStrength: 0.9
	} as WaterPreset,

	gentleWaves: {
		displacementTexture: {
			amplitude1: 0.5, wavelength1: 6.0, speed1: 1.0, steepness1: 0.3, direction1: [1.0, 0.0],
			amplitude2: 0.35, wavelength2: 4.5, speed2: 0.8, steepness2: 0.25, direction2: [0.7, 0.7],
			amplitude3: 0.18, wavelength3: 3.0, speed3: 1.2, steepness3: 0.15, direction3: [0.0, 1.0],
			amplitude4: 0.08, wavelength4: 1.8, speed4: 1.5, steepness4: 0.08, direction4: [-0.7, 0.7],
			detailScale1: 6.0, detailSpeed1: 0.5, detailStrength1: 0.06, detailDirection1: [0.4, 0.2],
			detailScale2: 12.0, detailSpeed2: 0.3, detailStrength2: 0.03, detailDirection2: [-0.3, 0.5],
			waveRange: 1.3, foamThreshold: 0.75,
			normalOffset: 0.01, normalStrength: 0.9,
			seed: 256.0, noiseScale: 0.9
		},
		opacity: 0.55,
		waterIOR: 1.333,
		waterColor: '#5BA3D4',
		waterColorStrength: 0.6
	} as WaterPreset,

	lakeRipples: {
		displacementTexture: {
			// 파도 amplitude 더 감소
			amplitude1: 0.04, wavelength1: 3.0, speed1: 0.2, steepness1: 0.015, direction1: [1.0, 0.0],
			amplitude2: 0.03, wavelength2: 2.0, speed2: 0.18, steepness2: 0.01, direction2: [0.6, 0.8],
			amplitude3: 0.02, wavelength3: 1.5, speed3: 0.25, steepness3: 0.008, direction3: [0.0, 1.0],
			amplitude4: 0.01, wavelength4: 1.0, speed4: 0.3, steepness4: 0.005, direction4: [-0.8, 0.6],

			// 디테일 노이즈 최소화
			detailScale1: 5.0,
			detailSpeed1: 0.02,
			detailStrength1: 0.03,
			detailDirection1: [0.1, 0.05],

			detailScale2: 10.0,
			detailSpeed2: 0.015,
			detailStrength2: 0.02,
			detailDirection2: [-0.05, 0.15],

			waveRange: 0.2,
			foamThreshold: 0.99,
			normalOffset: 0.008,
			normalStrength: 0.2,
			seed: 512.0,
			noiseScale: 0.2
		},
		opacity: 0.85,
		waterIOR: 1.333,
		waterColor: '#B8E8F8',
		waterColorStrength: 0.25
	} as WaterPreset
};

interface WaterMaterial {
	opacity: number;
	waterIOR: number;
	waterColor: ColorRGB;
	waterColorStrength: number;
	foamColor: ColorRGB;
	foamBrightness: number;
	foamOpacity: number;
	use2PathRender: boolean
}

class WaterMaterial extends ABitmapBaseMaterial {
	static WaterPresets = WaterPresets
	#displacementTexture: WaterTexture
	#displacementScale: number = 1
	get displacementScale(): number {
		return this.#displacementScale;
	}

	set displacementScale(value: number) {
		this.#displacementScale = value;
	}

	get displacementTexture(): WaterTexture {
		return this.#displacementTexture;
	}

	set displacementTexture(value: WaterTexture) {
		const prevTexture: WaterTexture = this.#displacementTexture
		this.#displacementTexture = value;
		this.updateTexture(prevTexture, value)
		this.dirtyPipeline = true
	}

	get useDisplacementTextureNormal(): boolean {
		return true
	}

	// 🌊 Wave 1 Properties
	get amplitude1(): number {
		return this.#displacementTexture.getProperty('amplitude1') as number;
	}

	set amplitude1(value: number) {
		this.#displacementTexture.setProperty('amplitude1', value);
	}

	get wavelength1(): number {
		return this.#displacementTexture.getProperty('wavelength1') as number;
	}

	set wavelength1(value: number) {
		this.#displacementTexture.setProperty('wavelength1', value);
	}

	get speed1(): number {
		return this.#displacementTexture.getProperty('speed1') as number;
	}

	set speed1(value: number) {
		this.#displacementTexture.setProperty('speed1', value);
	}

	get steepness1(): number {
		return this.#displacementTexture.getProperty('steepness1') as number;
	}

	set steepness1(value: number) {
		this.#displacementTexture.setProperty('steepness1', value);
	}

	get direction1(): number[] {
		return this.#displacementTexture.getProperty('direction1') as number[];
	}

	set direction1(value: number[]) {
		this.#displacementTexture.setProperty('direction1', value);
	}

	// 🌊 Wave 2 Properties
	get amplitude2(): number {
		return this.#displacementTexture.getProperty('amplitude2') as number;
	}

	set amplitude2(value: number) {
		this.#displacementTexture.setProperty('amplitude2', value);
	}

	get wavelength2(): number {
		return this.#displacementTexture.getProperty('wavelength2') as number;
	}

	set wavelength2(value: number) {
		this.#displacementTexture.setProperty('wavelength2', value);
	}

	get speed2(): number {
		return this.#displacementTexture.getProperty('speed2') as number;
	}

	set speed2(value: number) {
		this.#displacementTexture.setProperty('speed2', value);
	}

	get steepness2(): number {
		return this.#displacementTexture.getProperty('steepness2') as number;
	}

	set steepness2(value: number) {
		this.#displacementTexture.setProperty('steepness2', value);
	}

	get direction2(): number[] {
		return this.#displacementTexture.getProperty('direction2') as number[];
	}

	set direction2(value: number[]) {
		this.#displacementTexture.setProperty('direction2', value);
	}

	// 🌊 Wave 3 Properties
	get amplitude3(): number {
		return this.#displacementTexture.getProperty('amplitude3') as number;
	}

	set amplitude3(value: number) {
		this.#displacementTexture.setProperty('amplitude3', value);
	}

	get wavelength3(): number {
		return this.#displacementTexture.getProperty('wavelength3') as number;
	}

	set wavelength3(value: number) {
		this.#displacementTexture.setProperty('wavelength3', value);
	}

	get speed3(): number {
		return this.#displacementTexture.getProperty('speed3') as number;
	}

	set speed3(value: number) {
		this.#displacementTexture.setProperty('speed3', value);
	}

	get steepness3(): number {
		return this.#displacementTexture.getProperty('steepness3') as number;
	}

	set steepness3(value: number) {
		this.#displacementTexture.setProperty('steepness3', value);
	}

	get direction3(): number[] {
		return this.#displacementTexture.getProperty('direction3') as number[];
	}

	set direction3(value: number[]) {
		this.#displacementTexture.setProperty('direction3', value);
	}

	// 🌊 Wave 4 Properties
	get amplitude4(): number {
		return this.#displacementTexture.getProperty('amplitude4') as number;
	}

	set amplitude4(value: number) {
		this.#displacementTexture.setProperty('amplitude4', value);
	}

	get wavelength4(): number {
		return this.#displacementTexture.getProperty('wavelength4') as number;
	}

	set wavelength4(value: number) {
		this.#displacementTexture.setProperty('wavelength4', value);
	}

	get speed4(): number {
		return this.#displacementTexture.getProperty('speed4') as number;
	}

	set speed4(value: number) {
		this.#displacementTexture.setProperty('speed4', value);
	}

	get steepness4(): number {
		return this.#displacementTexture.getProperty('steepness4') as number;
	}

	set steepness4(value: number) {
		this.#displacementTexture.setProperty('steepness4', value);
	}

	get direction4(): number[] {
		return this.#displacementTexture.getProperty('direction4') as number[];
	}

	set direction4(value: number[]) {
		this.#displacementTexture.setProperty('direction4', value);
	}

	// 🎯 Detail Properties
	get detailScale1(): number {
		return this.#displacementTexture.getProperty('detailScale1') as number;
	}

	set detailScale1(value: number) {
		this.#displacementTexture.setProperty('detailScale1', value);
	}

	get detailSpeed1(): number {
		return this.#displacementTexture.getProperty('detailSpeed1') as number;
	}

	set detailSpeed1(value: number) {
		this.#displacementTexture.setProperty('detailSpeed1', value);
	}

	get detailStrength1(): number {
		return this.#displacementTexture.getProperty('detailStrength1') as number;
	}

	set detailStrength1(value: number) {
		this.#displacementTexture.setProperty('detailStrength1', value);
	}

	get detailDirection1(): number[] {
		return this.#displacementTexture.getProperty('detailDirection1') as number[];
	}

	set detailDirection1(value: number[]) {
		this.#displacementTexture.setProperty('detailDirection1', value);
	}

	get detailScale2(): number {
		return this.#displacementTexture.getProperty('detailScale2') as number;
	}

	set detailScale2(value: number) {
		this.#displacementTexture.setProperty('detailScale2', value);
	}

	get detailSpeed2(): number {
		return this.#displacementTexture.getProperty('detailSpeed2') as number;
	}

	set detailSpeed2(value: number) {
		this.#displacementTexture.setProperty('detailSpeed2', value);
	}

	get detailStrength2(): number {
		return this.#displacementTexture.getProperty('detailStrength2') as number;
	}

	set detailStrength2(value: number) {
		this.#displacementTexture.setProperty('detailStrength2', value);
	}

	get detailDirection2(): number[] {
		return this.#displacementTexture.getProperty('detailDirection2') as number[];
	}

	set detailDirection2(value: number[]) {
		this.#displacementTexture.setProperty('detailDirection2', value);
	}

	// 🌊 Global Properties
	get waveRange(): number {
		return this.#displacementTexture.getProperty('waveRange') as number;
	}

	set waveRange(value: number) {
		this.#displacementTexture.setProperty('waveRange', value);
	}

	get foamThreshold(): number {
		return this.#displacementTexture.getProperty('foamThreshold') as number;
	}

	set foamThreshold(value: number) {
		this.#displacementTexture.setProperty('foamThreshold', value);
	}

	// 🎯 Normal Properties
	get normalOffset(): number {
		return this.#displacementTexture.getProperty('normalOffset') as number;
	}

	set normalOffset(value: number) {
		this.#displacementTexture.setProperty('normalOffset', value);
	}

	get normalStrength(): number {
		return this.#displacementTexture.getProperty('normalStrength') as number;
	}

	set normalStrength(value: number) {
		this.#displacementTexture.setProperty('normalStrength', value);
	}

	// 🎯 Randomization Properties
	get seed(): number {
		return this.#displacementTexture.getProperty('seed') as number;
	}

	set seed(value: number) {
		this.#displacementTexture.setProperty('seed', value);
	}

	get noiseScale(): number {
		return this.#displacementTexture.frequency;
	}

	set noiseScale(value: number) {
		this.#displacementTexture.updateUniform('frequency', value)
	}

	// 🧭 물 흐름 방향 제어 메서드들
	/**
	 * 각도(도)로 전체 흐름 방향 설정
	 * @param degrees 0° = 동쪽, 90° = 북쪽, 180° = 서쪽, 270° = 남쪽
	 */
	setFlowDirectionByDegrees(degrees: number) {
		const radians = (degrees * Math.PI) / 180;
		this.setNaturalFlowDirection(radians);
	}

	/**
	 * 자연스러운 wave 방향 설정 (각 wave가 약간씩 다른 방향)
	 * @param baseAngle 기본 방향 (라디안)
	 * @param variation 방향 변화량 (라디안)
	 */
	setNaturalFlowDirection(baseAngle: number, variation: number = 0.3) {
		// 각 wave마다 약간씩 다른 방향 설정
		this.direction1 = this.#angleToDirection(baseAngle);
		this.direction2 = this.#angleToDirection(baseAngle + variation * 0.5);
		this.direction3 = this.#angleToDirection(baseAngle - variation * 0.3);
		this.direction4 = this.#angleToDirection(baseAngle + variation * 0.8);
		// 디테일 노이즈는 더 복잡하고 미세한 방향으로 설정
		this.detailDirection1 = this.#angleToDirection(baseAngle + variation * 0.2);
		this.detailDirection2 = this.#angleToDirection(baseAngle - variation * 0.4);
	}

	#angleToDirection(angle: number): number[] {
		return [Math.cos(angle), Math.sin(angle)];
	}

	constructor(redGPUContext: RedGPUContext, color: string = '#20B2AA', name?: string) {
		super(
			redGPUContext,
			'WATER_MATERIAL',
			SHADER_INFO,
			2
		)
		if (name) this.name = name
		this.initGPURenderInfos()
		this.displacementTexture = new WaterTexture(redGPUContext, 2048, 2048)
		this.waterColor.setColorByHEX(color)
		this.opacity = 0.5
		this.waterIOR = 1.333
		this.waterColorStrength = 0.5
		this.use2PathRender = true

		this.applyPreset(WaterPresets.calmOcean)
	}

	// 🌊 프리셋 적용
	applyPreset(preset: WaterPreset) {
		// 🌊 DisplacementTexture 설정 적용
		if (preset.displacementTexture) {
			this.displacementTexture?.applyPreset(preset.displacementTexture);
		}
		// 🎨 Material 설정 적용
		if (preset.waterColor !== undefined) {
			this.waterColor.setColorByHEX(preset.waterColor);
		}
		if (preset.opacity !== undefined) {
			this.opacity = preset.opacity;
		}
		if (preset.waterIOR !== undefined) {
			this.waterIOR = preset.waterIOR;
		}
		if (preset.waterColorStrength !== undefined) {
			this.waterColorStrength = preset.waterColorStrength;
		}
	}

	// 🌊 전체 설정 가져오기
	getWaterSettings(): WaterSettings {
		return {
			displacementTexture: this.displacementTexture?.getWaterSettings() || {} as WaterTextureSettings,
			opacity: this.opacity,
			waterIOR: this.waterIOR,
			waterColor: this.waterColor.hex,
			waterColorStrength: this.waterColorStrength
		};
	}

	// 🌊 설정 적용
	applyWaterSettings(settings: Partial<WaterSettings>) {
		if (settings.displacementTexture) {
			this.displacementTexture?.applyPreset(settings.displacementTexture);
		}
		if (settings.opacity !== undefined) {
			this.opacity = settings.opacity;
		}
		if (settings.waterIOR !== undefined) {
			this.waterIOR = settings.waterIOR;
		}
		if (settings.waterColor !== undefined) {
			this.waterColor.setColorByHEX(settings.waterColor);
		}
		if (settings.waterColorStrength !== undefined) {
			this.waterColorStrength = settings.waterColorStrength;
		}
	}
}

DefineForFragment.defineByPreset(WaterMaterial, [
	DefineForFragment.PRESET_POSITIVE_NUMBER.OPACITY,
])
Object.freeze(WaterMaterial)
DefineForFragment.defineTexture(WaterMaterial, [])
DefineForFragment.defineColorRGB(WaterMaterial, [
	['waterColor', '#0D4F8C'],
])
DefineForFragment.definePositiveNumber(WaterMaterial, [
	['waterIOR', 1.333, true, 1.0, 1.8],
	['waterColorStrength', 0.7, true, 0.0, 1.0],
])
export default WaterMaterial
