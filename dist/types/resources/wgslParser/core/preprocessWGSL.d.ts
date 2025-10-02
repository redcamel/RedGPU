import ShaderVariantGenerator from "./ShaderVariantGenerator";
export interface ConditionalBlock {
    uniformName: string;
    ifBlock: string;
    elseBlock?: string;
    fullMatch: string;
    blockIndex: number;
}
interface PreprocessedWGSLResult {
    cacheKey: string;
    defaultSource: string;
    shaderSourceVariant: ShaderVariantGenerator;
    conditionalBlocks: string[];
}
/**
 * WGSL 전처리 메인 함수
 */
declare const preprocessWGSL: (code: string) => PreprocessedWGSLResult;
export default preprocessWGSL;
