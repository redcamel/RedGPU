import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../core/ASinglePassPostEffect";

/**
 * [KO] 올드 블룸 블렌딩 이펙트입니다.
 * [EN] Old Bloom blending effect.
 * @category PostEffect
 */
class OldBloomBlend extends ASinglePassPostEffect {
    #bloomStrength: number = 1
    #exposure: number = 1

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = this
        const computeCode =
            `
				struct Uniforms {
					bloomStrength:f32,
					exposure:f32
				};
				@group(0) @binding(0) var sourceTexture0 : texture_storage_2d<rgba16float,read>;
				@group(0) @binding(1) var sourceTexture1 : texture_storage_2d<rgba16float,read>;
				@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;
				@group(1) @binding(1) var<uniform> uniforms: Uniforms;
				@compute @workgroup_size(${WORK_SIZE_X},${WORK_SIZE_Y},${WORK_SIZE_Z})
				fn main (
				  @builtin(global_invocation_id) global_id : vec3<u32>,
				){
						let index = vec2<u32>(global_id.xy );
						let dimensions: vec2<u32> = textureDimensions(sourceTexture0);
						let dimW = f32(dimensions.x);
						let dimH = f32(dimensions.y);
						let uv = 	vec2<f32>(f32(index.x)/dimW,f32(index.y)/dimH);
						var diffuse:vec4<f32> = textureLoad(
							sourceTexture0,
							index,
						);
					  var blur:vec4<f32> = textureLoad(
							sourceTexture1,
							index,
						);
						
						let finalColor = vec4<f32>((diffuse.rgb  + blur.rgb * uniforms.bloomStrength ) * uniforms.exposure ,diffuse.a);
						textureStore(outputTexture, index, finalColor );
				};
			`
        this.init(
            redGPUContext,
            'POST_EFFECT_OLD_BLOOM',
            {
                msaa: computeCode,
                nonMsaa: computeCode
            },
        )
        this.exposure = this.#exposure
        this.bloomStrength = this.#bloomStrength
    }

    /**
     * [KO] 블룸 강도
     * [EN] Bloom strength
     */
    get bloomStrength(): number {
        return this.#bloomStrength;
    }

    set bloomStrength(value: number) {
        this.#bloomStrength = value;
        this.updateUniform('bloomStrength', value)
    }

    /**
     * [KO] 노출
     * [EN] Exposure
     */
    get exposure(): number {
        return this.#exposure;
    }

    set exposure(value: number) {
        this.#exposure = value;
        this.updateUniform('exposure', value)
    }

    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult, sourceTextureInfo1: ASinglePassPostEffectResult) {
        return super.render(view, width, height, sourceTextureInfo, sourceTextureInfo1)
    }
}

Object.freeze(OldBloomBlend)
export default OldBloomBlend