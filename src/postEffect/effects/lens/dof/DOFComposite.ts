import RedGPUContext from "../../../../context/RedGPUContext";
import View3D from "../../../../display/view/View3D";
import ASinglePassPostEffect from "../../../core/ASinglePassPostEffect";

class DOFComposite extends ASinglePassPostEffect {
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext);
		const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = this
		const computeCode = `
			@group(0) @binding(0) var sourceTexture0 : texture_storage_2d<rgba8unorm,read>; 
			@group(0) @binding(1) var sourceTexture1 : texture_storage_2d<rgba8unorm,read>;
			@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba8unorm, write>;
			@compute @workgroup_size(${WORK_SIZE_X},${WORK_SIZE_Y},${WORK_SIZE_Z})
			fn main (
			  @builtin(global_invocation_id) global_id : vec3<u32>,
			){
				let index = vec2<u32>(global_id.xy);
				
				let blendedColor = textureLoad(sourceTexture0, index);
				let cocValue = textureLoad(sourceTexture1, index).a;
				
				textureStore(outputTexture, index, vec4<f32>(blendedColor.rgb, blendedColor.a));
			};
		`

		this.init(
			redGPUContext,
			'POST_EFFECT_DOF_COMPOSITE',
			{
				msaa: computeCode,
				nonMsaa: computeCode
			}
		)
	}

	render(view: View3D, width: number, height: number, blendedTextureView: GPUTextureView, cocTextureView: GPUTextureView) {
		return super.render(view, width, height, blendedTextureView, cocTextureView)
	}
}

Object.freeze(DOFComposite)
export default DOFComposite
