import ShaderLibrary from "../../systemCodeManager/ShaderLibrary";
import ASinglePassPostEffect from "./ASinglePassPostEffect";
import {IPostEffectSourceConfig} from "./types";

/**
 * [KO] 단일 패스 후처리 이펙트를 위한 최종 WGSL 코드를 조립합니다.
 * [EN] Assembles the final WGSL code for a single-pass post-processing effect.
 *
 * @param effect - [KO] 대상 이펙트 인스턴스 [EN] Target effect instance
 * @param code - [KO] 컴퓨트 셰이더 메인 로직 [EN] Compute shader main logic
 * @param uniformStruct - [KO] 유니폼 구조체 정의 [EN] Uniform structure definition
 * @param useMSAA - [KO] MSAA 사용 여부 [EN] Whether to use MSAA
 * @param sourceTextureConfigs - [KO] 입력 소스 텍스처 설정 [EN] Input source texture configurations
 * @returns [KO] 조립된 WGSL 코드 문자열 [EN] Assembled WGSL code string
 */
const createCode = (
    effect: ASinglePassPostEffect,
    code: string,
    uniformStruct: string = '',
    useMSAA: boolean = false,
    sourceTextureConfigs: IPostEffectSourceConfig | IPostEffectSourceConfig[] = {name: 'sourceTexture'},
    earlyExit: boolean = true
) => {
    const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = effect;
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
        
        @group(3) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;
        
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
 * [KO] 기본 후처리 이펙트용 WGSL 코드를 생성하는 고수준 헬퍼 함수입니다.
 * [EN] High-level helper function to generate WGSL code for basic post-processing effects.
 *
 * [KO] 이 함수는 반복적인 보일러플레이트 코드를 자동화하며 다음 기능을 수행합니다:
 * 1. MSAA/Non-MSAA 대응 소스 자동 분기 생성.
 * 2. 입력 소스 텍스처(Group 0) 바인딩 자동화.
 * 3. 이펙트 전용 유니폼(Group 1) 및 시스템 공용 리소스(Group 2: G-Buffer, Depth 등) 자동 포함.
 * 4. 출력용 스토리지 텍스처(Group 3) 정의.
 * 5. 클래스에 정의된 워크그룹 사이즈 반영.
 * 6. 기본적으로 화면 경계 밖 스레드를 즉시 종료(`earlyExit: true`)하여 20여 개 이상의 기본 이펙트 안전 보호.
 *    (TAA 등 워크그룹 공유 메모리(LDS) 및 workgroupBarrier가 필요한 특수 이펙트는 false로 설정 가능)
 *
 * [EN] This function automates repetitive boilerplate code and performs the following:
 * 1. Automatically generates separate code for MSAA and Non-MSAA.
 * 2. Automates binding of input source textures (Group 0).
 * 3. Automatically includes effect-specific uniforms (Group 1) and system common resources (Group 2: G-Buffer, Depth, etc.).
 * 4. Defines the storage texture for output (Group 3).
 * 5. Reflects the workgroup size defined in the class.
 * 6. By default, immediately terminates out-of-bounds threads (`earlyExit: true`) to protect 20+ basic effects.
 *
 * @param effect - [KO] ASinglePassPostEffect를 상속받은 이펙트 인스턴스 [EN] Effect instance inheriting ASinglePassPostEffect
 * @param code - [KO] main 함수 내부에 삽입될 WGSL 로직 [EN] WGSL logic to be inserted inside the main function
 * @param uniformStruct - [KO] (선택) 이펙트에서 사용할 Uniforms 구조체 정의 [EN] (Optional) Uniforms struct definition for the effect
 * @param sourceTextureConfigs - [KO] (선택) 입력 소스들에 대한 설정 (기본값: {name: 'sourceTexture'}) [EN] (Optional) Configurations for input sources (Default: {name: 'sourceTexture'})
 * @param earlyExit - [KO] (선택) main 진입 시 화면 경계 검사 즉시 리턴 여부 (기본값: true, LDS 배리어 필요 시 false) [EN] (Optional) Whether to early-exit on boundary check at main entry (Default: true)
 * @returns [KO] MSAA와 Non-MSAA용으로 각각 생성된 WGSL 코드 객체 [EN] WGSL code objects generated for MSAA and Non-MSAA respectively
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
