import postEffectSystemUniform from "../core/postEffectSystemUniform.wgsl"
import ASinglePassPostEffect from "./ASinglePassPostEffect";

const createCode = (effect: ASinglePassPostEffect, code: string, uniformStruct: string = '', useMSAA: boolean = false,) => {
    const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = effect
    const depthTextureType = useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d';
    return `

			${uniformStruct}
      @group(0) @binding(0) var sourceTexture : texture_storage_2d<rgba16float,read>;
      ${effect.useDepthTexture ? `@group(0) @binding(1) var depthTexture : ${depthTextureType}` : ''};
      ${effect.useGBufferNormalTexture ? `@group(0) @binding(${effect.useDepthTexture ? 2 : 1}) var gBufferNormalTexture : texture_2d<f32>` : ''};
      @group(1) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;
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
 * [KO] 기본 후처리 이펙트 WGSL 코드를 생성하는 헬퍼 함수입니다.
 * [EN] Helper function that generates basic post-processing effect WGSL code.
 *
 * [KO] MSAA/Non-MSAA, 유니폼 구조, 딥스 텍스처 등 옵션에 따라 WGSL 코드를 자동 생성합니다.
 * [EN] Automatically generates WGSL code based on options such as MSAA/Non-MSAA, uniform structure, and depth texture.
 *
 * [KO] 내부적으로 시스템 유니폼, 소스/출력 텍스처, 워크그룹 크기 등을 자동으로 포함합니다.
 * [EN] Internally automatically includes system uniforms, source/output textures, workgroup sizes, etc.
 *
 * @param effect 
 * [KO] ASinglePassPostEffect 인스턴스
 * [EN] ASinglePassPostEffect instance
 * @param code 
 * [KO] WGSL 메인 코드 (main 함수 내부)
 * [EN] WGSL main code (inside main function)
 * @param uniformStruct 
 * [KO] 유니폼 구조 WGSL 코드 (선택)
 * [EN] Uniform structure WGSL code (optional)
 * @returns 
 * [KO] { msaa: string, nonMsaa: string } - MSAA/Non-MSAA용 WGSL 코드
 * [EN] { msaa: string, nonMsaa: string } - WGSL code for MSAA/Non-MSAA
 *
 * @example
 * ```typescript
 * const shader = createBasicPostEffectCode(effect, '...main code...', 'struct Uniforms {...};');
 * // shader.msaa, shader.nonMsaa 사용
 * ```
 */
const createBasicPostEffectCode = (effect: ASinglePassPostEffect, code: string, uniformStruct: string = '') => {
    return {
        msaa: createCode(effect, code, uniformStruct, true),
        nonMsaa: createCode(effect, code, uniformStruct, false)
    }
}
Object.freeze(createBasicPostEffectCode)
export default createBasicPostEffectCode