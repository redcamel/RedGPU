import RedGPUContext from "../../../../context/RedGPUContext";
import validatePositiveNumberRange from "../../../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import {NoiseDefine} from "../core/ANoiseTexture";
import ASimplexTexture from "../core/ASimplexTexture";
import {mergerNoiseUniformDefault, mergerNoiseUniformStruct} from "../core/noiseDegineMerges";

const FIRE_OPTIONS = {
	fireHeight: 1,        // 화염 높이
	fireIntensity: 1.2,     // 화염 강도
	flickerSpeed: 1.0,      // 깜빡임 속도
	turbulence: 0.1,        // 난류 강도
	fireSpeed: 0.8          // 화염 상승 속도
}

class NoiseFireTexture extends ASimplexTexture {
	#fireHeight:number = FIRE_OPTIONS.fireHeight;
	get fireHeight(): number {
		return this.#fireHeight;
	}

	set fireHeight(value: number) {
		validatePositiveNumberRange(value);
		this.#fireHeight = value;
		this.updateUniform('fireHeight', value);
	}

	#fireIntensity:number = FIRE_OPTIONS.fireIntensity;
	get fireIntensity(): number {
		return this.#fireIntensity;
	}
	set fireIntensity(value: number) {
		validatePositiveNumberRange(value);
		this.#fireIntensity = value;
		this.updateUniform('fireIntensity', value);
	}

	#flickerSpeed:number = FIRE_OPTIONS.flickerSpeed;
	get flickerSpeed(): number {
		return this.#flickerSpeed;
	}
	set flickerSpeed(value: number) {
		validatePositiveNumberRange(value);
		this.#flickerSpeed = value;
		this.updateUniform('flickerSpeed', value);
	}

	#turbulence:number = FIRE_OPTIONS.turbulence;
	get turbulence(): number {
		return this.#turbulence;
	}
	set turbulence(value: number) {
		validatePositiveNumberRange(value);
		this.#turbulence = value;
		this.updateUniform('turbulence', value);
	}

	#fireSpeed:number = FIRE_OPTIONS.fireSpeed;
	get fireSpeed(): number {
		return this.#fireSpeed;
	}
	set fireSpeed(value: number) {
		validatePositiveNumberRange(value);
		this.#fireSpeed = value;
		this.updateUniform('fireSpeed', value);
	}

	constructor(
		redGPUContext: RedGPUContext,
		width: number = 1024,
		height: number = 1024,
		define?: NoiseDefine
	) {
		const mainLogic = define?.mainLogic || `
/* 🕯️ 자연스러운 화염 */

/* 기본 화염 형태 */
let flame_uv = vec2<f32>(
    base_uv.x + sin(uniforms.time * uniforms.flickerSpeed + base_uv.y * 5.0) * uniforms.turbulence,
    base_uv.y + uniforms.time * uniforms.fireSpeed 
);

/* 주 화염 노이즈 */
let main_noise = getNoiseByDimension(flame_uv, uniforms);

/* 디테일 흔들림 (위로 갈수록 더 흔들림) */
let detail_factor = base_uv.y * 0.8;
let detail_uv = vec2<f32>(
    base_uv.x * 2.0 + sin(uniforms.time  * 3.0 + base_uv.y * 8.0) * 0.05 * detail_factor,
    base_uv.y * 1.5 + uniforms.time * uniforms.fireSpeed  * 0.8
);
let detail_noise = getNoiseByDimension(detail_uv, uniforms) * 0.3;

/* 화염 모양 마스크 (fireHeight가 클수록 화염이 높아짐) */
let flame_shape = smoothstep(1.0 - uniforms.fireHeight, 1.0, base_uv.y);

/* 화염 강도 */
let combined_noise = main_noise + detail_noise;
let fire_intensity = combined_noise * flame_shape * uniforms.fireIntensity;

/* 🎨 원래 방식으로 돌아가되, 아래쪽이 더 뜨겁도록 */
let flame_heat = fire_intensity * (1.2 - base_uv.y * 0.5); // 아래쪽이 더 뜨거움

/* 자연스러운 화염 색상 */
let inner_flame = vec3<f32>(1.0, 0.8, 0.2);    // 내부 밝은 노랑
let outer_flame = vec3<f32>(1.0, 0.4, 0.1);    // 외부 주황
let flame_edge = vec3<f32>(0.6, 0.1, 0.0);     // 가장자리 빨강

/* 화염 색상 블렌딩 */
var fire_color: vec3<f32>;
if (flame_heat > 0.6) {
    fire_color = mix(outer_flame, inner_flame, (flame_heat - 0.6) / 0.4);
} else if (flame_heat > 0.2) {
    fire_color = mix(flame_edge, outer_flame, (flame_heat - 0.2) / 0.4);
} else {
    fire_color = flame_edge * (flame_heat / 0.2);
}

/* 투명도 (이제 올바른 방향) */
let alpha = clamp(fire_intensity, 0.0, 1.0);
let finalColor = vec4<f32>(fire_color, alpha);
`;

		const uniformStruct = mergerNoiseUniformStruct(`
            fireHeight: f32,
            fireIntensity: f32,
            flickerSpeed: f32,
            turbulence: f32,
            fireSpeed: f32,
        `, define?.uniformStruct);

		const uniformDefaults = mergerNoiseUniformDefault(FIRE_OPTIONS, define?.uniformDefaults);
		const helperFunctions = define?.helperFunctions || '';

		super(redGPUContext, width, height, {
			uniformStruct,
			mainLogic,
			uniformDefaults,
			helperFunctions
		});
	}
}

export default NoiseFireTexture;
