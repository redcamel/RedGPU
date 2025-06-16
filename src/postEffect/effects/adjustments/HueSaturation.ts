import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";

class HueSaturation extends ASinglePassPostEffect {
	#hue: number = 0
	#saturation: number = 0

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const computeCode = `
        let index = vec2<u32>(global_id.xy );
        let dimensions: vec2<u32> = textureDimensions(sourceTexture);
        let dimW = f32(dimensions.x);
        let dimH = f32(dimensions.y);
        let uv = 	vec2<f32>(f32(index.x)/dimW,f32(index.y)/dimH);
        var color:vec4<f32> = textureLoad( sourceTexture, index, );
        
        let hue_value : f32 = uniforms.hue / 180.0;
        let saturation_value : f32 = uniforms.saturation / 100.0;
        let angle : f32 = hue_value * 3.1415926535897932384626433832795;
        let s : f32 = sin(angle);
        let c : f32 = cos(angle);
        var weights : vec3<f32> = (vec3<f32>(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
        let len : f32 = length(color.rgb);
        
        color = vec4<f32>(
          vec3<f32>(
            dot(color.rgb, weights.xyz),
            dot(color.rgb, weights.zxy),
            dot(color.rgb, weights.yzx)
          ),
          color.a
        );
        
        let average : f32 = (color.r + color.g + color.b) / 3.0;
        
        if (saturation_value > 0.0) {
          color = vec4<f32>(
            color.rgb + (average - color.rgb) * (1.0 - 1.0 / (1.001 - saturation_value)),
            color.a
          );
        } else {
          color = vec4<f32>(
            color.rgb + (average - color.rgb) * (-saturation_value),
            color.a
          );
        }
        
        textureStore(outputTexture, index, color );
    `
		const uniformStructCode = `
      struct Uniforms {
			  hue:f32,
			  saturation:f32
			};
			`
		this.init(
			redGPUContext,
			'POST_EFFECT_HUE_SATURATION',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}

	get hue(): number {
		return this.#hue;
	}

	set hue(value: number) {
		validateNumberRange(value, -180, 180)
		this.#hue = value;
		this.updateUniform('hue', value)
	}

	get saturation(): number {
		return this.#saturation;
	}

	set saturation(value: number) {
		validateNumberRange(value, -100, 100)
		this.#saturation = value;
		this.updateUniform('saturation', value)
	}
}

Object.freeze(HueSaturation)
export default HueSaturation
