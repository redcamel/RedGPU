import RedGPUContext from "../../../context/RedGPUContext";
import validateNumber from "../../../runtimeChecker/validateFunc/validateNumber";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createBasicPostEffectCode from "../../core/createBasicPostEffectCode";

class DirectionalBlur extends ASinglePassPostEffect {
	#amount: number = 15
	#angle: number = 0  // 0도 = 오른쪽 (포토샵 기본값)
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const computeCode = `
        let dimensions = textureDimensions(sourceTexture);
        let dimW = f32(dimensions.x);
        let dimH = f32(dimensions.y);
        
        let direction = vec2<f32>(uniforms.directionX, uniforms.directionY);
        let dirLength = length(direction);
        let normalizedDir = select(vec2<f32>(0.0), direction / dirLength, dirLength > 0.0);
        
        let dir = normalizedDir * uniforms.amount;
        
        const loopSize = 30.0;
        let offset = random(global_id, 0.0);
        
        let global_id_vec = vec2<f32>(f32(global_id.x), f32(global_id.y));
        
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
	        directionX: f32,
	        directionY: f32
	    };
	    fn random(id: vec3<u32>, delta: f32) -> f32 {
	        let seed: u32 = ((id.x << 16) | (id.y & 0xFFFF)) ^ (id.z * 0x63641362);
	        let t: vec3<f32> = vec3<f32>(f32(seed & 0xFF), f32((seed >> 8) & 0xFF), f32(seed >> 16));
	        return delta + fract(sin(dot(t, vec3<f32>(12.9898, 78.233, 12.9898))) * 43758.5453);
	    }
    `
		this.init(
			redGPUContext,
			'POST_EFFECT_DIRECTIONAL_BLUR',
			createBasicPostEffectCode(this, computeCode, uniformStructCode)
		)
		this.amount = this.#amount
		this.angle = this.#angle
	}

	get angle(): number {
		return this.#angle;
	}

	set angle(value: number) {
		validateNumber(value)
		this.#angle = value % 360; // 360도로 정규화
		this.#updateDirection();
	}

	get amount(): number {
		return this.#amount;
	}

	set amount(value: number) {
		validateNumberRange(value, 0)
		this.#amount = value;
		this.updateUniform('amount', value)
	}

	// 내부 메서드: 각도를 방향 벡터로 변환
	#updateDirection() {
		const radians = this.#angle * Math.PI / 180;
		const directionX = Math.cos(radians);
		const directionY = Math.sin(radians);
		this.updateUniform('directionX', directionX)
		this.updateUniform('directionY', directionY)
	}
}

Object.freeze(DirectionalBlur)
export default DirectionalBlur
