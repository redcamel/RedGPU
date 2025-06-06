import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createPostEffectCode from "../../core/createPostEffectCode";

class Invert extends ASinglePassPostEffect {
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
				color.r = 1.0 - color.r;
				color.g = 1.0 - color.g;
				color.b = 1.0 - color.b;
				
				textureStore(outputTexture, index, color );
			`
        )
        this.init(
            redGPUContext,
            'POST_EFFECT_INVERT',
            computeCode
        )
    }
}

Object.freeze(Invert)
export default Invert
