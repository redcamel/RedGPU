import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";

class ColorBalance extends ASinglePassPostEffect {
	#shadowCyanRed: number = 0      // -100 ~ 100
	#shadowMagentaGreen: number = 0 // -100 ~ 100
	#shadowYellowBlue: number = 0   // -100 ~ 100
	#midtoneCyanRed: number = 0
	#midtoneMagentaGreen: number = 0
	#midtoneYellowBlue: number = 0
	#highlightCyanRed: number = 0
	#highlightMagentaGreen: number = 0
	#highlightYellowBlue: number = 0
	#preserveLuminosity: boolean = true // 밝기 보존 옵션
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const computeCode = `
        let index = vec2<u32>(global_id.xy );
        let dimensions: vec2<u32> = textureDimensions(sourceTexture);
        let dimW = f32(dimensions.x);
        let dimH = f32(dimensions.y);
        let uv = 	vec2<f32>(f32(index.x)/dimW,f32(index.y)/dimH);
        var color:vec4<f32> = textureLoad( sourceTexture, index, );
							
        let original_luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
        
        let shadow_weight = 1.0 - smoothstep(0.0, 0.5, original_luminance);
        let highlight_weight = smoothstep(0.5, 1.0, original_luminance);  
        let midtone_weight = 1.0 - shadow_weight - highlight_weight;
        
        let cyan_red = shadow_weight * uniforms.shadowCyanRed + 
        midtone_weight * uniforms.midtoneCyanRed + 
        highlight_weight * uniforms.highlightCyanRed;
        
        let magenta_green = shadow_weight * uniforms.shadowMagentaGreen + 
        midtone_weight * uniforms.midtoneMagentaGreen + 
        highlight_weight * uniforms.highlightMagentaGreen;
        
        let yellow_blue = shadow_weight * uniforms.shadowYellowBlue + 
        midtone_weight * uniforms.midtoneYellowBlue + 
        highlight_weight * uniforms.highlightYellowBlue;
        
        color.r += cyan_red * 0.01;      
        color.g += magenta_green * 0.01; 
        color.b += yellow_blue * 0.01;   
        
        let adjusted_luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
        if (uniforms.preserveLuminosity == 1 && adjusted_luminance > 0.0) {
            let ratio = original_luminance / adjusted_luminance;
            color = color * ratio;
        }
          
        textureStore(outputTexture, index, color );
			`
		const uniformStructCode = `
        struct Uniforms {
            shadowCyanRed:f32,
            shadowMagentaGreen:f32,
            shadowYellowBlue:f32,
            
            midtoneCyanRed:f32,
            midtoneMagentaGreen:f32,
            midtoneYellowBlue:f32,
            
            highlightCyanRed:f32,
            highlightMagentaGreen:f32,
            highlightYellowBlue:f32,
            
            preserveLuminosity:u32
        };
    `
		this.init(
			redGPUContext,
			'POST_EFFECT_COLOR_BALANCE',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
	}

	get shadowCyanRed(): number {
		return this.#shadowCyanRed;
	}

	set shadowCyanRed(value: number) {
		validateNumberRange(value, -100, 100)
		this.#shadowCyanRed = value;
		this.updateUniform('shadowCyanRed', value)
	}

	get shadowMagentaGreen(): number {
		return this.#shadowMagentaGreen;
	}

	set shadowMagentaGreen(value: number) {
		validateNumberRange(value, -100, 100)
		this.#shadowMagentaGreen = value;
		this.updateUniform('shadowMagentaGreen', value)
	}

	get shadowYellowBlue(): number {
		return this.#shadowYellowBlue;
	}

	set shadowYellowBlue(value: number) {
		validateNumberRange(value, -100, 100)
		this.#shadowYellowBlue = value;
		this.updateUniform('shadowYellowBlue', value)
	}

	get midtoneCyanRed(): number {
		return this.#midtoneCyanRed;
	}

	set midtoneCyanRed(value: number) {
		validateNumberRange(value, -100, 100)
		this.#midtoneCyanRed = value;
		this.updateUniform('midtoneCyanRed', value)
	}

	get midtoneMagentaGreen(): number {
		return this.#midtoneMagentaGreen;
	}

	set midtoneMagentaGreen(value: number) {
		validateNumberRange(value, -100, 100)
		this.#midtoneMagentaGreen = value;
		this.updateUniform('midtoneMagentaGreen', value)
	}

	get midtoneYellowBlue(): number {
		return this.#midtoneYellowBlue;
	}

	set midtoneYellowBlue(value: number) {
		validateNumberRange(value, -100, 100)
		this.#midtoneYellowBlue = value;
		this.updateUniform('midtoneYellowBlue', value)
	}

	get highlightCyanRed(): number {
		return this.#highlightCyanRed;
	}

	set highlightCyanRed(value: number) {
		validateNumberRange(value, -100, 100)
		this.#highlightCyanRed = value;
		this.updateUniform('highlightCyanRed', value)
	}

	get highlightMagentaGreen(): number {
		return this.#highlightMagentaGreen;
	}

	set highlightMagentaGreen(value: number) {
		validateNumberRange(value, -100, 100)
		this.#highlightMagentaGreen = value;
		this.updateUniform('highlightMagentaGreen', value)
	}

	get highlightYellowBlue(): number {
		return this.#highlightYellowBlue;
	}

	set highlightYellowBlue(value: number) {
		validateNumberRange(value, -100, 100)
		this.#highlightYellowBlue = value;
		this.updateUniform('highlightYellowBlue', value)
	}

	get preserveLuminosity(): boolean {
		return this.#preserveLuminosity;
	}

	set preserveLuminosity(value: boolean) {
		this.#preserveLuminosity = value;
		this.updateUniform('preserveLuminosity', value)
	}
}

Object.freeze(ColorBalance)
export default ColorBalance
