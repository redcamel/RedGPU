import ShaderLibrary from "../../systemCodeManager/ShaderLibrary";
import ASinglePassPostEffect from "./ASinglePassPostEffect";
import {IPostEffectSourceConfig} from "./types";

const createCode = (
    effect: ASinglePassPostEffect,
    code: string,
    uniformStruct: string = '',
    useMSAA: boolean = false,
    sourceTextureConfigs: IPostEffectSourceConfig | IPostEffectSourceConfig[] = {name: 'sourceTexture'},
    earlyExit: boolean = true
) => {
    const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z, isLdr} = effect;
    const outputFormat = isLdr ? 'rgba8unorm' : 'rgba16float';
    const postEffectSystemUniform = useMSAA ? ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM_MSAA : ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM;

    let sourceTextures = '';
    const items = Array.isArray(sourceTextureConfigs) ? sourceTextureConfigs : [sourceTextureConfigs];
    items.forEach((item, i) => {
        let name: string;
        let isSampled: boolean = true;

        name = item.name;
        if (item.isSampled !== undefined) isSampled = item.isSampled;

        if (isSampled) {
            sourceTextures += `@group(0) @binding(${i}) var ${name} : texture_2d<f32>;\n`;
        } else {
            sourceTextures += `@group(0) @binding(${i}) var ${name} : texture_storage_2d<rgba16float, read>;\n`;
        }
    });

    const earlyExitCheck = earlyExit
        ? `let postEffectOutputDimensions = textureDimensions(outputTexture);
          if (global_id.x >= postEffectOutputDimensions.x || global_id.y >= postEffectOutputDimensions.y) {
              return;
          }`
        : ``;

    return `
        ${uniformStruct}
        
        ${sourceTextures}
        
        ${uniformStruct ? '@group(1) @binding(0) var<uniform> uniforms: Uniforms;' : ''}
        
        ${postEffectSystemUniform}
        
        @group(3) @binding(0) var outputTexture : texture_storage_2d<${outputFormat}, write>;
        
        @compute @workgroup_size(${WORK_SIZE_X}, ${WORK_SIZE_Y}, ${WORK_SIZE_Z})
        fn main(
          @builtin(global_invocation_id) global_id : vec3<u32>,
          @builtin(local_invocation_id) local_id : vec3<u32>,
          @builtin(local_invocation_index) local_invocation_index : u32,
          @builtin(workgroup_id) workgroup_id : vec3<u32>,
        ) {
          ${earlyExitCheck}
          ${code}
        }
  `;
};

/**
 * [KO] 단일 패스 후처리 이펙트용 MSAA/Non-MSAA WGSL 컴퓨트 셰이더 코드를 생성합니다.
 * [EN] Generates MSAA and Non-MSAA WGSL compute shader codes for a single-pass post-processing effect.
 *
 * [KO] 입력 소스 텍스처(Group 0), 이펙트 유니폼(Group 1), 시스템 공용 유니폼 및 G-Buffer(Group 2), 출력 스토리지 텍스처(Group 3) 바인딩과 화면 경계 검사(`earlyExit`)를 자동으로 구성합니다.
 * [EN] Automatically configures bindings for input source textures (Group 0), effect uniforms (Group 1), system uniforms and G-Buffer (Group 2), output storage texture (Group 3), and boundary early-exit checks (`earlyExit`).
 *
 * @param effect -
 * [KO] 대상 `ASinglePassPostEffect` 인스턴스
 * [EN] Target `ASinglePassPostEffect` instance
 * @param code -
 * [KO] `main` 함수 내부에 삽입할 WGSL 연산 코드
 * [EN] WGSL computation code to insert inside the `main` function
 * @param uniformStruct -
 * [KO] 이펙트 전용 `Uniforms` 구조체 정의 문자열
 * [EN] Effect-specific `Uniforms` struct definition string
 * @param sourceTextureConfigs -
 * [KO] 입력 소스 텍스처 바인딩 설정
 * [EN] Input source texture binding configuration
 * @param earlyExit -
 * [KO] 출력 해상도 경계 밖 스레드 즉시 종료 여부 (워크그룹 배리어 사용 시 `false`)
 * [EN] Whether to immediately terminate threads outside output resolution bounds (set `false` when using workgroup barriers)
 * @returns
 * [KO] MSAA 및 Non-MSAA용 WGSL 코드 객체 (`{ msaa: string, nonMsaa: string }`)
 * [EN] WGSL code object for MSAA and Non-MSAA (`{ msaa: string, nonMsaa: string }`)
 * @category PostEffect
 */
const createBasicPostEffectCode = (
    effect: ASinglePassPostEffect,
    code: string,
    uniformStruct: string = '',
    sourceTextureConfigs: IPostEffectSourceConfig | IPostEffectSourceConfig[] = {name: 'sourceTexture'},
    earlyExit: boolean = true
) => {
    return {
        msaa: createCode(effect, code, uniformStruct, true, sourceTextureConfigs, earlyExit),
        nonMsaa: createCode(effect, code, uniformStruct, false, sourceTextureConfigs, earlyExit)
    }
}
Object.freeze(createBasicPostEffectCode)
export default createBasicPostEffectCode
