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
};
const conditionalBlockPattern = /#redgpu_if\s+(\w+)\b([\s\S]*?)(?:#redgpu_else([\s\S]*?))?#redgpu_endIf/g;
const preprocessCache = new Map();
/**
 * 코드 해시 생성 (간단한 해시 함수)
 */
const generateCodeHash = (code) => {
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
        const char = code.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
};
/**
 * 인클루드 처리 - SystemCode에서 해당 키의 코드를 가져와서 치환
 */
const processIncludes = (code) => {
    return code.replace(includePattern, (match, key) => SystemCode[key] || match);
};
/**
 * 정의 처리 - 미리 정의된 값들로 치환
 */
const processDefines = (code) => {
    return code.replace(definePattern, (match) => defineValues[match] || match);
};
/**
 * 조건부 블록 찾기 및 파싱 - #redgpu_else 지원
 */
const findConditionalBlocks = (code) => {
    const conditionalBlocks = [];
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
 * 중복 키 통계 및 로깅
 */
const logDuplicateKeys = (conditionalBlocks) => {
    if (!conditionalBlocks.length)
        return;
    const keyCount = new Map();
    conditionalBlocks.forEach(block => {
        keyCount.set(block.uniformName, (keyCount.get(block.uniformName) || 0) + 1);
    });
    const duplicateKeys = Array.from(keyCount.entries()).filter(([_, count]) => count > 1);
    if (duplicateKeys.length > 0) {
        console.log('중복 키 발견:', duplicateKeys.map(([key, count]) => `${key}(${count}개)`));
    }
    console.log('발견된 조건부 블록들:', conditionalBlocks.map(b => `${b.uniformName}[${b.blockIndex}]${b.elseBlock ? ' (else 포함)' : ''}`));
};
/**
 * 기본 셰이더 소스 생성 (모든 조건부 블록의 if 부분 포함)
 */
const generateDefaultSource = (defines, conditionalBlocks) => {
    let defaultSource = defines;
    for (let i = conditionalBlocks.length - 1; i >= 0; i--) {
        const block = conditionalBlocks[i];
        // 기본적으로 if 블록을 포함 (조건이 true일 때의 상태)
        defaultSource = defaultSource.replace(block.fullMatch, block.ifBlock);
        // console.log('✅ 기본 셰이더에 포함:', `${block.uniformName}[${block.blockIndex}] - if 블록`);
    }
    return defaultSource;
};
/**
 * WGSL 전처리 메인 함수
 */
const preprocessWGSL = (code) => {
    // 캐시 확인
    const cacheKey = generateCodeHash(code);
    const cachedResult = preprocessCache.get(cacheKey);
    if (cachedResult) {
        console.log('🚀 캐시에서 WGSL 로드:', cacheKey);
        return cachedResult;
    }
    console.log('🔄 WGSL 파싱 시작:', cacheKey);
    // 1. 인클루드 처리
    const withIncludes = processIncludes(code);
    // 2. 정의 처리
    const defines = processDefines(withIncludes);
    // 3. 조건부 블록 찾기
    const conditionalBlocks = findConditionalBlocks(defines);
    // 4. 중복 키 통계 및 로깅
    logDuplicateKeys(conditionalBlocks);
    // 5. 기본 셰이더 생성
    const defaultSource = generateDefaultSource(defines, conditionalBlocks);
    // 6. 고유 키 추출
    const uniqueKeys = [...new Set(conditionalBlocks.map(b => b.uniformName))];
    // 7. 레이지 바리안트 생성기 생성
    const shaderSourceVariant = new ShaderVariantGenerator(defines, conditionalBlocks);
    // 8. 결과 생성
    const result = {
        cacheKey,
        defaultSource,
        shaderSourceVariant,
        conditionalBlocks: uniqueKeys,
    };
    // 9. 캐싱 및 로깅
    const totalCombinations = Math.pow(2, uniqueKeys.length);
    preprocessCache.set(cacheKey, result);
    if (totalCombinations > 1) {
        console.log(`레이지 바리안트 생성기 초기화 (캐시 저장):`, totalCombinations, cacheKey);
        console.log('고유 키들:', uniqueKeys);
        console.log('이론적 가능한 바리안트 수:', totalCombinations);
    }
    // keepLog('shaderSourceVariant',shaderSourceVariant)
    return result;
};
export default preprocessWGSL;
