import RedGPUContext from "../../context/RedGPUContext";
import ASinglePassPostEffect from "../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../core/createBasicPostEffectCode";

const SUBTLE = {
	filmGrainIntensity: 0.02,
	filmGrainResponse: 0.9,
	filmGrainScale: 2.5,
	coloredGrain: 0.3,
	grainSaturation: 0.4
};
const MEDIUM = {
	filmGrainIntensity: 0.05,
	filmGrainResponse: 0.8,
	filmGrainScale: 3.0,
	coloredGrain: 0.5,
	grainSaturation: 0.6
};
const HEAVY = {
	filmGrainIntensity: 0.12,
	filmGrainResponse: 0.6,
	filmGrainScale: 4.0,
	coloredGrain: 0.7,
	grainSaturation: 0.8
};
const VINTAGE = {
	filmGrainIntensity: 0.08,
	filmGrainResponse: 0.7,
	filmGrainScale: 5.0,
	coloredGrain: 0.9,
	grainSaturation: 1.0
};

class FilmGrain extends ASinglePassPostEffect {
	static SUBTLE = SUBTLE;
	static MEDIUM = MEDIUM;
	static HEAVY = HEAVY;
	static VINTAGE = VINTAGE;
	#filmGrainIntensity: number = HEAVY.filmGrainIntensity;
	#filmGrainResponse: number = HEAVY.filmGrainResponse;
	#filmGrainScale: number = HEAVY.filmGrainScale;
	#coloredGrain: number = HEAVY.coloredGrain;
	#grainSaturation: number = HEAVY.grainSaturation;
	#time: number = 0.0;
	#devicePixelRatio: number = 1.0;

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		this.#devicePixelRatio = window?.devicePixelRatio || 1.0;
		const computeCode = `
	    let index = vec2<i32>(global_id.xy);
	    let dimensions: vec2<u32> = textureDimensions(sourceTexture);
	    let dimW = f32(dimensions.x);
	    let dimH = f32(dimensions.y);
	    let uv = vec2<f32>(f32(index.x) / dimW, f32(index.y) / dimH);
	    
	    let originalColor = textureLoad(sourceTexture, index);
	    
	    let filmGrainIntensity_value: f32 = uniforms.filmGrainIntensity;
	    let filmGrainResponse_value: f32 = uniforms.filmGrainResponse;
	    let filmGrainScale_value: f32 = uniforms.filmGrainScale;
	    let coloredGrain_value: f32 = uniforms.coloredGrain;
	    let grainSaturation_value: f32 = uniforms.grainSaturation;
	    let time_value: f32 = uniforms.time;
	    let devicePixelRatio_value: f32 = uniforms.devicePixelRatio;
	    
	    if (filmGrainIntensity_value <= 0.0) {
	        textureStore(outputTexture, index, originalColor);
	        return;
	    }
	    
	    let baseScale = max(filmGrainScale_value, 0.1);
	    let scaledUV = uv * vec2<f32>(dimW, dimH) * devicePixelRatio_value / baseScale;
	    
	    let timeOffset = vec2<f32>(
	        fract(time_value * 0.0317) * 100.0,
	        fract(time_value * 0.0271) * 100.0
	    );
	    let grainCoord = scaledUV + timeOffset;
	    
	    let sampleOffset = 1.0 / baseScale;
	    let noiseR = (filmGrainNoise(grainCoord) + 
	                 filmGrainNoise(grainCoord + vec2<f32>(sampleOffset, 0.0)) +
	                 filmGrainNoise(grainCoord + vec2<f32>(0.0, sampleOffset))) / 3.0;
	    let noiseG = filmGrainNoise(grainCoord + vec2<f32>(127.1, 311.7));
	    let noiseB = filmGrainNoise(grainCoord + vec2<f32>(269.5, 183.3));
	    
	    let monoGrain = (noiseR + noiseG + noiseB) / 3.0;
	    let colorGrain = vec3<f32>(noiseR, noiseG, noiseB);
	    
	    var grainColor = mix(vec3<f32>(monoGrain), colorGrain, coloredGrain_value);
	    
	    let grainLuminance = dot(grainColor, vec3<f32>(0.299, 0.587, 0.114));
	    grainColor = mix(vec3<f32>(grainLuminance), grainColor, grainSaturation_value);
	    
	    let luminance = dot(originalColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
	    let luminanceWeight = pow(max(luminance, 0.01), filmGrainResponse_value);
	    
	    let grainIntensity = filmGrainIntensity_value * luminanceWeight;
	    let grain = grainColor * grainIntensity;
	    
	    let finalColor = originalColor.rgb + grain;
	    
	    let outputColor = vec4<f32>(clamp(finalColor, vec3<f32>(0.0), vec3<f32>(1.0)), originalColor.a);
	    
	    textureStore(outputTexture, index, outputColor);
    `
		const uniformStructCode = `
			struct Uniforms {
			    filmGrainIntensity: f32,
			    filmGrainResponse: f32,
			    filmGrainScale: f32,
			    coloredGrain: f32,
			    grainSaturation: f32,
			    time: f32,
			    devicePixelRatio: f32
			};
			
			fn filmGrainNoise(coord: vec2<f32>) -> f32 {
			    let p = floor(coord);
			    let f = fract(coord);
			    
			    let u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
			    
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
		this.init(
			redGPUContext,
			'POST_EFFECT_FILM_GRAIN',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		);
		this.#updateUniforms();
	}

	#updateUniforms(): void {
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.filmGrainIntensity, this.#filmGrainIntensity);
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.filmGrainResponse, this.#filmGrainResponse);
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.filmGrainScale, this.#filmGrainScale);
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.coloredGrain, this.#coloredGrain);
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.grainSaturation, this.#grainSaturation);
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.time, this.#time);
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.devicePixelRatio, this.#devicePixelRatio);
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
		this.#filmGrainScale = Math.max(0.1, Math.min(20.0, value));
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.filmGrainScale, this.#filmGrainScale);
	}

	get coloredGrain(): number {
		return this.#coloredGrain;
	}

	set coloredGrain(value: number) {
		this.#coloredGrain = Math.max(0.0, Math.min(1.0, value));
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.coloredGrain, this.#coloredGrain);
	}

	get grainSaturation(): number {
		return this.#grainSaturation;
	}

	set grainSaturation(value: number) {
		this.#grainSaturation = Math.max(0.0, Math.min(2.0, value));
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.grainSaturation, this.#grainSaturation);
	}

	applyPreset(preset: typeof SUBTLE | typeof MEDIUM | typeof HEAVY | typeof VINTAGE): void {
		this.#filmGrainIntensity = preset.filmGrainIntensity;
		this.#filmGrainResponse = preset.filmGrainResponse;
		this.#filmGrainScale = preset.filmGrainScale;
		this.#coloredGrain = preset.coloredGrain;
		this.#grainSaturation = preset.grainSaturation;
		this.#updateUniforms();
	}

	update(deltaTime: number): void {
		this.#time += deltaTime;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.time, this.#time);
	}
}

Object.freeze(FilmGrain);
export default FilmGrain;
