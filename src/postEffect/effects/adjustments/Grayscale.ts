import RedGPUContext from "../../../context/RedGPUContext";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";

class Grayscale extends ASinglePassPostEffect {
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const computeCode = `
        let index = vec2<u32>(global_id.xy );
        let dimensions: vec2<u32> = textureDimensions(sourceTexture);
        let dimW = f32(dimensions.x);
        let dimH = f32(dimensions.y);
        let uv = 	vec2<f32>(f32(index.x)/dimW,f32(index.y)/dimH);
        var color:vec4<f32> = textureLoad( sourceTexture, index, );
        let gray = (color.r  + color.g + color.b)/3.0;
        /* 주석테스트 */
        textureStore(outputTexture, index, vec4<f32>( gray, gray, gray, 1.0) );
    `
		const uniformStructCode = ''
		this.init(
			redGPUContext,
			'POST_EFFECT_GRAYSCALE',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}
}

Object.freeze(Grayscale)
export default Grayscale
