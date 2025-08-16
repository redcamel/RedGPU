import postEffectSystemUniform from "../core/postEffectSystemUniform.wgsl"
import ASinglePassPostEffect from "./ASinglePassPostEffect";

const createCode = (effect: ASinglePassPostEffect, code: string, uniformStruct: string = '', useMSAA: boolean = false,) => {
	const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = effect
	const depthTextureType = useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d';
	return `

			${uniformStruct}
      @group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba8unorm,read>;
      ${effect.useDepthTexture ? `@group(0) @binding(1) var depthTexture : ${depthTextureType}` : ''};
      ${effect.useNormalRougnessTexture ? '@group(0) @binding(2) var gBufferNormalTexture : texture_2d<f32>' : ''};
      ${effect.useNormalRougnessTexture ? '@group(0) @binding(3) var gBufferMetalTexture : texture_2d<f32>' : ''};
	
      @group(1) @binding(0) var outputTexture : texture_storage_2d<rgba8unorm, write>;
      ${postEffectSystemUniform}
      ${uniformStruct ? '@group(1) @binding(2) var<uniform> uniforms: Uniforms;' : ''}
      @compute @workgroup_size(${WORK_SIZE_X},${WORK_SIZE_Y},${WORK_SIZE_Z})
      fn main ( 
        @builtin(global_invocation_id) global_id : vec3<u32>,
      ){
          ${code}
      }
  `
}
// 헬퍼 함수: MSAA와 Non-MSAA 코드를 모두 생성
const createBasicPostEffectCode = (effect: ASinglePassPostEffect, code: string, uniformStruct: string = '') => {
	return {
		msaa: createCode(effect, code, uniformStruct, true),
		nonMsaa: createCode(effect, code, uniformStruct, false)
	}
}
Object.freeze(createBasicPostEffectCode)
export default createBasicPostEffectCode
