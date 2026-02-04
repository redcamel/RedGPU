import PassClustersLightHelper from "../../../light/clusterLight/PassClustersLightHelper";
import SystemCode from "../../systemCode/SystemCode";
import ShaderVariantGenerator from "./ShaderVariantGenerator";

const shaderCodeKeys = Object.keys(SystemCode).join('|');
const includePattern = new RegExp(`#redgpu_include (${shaderCodeKeys})`, 'g');
const definePattern = /REDGPU_DEFINE_(?:TILE_COUNT_[XYZ]|TOTAL_TILES|WORKGROUP_SIZE_[XYZ]|MAX_LIGHTS_PER_CLUSTER)/g;
const defineValues = {
    REDGPU_DEFINE_TILE_COUNT_X: PassClustersLightHelper.TILE_COUNT_X.toString(),
    REDGPU_DEFINE_TILE_COUNT_Y: PassClustersLightHelper.TILE_COUNT_Y.toString(),
    REDGPU_DEFINE_TILE_COUNT_Z: PassClustersLightHelper.TILE_COUNT_Z.toString(),
    REDGPU_DEFINE_TOTAL_TILES: PassClustersLightHelper.getTotalTileSize().toString(),
    REDGPU_DEFINE_WORKGROUP_SIZE_X: PassClustersLightHelper.WORKGROUP_SIZE_X.toString(),
    REDGPU_DEFINE_WORKGROUP_SIZE_Y: PassClustersLightHelper.WORKGROUP_SIZE_Y.toString(),
    REDGPU_DEFINE_WORKGROUP_SIZE_Z: PassClustersLightHelper.WORKGROUP_SIZE_Z.toString(),
    REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTER: PassClustersLightHelper.MAX_LIGHTS_PER_CLUSTER.toString(),
} as const;
const conditionalBlockPattern = /#redgpu_if\s+(\w+)\b([\s\S]*?)(?:#redgpu_else([\s\S]*?))?#redgpu_endIf/g;

/** [KO] 조건부 블록 정보 인터페이스 [EN] Conditional block information interface */
export interface ConditionalBlock {
    uniformName: string;
    ifBlock: string;
    elseBlock?: string;
    fullMatch: string;
    blockIndex: number;
}

/** [KO] 전처리된 WGSL 결과 인터페이스 [EN] Preprocessed WGSL result interface */
interface PreprocessedWGSLResult {
    cacheKey: string;
    defaultSource: string;
    shaderSourceVariant: ShaderVariantGenerator;
    conditionalBlocks: string[];
}

const preprocessCache = new Map<string, PreprocessedWGSLResult>();

/**
 * [KO] 코드 해시를 생성합니다.
 * [EN] Generates a code hash.
 */
const generateCodeHash = (code: string): string => {
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
        const char = code.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
};

/**
 * [KO] 인클루드(#redgpu_include)를 처리합니다.
 * [EN] Processes includes (#redgpu_include).
 */
const processIncludes = (code: string): string => {
    return code.replace(includePattern, (match, key) => SystemCode[key] || match);
};

/**
 * [KO] 정의(REDGPU_DEFINE_*)를 처리합니다.
 * [EN] Processes defines (REDGPU_DEFINE_*).
 */
const processDefines = (code: string): string => {
    return code.replace(definePattern, (match) =>
        defineValues[match as keyof typeof defineValues] || match
    );
};

/**
 * [KO] 조건부 블록(#redgpu_if)을 찾아 파싱합니다.
 * [EN] Finds and parses conditional blocks (#redgpu_if).
 */
const findConditionalBlocks = (code: string): ConditionalBlock[] => {
    const conditionalBlocks: ConditionalBlock[] = [];
    let match;
    let blockIndex = 0;
    conditionalBlockPattern.lastIndex = 0;
    while ((match = conditionalBlockPattern.exec(code)) !== null) {
        const [fullMatch, uniformName, ifBlock, elseBlock] = match;
        conditionalBlocks.push({
            uniformName,
            ifBlock: ifBlock.trim(),
            elseBlock: elseBlock?.trim(),
            fullMatch,
            blockIndex: blockIndex++
        });
    }
    return conditionalBlocks;
};

/**
 * [KO] 중복 키 통계 및 로깅을 수행합니다.
 * [EN] Performs duplicate key statistics and logging.
 */
const logDuplicateKeys = (conditionalBlocks: ConditionalBlock[]): void => {
    if (!conditionalBlocks.length) return;
    const keyCount = new Map<string, number>();
    conditionalBlocks.forEach(block => {
        keyCount.set(block.uniformName, (keyCount.get(block.uniformName) || 0) + 1);
    });
    const duplicateKeys = Array.from(keyCount.entries()).filter(([_, count]) => count > 1);
    if (duplicateKeys.length > 0) {
        console.log('중복 키 발견:', duplicateKeys.map(([key, count]) => `${key}(${count}개)`));
    }
    console.log('발견된 조건부 블록들:', conditionalBlocks.map(b =>
        `${b.uniformName}[${b.blockIndex}]${b.elseBlock ? ' (else 포함)' : ''}`
    ));
};

/**
 * [KO] 기본 셰이더 소스를 생성합니다. (기본적으로 모든 조건부 블록을 제외합니다)
 * [EN] Generates the default shader source. (Excludes all conditional blocks by default)
 */
const generateDefaultSource = (defines: string, conditionalBlocks: ConditionalBlock[]): string => {
    let defaultSource = defines;
    for (let i = conditionalBlocks.length - 1; i >= 0; i--) {
        const block = conditionalBlocks[i];
        // [KO] 기본 소스에서는 ifBlock 대신 elseBlock을 사용하거나 아예 제거합니다.
        // [EN] In the default source, use elseBlock instead of ifBlock, or remove it entirely.
        defaultSource = defaultSource.replace(block.fullMatch, block.elseBlock || '');
    }
    return defaultSource;
};

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
 * @returns
 * [KO] 전처리 결과 객체 (캐시 키, 기본 소스, 변형 생성기 등 포함)
 * [EN] Preprocessing result object (including cache key, default source, and variant generator)
 * @category WGSL
 */
const preprocessWGSL = (code: string): PreprocessedWGSLResult => {
    const cacheKey = generateCodeHash(code);
    const cachedResult = preprocessCache.get(cacheKey);
    if (cachedResult) {
        console.log('🚀 캐시에서 WGSL 로드:', cacheKey);
        return cachedResult;
    }
    console.log('🔄 WGSL 파싱 시작:', cacheKey);
    const withIncludes = processIncludes(code);
    const defines = processDefines(withIncludes);
    const conditionalBlocks = findConditionalBlocks(defines);
    logDuplicateKeys(conditionalBlocks);
    const defaultSource = generateDefaultSource(defines, conditionalBlocks);
    const uniqueKeys = [...new Set(conditionalBlocks.map(b => b.uniformName))];
    const shaderSourceVariant = new ShaderVariantGenerator(defines, conditionalBlocks);
    const result: PreprocessedWGSLResult = {
        cacheKey,
        defaultSource,
        shaderSourceVariant,
        conditionalBlocks: uniqueKeys,
    };
    const totalCombinations = Math.pow(2, uniqueKeys.length);
    preprocessCache.set(cacheKey, result);
    if (totalCombinations > 1) {
        console.log(`레이지 바리안트 생성기 초기화 (캐시 저장):`, totalCombinations, cacheKey);
        console.log('고유 키들:', uniqueKeys);
        console.log('이론적 가능한 바리안트 수:', totalCombinations);
    }
    return result;
};

export default preprocessWGSL;