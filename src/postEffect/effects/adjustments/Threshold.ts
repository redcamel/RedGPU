import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createPostEffectCode from "../../core/createPostEffectCode";

class Threshold extends ASinglePassPostEffect {
    #threshold: number = 128

    constructor(redGPUContext: RedGPUContext) {
        super();
        const computeCode = createPostEffectCode(
            this,
            `
						let index = vec2<u32>(global_id.xy );
						let dimensions: vec2<u32> = textureDimensions(sourceTexture);
						let dimW = f32(dimensions.x);
						let dimH = f32(dimensions.y);
						var color:vec4<f32> = textureLoad(
							sourceTexture,
							index,
						);
						
						let threshold_value : f32 = uniforms.threshold / 255.0;
						var v = 0.0;
						if( 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b >= threshold_value) {
							v = 1.0;
						}
						color = vec4<f32>(v,v,v,color.a);
						textureStore(outputTexture, index, color );
			`,
            `
      struct Uniforms {
			  threshold:f32
			};
			`
        );
        this.init(
            redGPUContext,
            'POST_EFFECT_THRESHOLD',
            computeCode
        )
        this.threshold = this.#threshold
    }

    get threshold(): number {
        return this.#threshold;
    }

    set threshold(value: number) {
        validateNumberRange(value, 1, 255)
        this.#threshold = value;
        this.uniformBuffer.writeBuffer(this.uniformInfo.members.threshold, value)
    }
}

Object.freeze(Threshold)
export default Threshold
