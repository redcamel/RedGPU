import ShaderVariantGenerator from "./ShaderVariantGenerator";
/** [KO] 조건부 블록 정보 인터페이스 [EN] Conditional block information interface */
export interface ConditionalBlock {
    uniformName: string;
    ifBlock: string;
    elseBlock?: string;
    fullMatch: string;
    blockIndex: number;
}
/** [KO] 전처리된 WGSL 결과 인터페이스 [EN] Preprocessed WGSL result interface */
export interface PreprocessedWGSLResult {
    cacheKey: string;
    defaultSource: string;
    shaderSourceVariant: ShaderVariantGenerator;
    conditionalBlocks: string[];
    conditionalBlockInfos: ConditionalBlock[];
}
/**
 * [KO] WGSL 셰이더 코드를 전처리합니다.
 * [EN] Preprocesses WGSL shader code.
 *
 * [KO] 이 함수는 #redgpu_include, REDGPU_DEFINE_*, #redgpu_if 등 RedGPU 전용 매크로를 처리하고, 셰이더 변형(variant) 생성을 위한 정보를 추출합니다.
 * [EN] This function processes RedGPU-specific macros such as #redgpu_include, REDGPU_DEFINE_*, and #redgpu_if, and extracts information for generating shader variants.
 *
 * @param code -
 * [KO] 전처리할 WGSL 소스 코드
 * [EN] WGSL source code to preprocess
 * @param sourceName -
 * [KO] 셰이더 소스 식별 이름 (경고 출력용)
 * [EN] Shader source identifier name (for warnings)
 * @returns
 * [KO] 전처리 결과 객체 (캐시 키, 기본 소스, 변형 생성기 등 포함)
 * [EN] Preprocessing result object (including cache key, default source, and variant generator)
 * @category WGSL
 */
declare const preprocessWGSL: (code: string, sourceName?: string) => PreprocessedWGSLResult;
export default preprocessWGSL;
