import ShaderLibrary from "../../systemCodeManager/ShaderLibrary";

import ASinglePassPostEffect from "./ASinglePassPostEffect";

/**
 * [KO] 후처리 소스 텍스처 설정 인터페이스
 * [EN] Post-effect source texture configuration interface
 */
export type PostEffectSourceTexture = {
    /** [KO] 텍스처 이름 [EN] Texture name */
    name: string;
    /** [KO] 샘플링 가능한 타입(texture_2d)으로 사용할지 여부 [EN] Whether to use as a sampleable type (texture_2d) */
    isSampled?: boolean;
}

const createCode = (
    effect: ASinglePassPostEffect,
    code: string,
    uniformStruct: string = '',
    useMSAA: boolean = false,
    sourceTextureConfigs: string | (string | PostEffectSourceTexture)[] = 'sourceTexture'
) => {
    const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = effect;
    const depthTextureType = useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d';

    let sourceTextures = '';
    const items = Array.isArray(sourceTextureConfigs) ? sourceTextureConfigs : [sourceTextureConfigs];
    items.forEach((item, i) => {
        let name: string;
        let isSampled: boolean = false;

        if (typeof item === 'string') {
            name = item;
        } else {
            name = item.name;
            if (item.isSampled !== undefined) isSampled = item.isSampled;
        }

        if (isSampled) {
            sourceTextures += `@group(0) @binding(${i}) var ${name} : texture_2d<f32>;\n`;
        } else {
            sourceTextures += `@group(0) @binding(${i}) var ${name} : texture_storage_2d<rgba16float, read>;\n`;
        }
    });

    return `
${uniformStruct}

${sourceTextures}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

${ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM}
@group(2) @binding(5) var basicSampler : sampler;

@group(2) @binding(0) var depthTexture : ${depthTextureType};
@group(2) @binding(1) var gBufferNormalTexture : texture_2d<f32>;
@group(2) @binding(2) var motionVectorTexture : texture_2d<f32>;
@group(2) @binding(3) var prevDepthTexture : texture_depth_2d;

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
 * @param sourceTextureConfigs
 * [KO] 사용할 소스 텍스처 이름 또는 설정 리스트 (기본값: 'sourceTexture')
 * [EN] Source texture name or configuration list to use (default: 'sourceTexture')
 * @returns
 * [KO] { msaa: string, nonMsaa: string } - MSAA/Non-MSAA용 WGSL 코드
 * [EN] { msaa: string, nonMsaa: string } - WGSL code for MSAA/Non-MSAA
 */
const createBasicPostEffectCode = (
    effect: ASinglePassPostEffect,
    code: string,
    uniformStruct: string = '',
    sourceTextureConfigs: string | (string | PostEffectSourceTexture)[] = 'sourceTexture'
) => {
    return {
        msaa: createCode(effect, code, uniformStruct, true, sourceTextureConfigs),
        nonMsaa: createCode(effect, code, uniformStruct, false, sourceTextureConfigs)
    }
}
Object.freeze(createBasicPostEffectCode)
export default createBasicPostEffectCode
