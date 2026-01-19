import ASinglePassPostEffect from "./ASinglePassPostEffect";
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
declare const createBasicPostEffectCode: (effect: ASinglePassPostEffect, code: string, uniformStruct?: string) => {
    msaa: string;
    nonMsaa: string;
};
export default createBasicPostEffectCode;
