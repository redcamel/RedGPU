import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";

class Vignetting extends ASinglePassPostEffect {
	#smoothness: number = 0.2
	#size: number = 0.5

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const computeCode = `
        let dimensions = textureDimensions(sourceTexture);
        let dimW = f32(dimensions.x);
        let dimH = f32(dimensions.y);
        
        let index = vec2<u32>(global_id.xy);
        let uv = vec2<f32>(f32(index.x) / dimW, f32(index.y) / dimH);
        
        let smoothness = uniforms.smoothness;
        let size = uniforms.size;
        
        var color : vec4<f32> = textureLoad(sourceTexture, index);
        var diff = size - distance(uv, vec2<f32>(0.5));
        
        let vignette = smoothstep(-smoothness, smoothness, diff);
        
        color.r *= vignette;
        color.g *= vignette;
        color.b *= vignette;
        
        textureStore(outputTexture, index, color);
    `
		const uniformStructCode = `
      struct Uniforms {
					smoothness: f32,
					size:f32,
			};
			`
		this.init(
			redGPUContext,
			'POST_EFFECT_VIGNETTING',
			createBasicPostEffectCode(this, computeCode, uniformStructCode),
		)
		this.smoothness = this.#smoothness
		this.size = this.#size
	}

	get size(): number {
		return this.#size;
	}

	set size(value: number) {
		validateNumberRange(value, 0,)
		this.#size = value;
		this.updateUniform('size', value)
	}

	get smoothness(): number {
		return this.#smoothness;
	}

	set smoothness(value: number) {
		validateNumberRange(value, 0, 1)
		this.#smoothness = value;
		this.updateUniform('smoothness', value)
	}
}

Object.freeze(Vignetting)
export default Vignetting
