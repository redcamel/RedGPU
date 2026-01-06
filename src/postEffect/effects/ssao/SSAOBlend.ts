import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../core/ASinglePassPostEffect";

class SSAOBlend extends ASinglePassPostEffect {
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = this
		const computeCode =
			`

				@group(0) @binding(0) var sourceTexture0 : texture_storage_2d<rgba8unorm,read>;
				@group(0) @binding(1) var sourceTexture1 : texture_storage_2d<rgba8unorm,read>;
				@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba8unorm, write>;

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
						
						let finalColor = vec4<f32>((diffuse.rgb  * blur.rgb  )  ,diffuse.a);
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
	}

	render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult, sourceTextureInfo1: ASinglePassPostEffectResult) {
		return super.render(view, width, height, sourceTextureInfo, sourceTextureInfo1)
	}
}

Object.freeze(SSAOBlend)
export default SSAOBlend
