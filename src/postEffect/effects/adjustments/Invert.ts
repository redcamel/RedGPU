import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";

class Invert extends ASinglePassPostEffect {
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const computeCode = `
        let index = vec2<u32>(global_id.xy );
        let dimensions: vec2<u32> = textureDimensions(sourceTexture);
        let dimW = f32(dimensions.x);
        let dimH = f32(dimensions.y);
        let uv = 	vec2<f32>(f32(index.x)/dimW,f32(index.y)/dimH);
        var color:vec4<f32> = textureLoad( sourceTexture, index, );
        color.r = 1.0 - color.r;
        color.g = 1.0 - color.g;
        color.b = 1.0 - color.b;
        
        textureStore(outputTexture, index, color );
    `
		const uniformStructCode = ''
		this.init(
			redGPUContext,
			'POST_EFFECT_INVERT',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}
}

Object.freeze(Invert)
export default Invert
