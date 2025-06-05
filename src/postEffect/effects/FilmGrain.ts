import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../core/ASinglePassPostEffect";
import createPostEffectCode from "../core/createPostEffectCode";

const SUBTLE = {
	filmGrainIntensity: 0.02,
	filmGrainResponse: 0.9,
	filmGrainScale: 1.0
};
const MEDIUM = {
	filmGrainIntensity: 0.05,
	filmGrainResponse: 0.8,
	filmGrainScale: 1.2
};
const HEAVY = {
	filmGrainIntensity: 0.12,
	filmGrainResponse: 0.6,
	filmGrainScale: 1.5
};
const VINTAGE = {
	filmGrainIntensity: 0.08,
	filmGrainResponse: 0.7,
	filmGrainScale: 2.0
};

class FilmGrain extends ASinglePassPostEffect {
	static SUBTLE = SUBTLE;
	static MEDIUM = MEDIUM;
	static HEAVY = HEAVY;
	static VINTAGE = VINTAGE;

	#filmGrainIntensity: number = 0.25 // 필름 그레인의 강도/세기
	#filmGrainResponse: number = 0.8; // 밝기(luminance)에 따른 그레인의 반응성/민감도
	#filmGrainScale: number = 1.2; // 그레인 크기 배율 (1.0 = 기본 크기)
	#time: number = 0.0;
	#devicePixelRatio: number = 1.0;

	constructor(redGPUContext: RedGPUContext) {
		super();
		// 디바이스 픽셀 비율 가져오기
		this.#devicePixelRatio = window?.devicePixelRatio || 1.0;

		const computeCode = createPostEffectCode(
			this,
			`
                let index = vec2<i32>(global_id.xy);
                let dimensions: vec2<u32> = textureDimensions(sourceTexture);
                let dimW = f32(dimensions.x);
                let dimH = f32(dimensions.y);
                let uv = vec2<f32>(f32(index.x) / dimW, f32(index.y) / dimH);
                
                let originalColor = textureLoad(sourceTexture, index);
                
                let filmGrainIntensity_value: f32 = uniforms.filmGrainIntensity;
                let filmGrainResponse_value: f32 = uniforms.filmGrainResponse;
                let filmGrainScale_value: f32 = uniforms.filmGrainScale;
                let time_value: f32 = uniforms.time;
                let devicePixelRatio_value: f32 = uniforms.devicePixelRatio;
                
                if (filmGrainIntensity_value <= 0.0) {
                    textureStore(outputTexture, index, originalColor);
                    return;
                }
                
                let pixelRatio = vec2<f32>(dimW, dimH) * devicePixelRatio_value;
                let grainCoord = (uv * pixelRatio) / filmGrainScale_value + vec2<f32>(
                    fract(time_value * 0.1317),
                    fract(time_value * 0.0671)
                ) * 1000.0;
                
                let noise = filmGrainNoise(grainCoord);
                
                let luminance = dot(originalColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                
                let luminanceWeight = pow(max(luminance, 0.01), filmGrainResponse_value);
                
                let grain = noise * filmGrainIntensity_value * luminanceWeight;
                
                let finalColor = originalColor.rgb + vec3<f32>(grain);
                
                let outputColor = vec4<f32>(clamp(finalColor, vec3<f32>(0.0), vec3<f32>(1.0)), originalColor.a);
                
                textureStore(outputTexture, index, outputColor);
            `,
			`
            struct Uniforms {
                filmGrainIntensity: f32,
                filmGrainResponse: f32,
                filmGrainScale: f32,
                time: f32,
                devicePixelRatio: f32
            };
            
            fn filmGrainNoise(coord: vec2<f32>) -> f32 {
                let p = floor(coord);
                let f = fract(coord);
                
                let u = f * f * (3.0 - 2.0 * f);
                
                let a = hash(p);
                let b = hash(p + vec2<f32>(1.0, 0.0));
                let c = hash(p + vec2<f32>(0.0, 1.0));
                let d = hash(p + vec2<f32>(1.0, 1.0));
                
                let noise = mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
                
                return (noise - 0.5) * 2.0;
            }
            
            fn hash(p: vec2<f32>) -> f32 {
                var p3 = fract(vec3<f32>(p.xyx) * 0.1031);
                p3 += dot(p3, p3.yzx + 33.33);
                return fract((p3.x + p3.y) * p3.z);
            }
            `
		);
		this.init(
			redGPUContext,
			'POST_EFFECT_FILM_GRAIN',
			computeCode
		);
		this.#updateUniforms();
	}

	#updateUniforms(): void {
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.filmGrainIntensity, this.#filmGrainIntensity);
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.filmGrainResponse, this.#filmGrainResponse);
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.filmGrainScale, this.#filmGrainScale);
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.time, this.#time);
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.devicePixelRatio, this.#devicePixelRatio);
	}

	updateDevicePixelRatio(): void {
		const newDPR = window?.devicePixelRatio || 1.0;
		if (this.#devicePixelRatio !== newDPR) {
			this.#devicePixelRatio = newDPR;
			this.uniformBuffer.writeBuffer(this.uniformInfo.members.devicePixelRatio, this.#devicePixelRatio);
		}
	}

	get filmGrainIntensity(): number {
		return this.#filmGrainIntensity;
	}

	set filmGrainIntensity(value: number) {
		this.#filmGrainIntensity = Math.max(0.0, Math.min(1.0, value));
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.filmGrainIntensity, this.#filmGrainIntensity);
	}

	get filmGrainResponse(): number {
		return this.#filmGrainResponse;
	}

	set filmGrainResponse(value: number) {
		this.#filmGrainResponse = Math.max(0.0, Math.min(2.0, value));
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.filmGrainResponse, this.#filmGrainResponse);
	}

	get filmGrainScale(): number {
		return this.#filmGrainScale;
	}

	set filmGrainScale(value: number) {
		this.#filmGrainScale = Math.max(0.1, Math.min(5.0, value));
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.filmGrainScale, this.#filmGrainScale);
	}

	applyPreset(preset: typeof SUBTLE | typeof MEDIUM | typeof HEAVY | typeof VINTAGE): void {
		this.#filmGrainIntensity = preset.filmGrainIntensity;
		this.#filmGrainResponse = preset.filmGrainResponse;
		this.#filmGrainScale = preset.filmGrainScale;
		this.#updateUniforms();
	}

	update(deltaTime: number): void {
		this.#time += deltaTime;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.time, this.#time);
	}
}

Object.freeze(FilmGrain);
export default FilmGrain;
