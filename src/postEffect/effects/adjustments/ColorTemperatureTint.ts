import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createPostEffectCode from "../../core/createPostEffectCode";

class ColorTemperatureTint extends ASinglePassPostEffect {
	#temperature: number = 6500      // 1000 ~ 20000 (Kelvin)
	#tint: number = 0               // -100 ~ 100 (Green/Magenta)
	#strength: number = 100         // 0 ~ 100 (효과 강도)
	constructor(redGPUContext: RedGPUContext) {
		super();
		const computeCode = createPostEffectCode(
			this,
			`
                let index = vec2<u32>(global_id.xy);
                let dimensions: vec2<u32> = textureDimensions(sourceTexture);
                let dimW = f32(dimensions.x);
                let dimH = f32(dimensions.y);
                let uv = vec2<f32>(f32(index.x)/dimW, f32(index.y)/dimH);
                var color: vec4<f32> = textureLoad(sourceTexture, index);
                
                
                let temp = uniforms.temperature;
                var tempRGB: vec3<f32>;
                
             
                if (temp <= 6600.0) {
                    tempRGB.r = 1.0;
                } else {
                    let t = temp - 6600.0;
                    tempRGB.r = clamp(1.292936 * pow(t, -0.1332047), 0.0, 1.0);
                }
                
               
                if (temp <= 6600.0) {
                    let t = temp;
                    tempRGB.g = clamp(0.39008157 * log(t) - 0.63184144, 0.0, 1.0);
                } else {
                    let t = temp - 6600.0;
                    tempRGB.g = clamp(1.292936 * pow(t, -0.1332047), 0.0, 1.0);
                }
                
               
                if (temp >= 6600.0) {
                    tempRGB.b = 1.0;
                } else if (temp <= 1900.0) {
                    tempRGB.b = 0.0;
                } else {
                    let t = temp - 1000.0;
                    tempRGB.b = clamp(0.543206789 * log(t) - 1.19625408, 0.0, 1.0);
                }
                
              
                let neutralTemp: vec3<f32> = vec3<f32>(1.0, 1.0, 1.0);
                let tempAdjust: vec3<f32> = tempRGB / neutralTemp;
                
               
                let tintValue = uniforms.tint * 0.01;
                var tintRGB: vec3<f32>;
                if (tintValue >= 0.0) {
                   
                    tintRGB = vec3<f32>(1.0 - tintValue * 0.2, 1.0, 1.0 - tintValue * 0.2);
                } else {
                  
                    let mag = -tintValue;
                    tintRGB = vec3<f32>(1.0, 1.0 - mag * 0.2, 1.0);
                }
                
                let colorAdjust = tempAdjust * tintRGB;
                
                let strength = uniforms.strength * 0.01; 
                let finalAdjust = mix(vec3<f32>(1.0, 1.0, 1.0), colorAdjust, strength);
                
                color = vec4<f32>(color.rgb * finalAdjust, color.a);
                
                color = vec4<f32>(clamp(color.rgb, vec3<f32>(0.0), vec3<f32>(1.0)), color.a);
                
                textureStore(outputTexture, index, color);
            `,
			`
                struct Uniforms {
                    temperature: f32,
                    tint: f32,
                    strength: f32
                };
            `
		)
		this.init(
			redGPUContext,
			'POST_EFFECT_COLOR_TEMPERATURE_TINT',
			computeCode
		)
		this.strength = this.#strength
		this.tint = this.#tint
		this.temperature = this.#temperature
	}

	get temperature(): number {
		return this.#temperature;
	}

	set temperature(value: number) {
		validateNumberRange(value, 1000, 20000)
		this.#temperature = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.temperature, value)
	}

	get tint(): number {
		return this.#tint;
	}

	set tint(value: number) {
		validateNumberRange(value, -100, 100)
		this.#tint = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.tint, value)
	}

	get strength(): number {
		return this.#strength;
	}

	set strength(value: number) {
		validateNumberRange(value, 0, 100)
		this.#strength = value;
		this.uniformBuffer.writeBuffer(this.uniformInfo.members.strength, value)
	}

	// 편의 메서드들
	setWarmTone() {
		this.temperature = 3200;
		this.tint = -10;
	}

	setCoolTone() {
		this.temperature = 8000;
		this.tint = 10;
	}

	setNeutral() {
		this.temperature = 6500;
		this.tint = 0;
	}

	setCandleLight() {
		this.temperature = 1900;
		this.tint = -5;
	}

	setDaylight() {
		this.temperature = 5600;
		this.tint = 0;
	}

	setCloudyDay() {
		this.temperature = 7500;
		this.tint = 5;
	}

	setNeonLight() {
		this.temperature = 9000;
		this.tint = 15;
	}
}

Object.freeze(ColorTemperatureTint)
export default ColorTemperatureTint
