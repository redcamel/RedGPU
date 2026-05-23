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
    sourceTextureConfigs: IPostEffectSourceConfig | IPostEffectSourceConfig[] = {name: 'sourceTexture'}
) => {
    const {WORK_SIZE_X, WORK_SIZE_Y, WORK_SIZE_Z} = effect;
    const depthTextureType = useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d';

    let sourceTextures = '';
    const items = Array.isArray(sourceTextureConfigs) ? sourceTextureConfigs : [sourceTextureConfigs];
    items.forEach((item, i) => {
        let name: string;
        let isSampled: boolean = false;

        name = item.name;
        if (item.isSampled !== undefined) isSampled = item.isSampled;

        if (isSampled) {
            sourceTextures += `@group(0) @binding(${i}) var ${name} : texture_2d<f32>;\n`;
        } else {
            sourceTextures += `@group(0) @binding(${i}) var ${name} : texture_storage_2d<rgba16float, read>;\n`;
        }
    });

    return `
        ${uniformStruct}
        
        ${sourceTextures}
        
        ${uniformStruct ? '@group(1) @binding(0) var<uniform> uniforms: Uniforms;' : ''}
        
        ${ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM}
        @group(2) @binding(5) var basicSampler : sampler;
        
        @group(2) @binding(0) var depthTexture : ${depthTextureType};
        @group(2) @binding(1) var gBufferNormalTexture : texture_2d<f32>;
        @group(2) @binding(2) var gBufferMotionVector : texture_2d<f32>;
        @group(2) @binding(3) var prevDepthTexture : ${depthTextureType};
        
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
 * [KO] 기본 후처리 이펙트용 WGSL 코드를 생성하는 고수준 헬퍼 함수입니다.
 * [EN] High-level helper function to generate WGSL code for basic post-processing effects.
 *
 * [KO] 이 함수는 반복적인 보일러플레이트 코드를 자동화하며 다음 기능을 수행합니다:
 * 1. MSAA/Non-MSAA 대응 소스 자동 분기 생성.
 * 2. 입력 소스 텍스처(Group 0) 바인딩 자동화.
 * 3. 이펙트 전용 유니폼(Group 1) 및 시스템 공용 리소스(Group 2: G-Buffer, Depth 등) 자동 포함.
 * 4. 출력용 스토리지 텍스처(Group 3) 정의.
 * 5. 클래스에 정의된 워크그룹 사이즈 반영.
 *
 * [EN] This function automates repetitive boilerplate code and performs the following:
 * 1. Automatically generates separate code for MSAA and Non-MSAA.
 * 2. Automates binding of input source textures (Group 0).
 * 3. Automatically includes effect-specific uniforms (Group 1) and system common resources (Group 2: G-Buffer, Depth, etc.).
 * 4. Defines the storage texture for output (Group 3).
 * 5. Reflects the workgroup size defined in the class.
 *
 * @param effect - [KO] ASinglePassPostEffect를 상속받은 이펙트 인스턴스 [EN] Effect instance inheriting ASinglePassPostEffect
 * @param code - [KO] main 함수 내부에 삽입될 WGSL 로직 [EN] WGSL logic to be inserted inside the main function
 * @param uniformStruct - [KO] (선택) 이펙트에서 사용할 Uniforms 구조체 정의 [EN] (Optional) Uniforms struct definition for the effect
 * @param sourceTextureConfigs - [KO] (선택) 입력 소스들에 대한 설정 (기본값: {name: 'sourceTexture'}) [EN] (Optional) Configurations for input sources (Default: {name: 'sourceTexture'})
 * @returns [KO] MSAA와 Non-MSAA용으로 각각 생성된 WGSL 코드 객체 [EN] WGSL code objects generated for MSAA and Non-MSAA respectively
 */
const createBasicPostEffectCode = (
    effect: ASinglePassPostEffect,
    code: string,
    uniformStruct: string = '',
    sourceTextureConfigs: IPostEffectSourceConfig | IPostEffectSourceConfig[] = {name: 'sourceTexture'}
) => {
    return {
        msaa: createCode(effect, code, uniformStruct, true, sourceTextureConfigs),
        nonMsaa: createCode(effect, code, uniformStruct, false, sourceTextureConfigs)
    }
}
Object.freeze(createBasicPostEffectCode)
export default createBasicPostEffectCode
