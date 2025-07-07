import ASinglePassPostEffect from "./ASinglePassPostEffect";
import postEffectSystemUniform from "../core/postEffectSystemUniform.wgsl"
// 간단하고 정확한 주석 제거
const removeComments = (code: string): string => {
	// console.log('입력:', code);
	let result = code.replace(/\/\/[^\r\n]*(?=\S)/g, '\n').replace(/\/\/[^\r\n]*/g, '');
	// console.log('출력:', result);
	return result;
}
const createCode = (effect: ASinglePassPostEffect, code: string, uniformStruct: string = '', useMSAA: boolean = false,) => {
	const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = effect
	const depthTextureType = useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d';
	return `

			${uniformStruct}
      @group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba8unorm,read>;
      ${effect.useDepthTexture ? `@group(0) @binding(1) var depthTexture : ${depthTextureType}` : ''};
	
      @group(1) @binding(0) var outputTexture : texture_storage_2d<rgba8unorm, write>;
      ${postEffectSystemUniform}
      ${uniformStruct ? '@group(1) @binding(2) var<uniform> uniforms: Uniforms;' : ''}
      @compute @workgroup_size(${WORK_SIZE_X},${WORK_SIZE_Y},${WORK_SIZE_Z})
      fn main ( 
        @builtin(global_invocation_id) global_id : vec3<u32>,
      ){
          ${removeComments(code)}
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
