import ShaderVariantGenerator from "./core/ShaderVariantGenerator";
export interface ConditionalBlock {
    uniformName: string;
    ifBlock: string;
    elseBlock?: string;
    fullMatch: string;
    blockIndex: number;
}
export interface PreprocessedWGSLResult {
    cacheKey: string;
    defaultSource: string;
    shaderSourceVariant: ShaderVariantGenerator;
    conditionalBlocks: string[];
    conditionalBlockInfos: ConditionalBlock[];
}
/**
 * [KO] WGSL 셰이더 코드 전처리 및 AST 분석 리플렉션 캐시 관리 클래스
 * [EN] WGSL shader code preprocessing and AST analysis reflection cache management class
 */
declare class WGSLParser {
    #private;
    /**
     * [KO] WGSL 코드를 전처리하고 리플렉션 정보를 반환합니다.
     */
    parse(sourceName: string, code: string, injectLibrary?: Record<string, string>): {
        uniforms: any;
        storage: any;
        structs: any;
        samplers: any;
        textures: any;
        vertexEntries: string[];
        fragmentEntries: string[];
        computeEntries: string[];
        defaultSource: string;
        shaderSourceVariant: any;
        conditionalBlocks: string[];
    };
    /**
     * [KO] 파서 내부 캐시 맵의 모든 자원을 명시적으로 비우고 해제합니다.
     */
    destroy(): void;
}
export default WGSLParser;
