import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";

class Vibrance extends ASinglePassPostEffect {
	#vibrance: number = 0      // -100 ~ 100
	#saturation: number = 0    // -100 ~ 100
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const computeCode = `
	    let index = vec2<u32>(global_id.xy);
	    let dimensions: vec2<u32> = textureDimensions(sourceTexture);
	    let dimW = f32(dimensions.x);
	    let dimH = f32(dimensions.y);
	    let uv = vec2<f32>(f32(index.x)/dimW, f32(index.y)/dimH);
	    var color: vec4<f32> = textureLoad(sourceTexture, index);
	    
	    let originalColor = color;
	    let luminance = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
	    
	    if (uniforms.saturation != 0.0) {
	        let saturationFactor = 1.0 + uniforms.saturation * 0.01;
	        color = vec4<f32>(
	            mix(luminance, color.r, saturationFactor),
	            mix(luminance, color.g, saturationFactor),
	            mix(luminance, color.b, saturationFactor),
	            color.a
	        );
	    }
	   
	    if (uniforms.vibrance != 0.0) {
	       
	        let maxComponent = max(max(color.r, color.g), color.b);
	        let minComponent = min(min(color.r, color.g), color.b);
	        let currentSaturation = maxComponent - minComponent;
	        
	       
	        let protectionFactor = 1.0 / (1.0 + exp(6.0 * (currentSaturation - 0.6)));
	        
	        
	        var skinToneProtection = 1.0;
	        if (color.r > color.g && color.g > color.b) {
	            let skinToneAmount = (color.r - color.b) / max(color.r, 0.001);
	            skinToneProtection = 1.0 - smoothstep(0.3, 0.8, skinToneAmount) * 0.7;
	        }
	        
	       
	        let finalProtection = protectionFactor * skinToneProtection;
	        
	        
	        let vibranceStrength = uniforms.vibrance * 0.01 * finalProtection;
	        let vibranceFactor = 1.0 + vibranceStrength;
	        
	       
	        color = vec4<f32>(
	            mix(luminance, color.r, vibranceFactor),
	            mix(luminance, color.g, vibranceFactor),
	            mix(luminance, color.b, vibranceFactor),
	            color.a
	        );
	    }
	    
	  
	    color = clamp(color, vec4<f32>(0.0), vec4<f32>(1.0));
	    
	    textureStore(outputTexture, index, color);
    `
		const uniformStructCode = `
	    struct Uniforms {
	        vibrance: f32,
	        saturation: f32
	    };
    `
		this.init(
			redGPUContext,
			'POST_EFFECT_VIBRANCE',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}

	get vibrance(): number {
		return this.#vibrance;
	}

	set vibrance(value: number) {
		validateNumberRange(value, -100, 100)
		this.#vibrance = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.vibrance, value)
	}

	get saturation(): number {
		return this.#saturation;
	}

	set saturation(value: number) {
		validateNumberRange(value, -100, 100)
		this.#saturation = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.saturation, value)
	}
}

Object.freeze(Vibrance)
export default Vibrance
