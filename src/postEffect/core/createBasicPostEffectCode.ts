import postEffectSystemUniform from "../core/postEffectSystemUniform.wgsl"
import ASinglePassPostEffect from "./ASinglePassPostEffect";

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
          ${code}
      }
  `
}
/**
 * 기본 후처리 이펙트 WGSL 코드를 생성하는 헬퍼 함수입니다.
 *
 * - MSAA/Non-MSAA, 유니폼 구조, 딥스 텍스처 등 옵션에 따라 WGSL 코드를 자동 생성합니다.
 * - 내부적으로 시스템 유니폼, 소스/출력 텍스처, 워크그룹 크기 등을 자동으로 포함합니다.
 *
 * @category Core
 *
 * @param effect ASinglePassPostEffect 인스턴스
 * @param code WGSL 메인 코드 (main 함수 내부)
 * @param uniformStruct 유니폼 구조 WGSL 코드 (선택)
 * @returns { msaa: string, nonMsaa: string } - MSAA/Non-MSAA용 WGSL 코드
 *
 * @example
 * const shader = createBasicPostEffectCode(effect, '...main code...', 'struct Uniforms {...};');
 * // shader.msaa, shader.nonMsaa 사용
 */
const createBasicPostEffectCode = (effect: ASinglePassPostEffect, code: string, uniformStruct: string = '') => {
	return {
		msaa: createCode(effect, code, uniformStruct, true),
		nonMsaa: createCode(effect, code, uniformStruct, false)
	}
}
Object.freeze(createBasicPostEffectCode)

export default createBasicPostEffectCode
