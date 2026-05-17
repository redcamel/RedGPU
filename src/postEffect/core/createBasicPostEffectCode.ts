import ShaderLibrary from "../../systemCodeManager/ShaderLibrary";

import ASinglePassPostEffect from "./ASinglePassPostEffect";

const createCode = (effect: ASinglePassPostEffect, code: string, uniformStruct: string = '', useMSAA: boolean = false, sourceTextureNames: string | string[] = 'sourceTexture') => {
    const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = effect;
    const depthTextureType = useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d';

    let sourceTextures = '';
    const names = Array.isArray(sourceTextureNames) ? sourceTextureNames : [sourceTextureNames];
    names.forEach((name, i) => {
        sourceTextures += `@group(0) @binding(${i}) var ${name} : texture_storage_2d<rgba16float, read>;\n`;
    });

    return `
        ${uniformStruct}
        ${sourceTextures}
        ${ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM}
        @group(1) @binding(1) var basicSampler : sampler;
        ${uniformStruct ? '@group(1) @binding(2) var<uniform> uniforms: Uniforms;' : ''}
        ${effect.useDepthTexture ? `@group(2) @binding(0) var depthTexture : ${depthTextureType};` : ''}
        ${effect.useGBufferNormalTexture ? `@group(2) @binding(1) var gBufferNormalTexture : texture_2d<f32>;` : ''}
        ${effect.useMotionVectorTexture ? `@group(2) @binding(2) var motionVectorTexture : texture_2d<f32>;` : ''}
        
        @group(3) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;
        
        @compute @workgroup_size(${WORK_SIZE_X}, ${WORK_SIZE_Y}, ${WORK_SIZE_Z})
        fn main(
          @builtin(global_invocation_id) global_id : vec3<u32>,
        ) {
          ${code}
        }
  `;
};

/**
 * [KO] 기본 후처리 이펙트 WGSL 코드를 생성하는 헬퍼 함수입니다.
 * [EN] Helper function to create basic post-effect WGSL code.
 *
 * [KO] MSAA/Non-MSAA, 유니폼 구조, 딥스 텍스처 등 옵션에 따라 WGSL 코드를 자동 생성합니다.
 * [EN] Automatically generates WGSL code based on options such as MSAA/Non-MSAA, uniform structure, depth texture, etc.
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
 * @param sourceTextureNames
 * [KO] 사용할 소스 텍스처 이름 또는 이름 리스트 (기본값: 'sourceTexture')
 * [EN] Source texture name or list of names to use (default: 'sourceTexture')
 * @returns
 * [KO] { msaa: string, nonMsaa: string } - MSAA/Non-MSAA용 WGSL 코드
 * [EN] { msaa: string, nonMsaa: string } - WGSL code for MSAA/Non-MSAA
 *
 * * ### Example
 * ```typescript
 * const shader = createBasicPostEffectCode(effect, '...main code...', 'struct Uniforms {...};');
 * // shader.msaa, shader.nonMsaa 사용
 * ```
 */
const createBasicPostEffectCode = (effect: ASinglePassPostEffect, code: string, uniformStruct: string = '', sourceTextureNames: string | string[] = 'sourceTexture') => {
    return {
        msaa: createCode(effect, code, uniformStruct, true, sourceTextureNames),
        nonMsaa: createCode(effect, code, uniformStruct, false, sourceTextureNames)
    }
}
Object.freeze(createBasicPostEffectCode)
export default createBasicPostEffectCode
