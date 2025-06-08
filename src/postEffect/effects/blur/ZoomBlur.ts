import RedGPUContext from "../../../context/RedGPUContext";
import validateNumber from "../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";

class ZoomBlur extends ASinglePassPostEffect {
	#amount: number = 128
	#centerX: number = 0
	#centerY: number = 0

	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const computeCode = `
        let dimensions = textureDimensions(sourceTexture);
        let dimW = f32(dimensions.x);
        let dimH = f32(dimensions.y);
        let dimensionsVec = vec2<f32>(dimW, dimH);
        
        let amount = uniforms.amount / min(dimW, dimH);
        
        const loopSize = 30.0;
        let offset = random(global_id, 0.0);
        
        let center = vec2<f32>(dimW * 0.5 + uniforms.centerX, dimH * 0.5 + uniforms.centerY);
        let global_id_vec = vec2<f32>(f32(global_id.x), f32(global_id.y));
        let dir = (center - global_id_vec) * amount;
        
        var sum = vec4<f32>(0.0, 0.0, 0.0, 0.0);
        var total = 0.0;
        
        for (var t = -loopSize; t <= loopSize; t = t + 1.0) {
            var percent = 1.0 - (t + offset - 0.5) / loopSize;
            var weight = 3.0 * (percent - percent * percent);
            let deltaPercent = dir * percent;
        
            let delta = vec2<i32>(
                i32(clamp(global_id_vec.x + deltaPercent.x, 0.0, dimW - 1.0)),
                i32(clamp(global_id_vec.y + deltaPercent.y, 0.0, dimH - 1.0))
            );
        
            sum += textureLoad(sourceTexture, delta).xyzw * weight;
            total += weight;
        }
        
        textureStore(outputTexture, vec2<i32>(global_id.xy), sum / total);
    `
		const uniformStructCode = `
        struct Uniforms {
            amount: f32,
            centerX:f32,
            centerY:f32
        };
        fn random(id: vec3<u32>, delta: f32) -> f32 {
            let seed: u32 = ((id.x << 16) | (id.y & 0xFFFF)) ^ (id.z * 0x63641362);
            let t: vec3<f32> = vec3<f32>(f32(seed & 0xFF), f32((seed >> 8) & 0xFF), f32(seed >> 16));
            return delta + fract(sin(dot(t, vec3<f32>(12.9898, 78.233, 12.9898))) * 43758.5453);
        }
    `
		this.init(
			redGPUContext,
			'POST_EFFECT_ZOOM_BLUR',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.amount = this.#amount
	}

	get centerX(): number {
		return this.#centerX;
	}

	set centerX(value: number) {
		validateNumber(value)
		this.#centerX = value;
		this.updateUniform('centerX', value)
	}

	get centerY(): number {
		return this.#centerY;
	}

	set centerY(value: number) {
		validateNumber(value)
		this.#centerY = value;
		this.updateUniform('centerY', value)
	}

	get amount(): number {
		return this.#amount;
	}

	set amount(value: number) {
		validateNumberRange(value, 0)
		this.#amount = value;
		this.updateUniform('amount', value)
	}
}

Object.freeze(ZoomBlur)
export default ZoomBlur
