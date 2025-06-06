import RedGPUContext from "../../../context/RedGPUContext";
import validateNumberRange from "../../../runtimeChecker/validateFunc/validateNumberRange";
import ASinglePassPostEffect from "../../core/ASinglePassPostEffect";
import createPostEffectCode from "../../core/createPostEffectCode";

class BlurX extends ASinglePassPostEffect {
    #size: number = 32

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const computeCode = createPostEffectCode(
            this,
            `
						let index = vec2<u32>(global_id.xy);
						let dimensions = textureDimensions(sourceTexture);
						let dimW = f32(dimensions.x);
						let size_value: f32 = uniforms.size;
						var sum: vec4<f32> = vec4<f32>(0.0, 0.0, 0.0, 0.0);
						
						var offset = random(global_id, 0.0);
						var total = 0.0;
						let loopSize = 10.0;
						
						for (var t = -loopSize; t <= loopSize; t = t + 1.0) {
						    var percent = (t + offset - 0.5) / loopSize;
						    var weight = 1.0 - abs(percent);
						    var ix = clamp((f32(global_id.x) + f32(size_value * percent)), 0.0, dimW - 1.0);
						    let delta = vec2<i32>(i32(ix), i32(global_id.y));
						    sum += textureLoad(sourceTexture, delta).xyzw * weight;
						    total += weight;
						}
						
						sum /= total;
						
						textureStore(outputTexture, vec2<i32>(global_id.xy), sum);
			`,
            `
      struct Uniforms {
        size: f32,
			};
			fn random(id: vec3<u32>, delta: f32) -> f32 {
			    let seed: u32 = ((id.x << 16) | (id.y & 0xFFFF)) ^ (id.z * 0x63641362);
			    let t: vec3<f32> = vec3<f32>(f32(seed & 0xFF), f32((seed >> 8) & 0xFF), f32(seed >> 16));
			    return delta + fract(sin(dot(t, vec3<f32>(12.9898, 78.233, 12.9898))) * 43758.5453);
			}
			`
        )
        this.init(
            redGPUContext,
            'POST_EFFECT_BLUR_X',
            computeCode
        )
        this.size = this.#size
    }

    get size(): number {
        return this.#size;
    }

    set size(value: number) {
        validateNumberRange(value)
        this.#size = value;
        this.uniformBuffer.writeBuffer(this.uniformInfo.members.size, value)
    }
}

Object.freeze(BlurX)
export default BlurX
