import ShaderLibrary from "../../systemCodeManager/ShaderLibrary";
import ASingleRenderPassPostEffect from "./ASingleRenderPassPostEffect";
import {IPostEffectSourceConfig} from "./types";

const createCode = (
    effect: ASingleRenderPassPostEffect,
    code: string,
    uniformStruct: string = '',
    useMSAA: boolean = false,
    sourceTextureConfigs?: IPostEffectSourceConfig | IPostEffectSourceConfig[],
    useSystemUniforms: boolean = true
) => {
    const postEffectSystemUniform = useMSAA
        ? ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM_MSAA
        : ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM;

    const defaultConfigs: IPostEffectSourceConfig[] = effect.inPlace ? [] : [{name: 'sourceTexture'}];
    const items = sourceTextureConfigs !== undefined
        ? (Array.isArray(sourceTextureConfigs) ? sourceTextureConfigs : [sourceTextureConfigs])
        : defaultConfigs;

    let sourceTextures = '';
    for (let i = 0, len = items.length; i < len; i++) {
        const item = items[i];
        const textureType = item.textureType || 'texture_2d<f32>';
        sourceTextures += `@group(0) @binding(${i}) var ${item.name} : ${textureType};\n`;
    }

    const hasUniformStruct = /\bstruct\s+Uniforms\b/.test(uniformStruct);

    return `
        struct VSOutput {
            @builtin(position) position: vec4<f32>,
            @location(0) uv: vec2<f32>,
        };

        @vertex
        fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VSOutput {
            let uv = vec2<f32>(
                f32((vertexIndex << 1u) & 2u),
                f32(vertexIndex & 2u)
            );
            var out: VSOutput;
            out.position = vec4<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0, 0.0, 1.0);
            out.uv = uv;
            return out;
        }

        ${uniformStruct}
        
        ${sourceTextures}
        
        ${hasUniformStruct ? '@group(1) @binding(0) var<uniform> uniforms: Uniforms;' : ''}
        
        ${useSystemUniforms ? postEffectSystemUniform : ''}
        
        @fragment
        fn fs_main(in: VSOutput) -> @location(0) vec4<f32> {
            let fragCoord = vec2<u32>(in.position.xy);
            let uv = in.uv;
            let postEffectOutputDimensions = vec2<u32>(round(in.position.xy / in.uv));
            ${code}
        }
    `;
};

/**
 * [KO] 단일 렌더 패스 후처리 이펙트(`ASingleRenderPassPostEffect`)용 MSAA/Non-MSAA WGSL 버텍스+프래그먼트 셰이더 코드를 생성합니다.
 * [EN] Generates MSAA and Non-MSAA WGSL vertex and fragment shader codes for a single render-pass post-processing effect (`ASingleRenderPassPostEffect`).
 *
 * [KO] 버텍스 버퍼 없는 3-버텍스 풀스크린 삼각형(`vs_main`), 입력 소스 텍스처(Group 0), 이펙트 유니폼(Group 1), 시스템 공용 유니폼 및 G-Buffer(Group 2) 바인딩과 프래그먼트 엔트리(`fs_main`)를 자동으로 구성합니다. `effect.inPlace`가 `true`일 경우 기본 `sourceTexture` 바인딩을 생략하여 WebGPU Read-Write Hazard를 방지합니다.
 * [EN] Automatically configures a bufferless 3-vertex fullscreen triangle (`vs_main`), bindings for input source textures (Group 0), effect uniforms (Group 1), system uniforms and G-Buffer (Group 2), and the fragment entry point (`fs_main`). When `effect.inPlace` is `true`, omits the default `sourceTexture` binding to prevent WebGPU Read-Write Hazards.
 *
 * @param effect -
 * [KO] 대상 `ASingleRenderPassPostEffect` 인스턴스
 * [EN] Target `ASingleRenderPassPostEffect` instance
 * @param code -
 * [KO] `fs_main` 함수 내부에 삽입할 WGSL 프래그먼트 연산 코드 (`return vec4<f32>(...);` 반환 필수)
 * [EN] WGSL fragment computation code to insert inside `fs_main` (must return `vec4<f32>(...)`)
 * @param uniformStruct -
 * [KO] 이펙트 전용 `Uniforms` 구조체 정의 또는 보조 WGSL 코드 문자열
 * [EN] Effect-specific `Uniforms` struct definition or helper WGSL code string
 * @param sourceTextureConfigs -
 * [KO] 입력 소스 텍스처 바인딩 설정 (생략 시 Out-of-Place 모드는 `{ name: 'sourceTexture' }`, In-Place 모드는 `[]` 적용)
 * [EN] Input source texture binding configuration (defaults to `{ name: 'sourceTexture' }` in Out-of-Place mode, or `[]` in In-Place mode)
 * @param useSystemUniforms -
 * [KO] 시스템 유니폼 및 G-Buffer(Group 2) 바인딩 포함 여부
 * [EN] Whether to include system uniforms and G-Buffer (Group 2) bindings
 * @returns
 * [KO] MSAA 및 Non-MSAA용 WGSL 코드 객체 (`{ msaa: string, nonMsaa: string }`)
 * [EN] WGSL code object for MSAA and Non-MSAA (`{ msaa: string, nonMsaa: string }`)
 * @category PostEffect
 */
const createBasicRenderPassPostEffectCode = (
    effect: ASingleRenderPassPostEffect,
    code: string,
    uniformStruct: string = '',
    sourceTextureConfigs?: IPostEffectSourceConfig | IPostEffectSourceConfig[],
    useSystemUniforms: boolean = true
) => {
    return {
        msaa: createCode(effect, code, uniformStruct, true, sourceTextureConfigs, useSystemUniforms),
        nonMsaa: createCode(effect, code, uniformStruct, false, sourceTextureConfigs, useSystemUniforms)
    };
};

Object.freeze(createBasicRenderPassPostEffectCode);
export default createBasicRenderPassPostEffectCode;
