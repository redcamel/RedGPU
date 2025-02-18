import RedGPUContext from "../../context/RedGPUContext";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../core/ASinglePassPostEffect";
import createPostEffectCode from "../core/createPostEffectCode";

class Vignetting extends ASinglePassPostEffect {
    #smoothness: number = 0.2
    #size: number = 0.5

    constructor(redGPUContext: RedGPUContext) {
        super();
        const computeCode = createPostEffectCode(
            this,
            `
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
			`,
            `
      struct Uniforms {
					smoothness: f32,
					size:f32,
			};
			`
        )
        this.init(
            redGPUContext,
            'POST_EFFECT_VIGNETTING',
            computeCode
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
        this.uniformBuffer.writeBuffer(this.uniformInfo.members.size, value)
    }

    get smoothness(): number {
        return this.#smoothness;
    }

    set smoothness(value: number) {
        validateNumberRange(value, 0, 1)
        this.#smoothness = value;
        this.uniformBuffer.writeBuffer(this.uniformInfo.members.smoothness, value)
    }
}

Object.freeze(Vignetting)
export default Vignetting
