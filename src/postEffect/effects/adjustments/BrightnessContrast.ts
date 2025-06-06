import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createPostEffectCode from "../../core/createPostEffectCode";

class BrightnessContrast extends ASinglePassPostEffect {
    #brightness: number = 0
    #contrast: number = 0

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const computeCode = createPostEffectCode(
            this,
            `
							let index = vec2<u32>(global_id.xy );
							let dimensions: vec2<u32> = textureDimensions(sourceTexture);
							let dimW = f32(dimensions.x);
							let dimH = f32(dimensions.y);
							let uv = 	vec2<f32>(f32(index.x)/dimW,f32(index.y)/dimH);
							var color:vec4<f32> = textureLoad(
								sourceTexture,
								index,
							);
							
							let brightness_value : f32 = uniforms.brightness / 255.0;
							let contrast_value : f32 = uniforms.contrast / 255.0;
							
							var tempColor:vec3<f32>;
							if ( contrast_value > 0.0 ) {
								tempColor = ( color.rgb - 0.5 ) / ( 1.0 - contrast_value ) + 0.5;
							}
							else {
								tempColor= ( color.rgb - 0.5 ) * ( 1.0 + contrast_value ) + 0.5;
							}
							color = vec4<f32>(tempColor + brightness_value, color.a);
							
							textureStore(outputTexture, index, color );
			`,
            `
      struct Uniforms {
				brightness:f32,
				contrast:f32
			};
			`
        )
        this.init(
            redGPUContext,
            'POST_EFFECT_BRIGHTNESS_CONTRAST',
            computeCode
        )
    }

    get brightness(): number {
        return this.#brightness;
    }

    set brightness(value: number) {
        validateNumberRange(value, -150, 150)
        this.#brightness = value;
        this.uniformBuffer.writeBuffer(this.uniformInfo.members.brightness, value)
    }

    get contrast(): number {
        return this.#contrast;
    }

    set contrast(value: number) {
        validateNumberRange(value, -50, 100)
        this.#contrast = value;
        this.uniformBuffer.writeBuffer(this.uniformInfo.members.contrast, value)
    }
}

Object.freeze(BrightnessContrast)
export default BrightnessContrast
