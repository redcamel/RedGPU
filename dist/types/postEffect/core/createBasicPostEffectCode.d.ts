import ASinglePassPostEffect from "./ASinglePassPostEffect";
/**
 * 기본 후처리 이펙트 WGSL 코드를 생성하는 헬퍼 함수입니다.
 *
 * - MSAA/Non-MSAA, 유니폼 구조, 딥스 텍스처 등 옵션에 따라 WGSL 코드를 자동 생성합니다.
 * - 내부적으로 시스템 유니폼, 소스/출력 텍스처, 워크그룹 크기 등을 자동으로 포함합니다.
 *
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
declare const createBasicPostEffectCode: (effect: ASinglePassPostEffect, code: string, uniformStruct?: string) => {
    msaa: string;
    nonMsaa: string;
};
export default createBasicPostEffectCode;
