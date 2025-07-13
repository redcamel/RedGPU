import PassClustersLightHelper from "../../light/clusterLight/PassClustersLightHelper";
import {keepLog} from "../../utils";

import SystemCode from "../systemCode/SystemCode";
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
const conditionalBlockPattern = /#redgpu_if\s+(\w+)\b([\s\S]*?)#redgpu_endIf/g;

export interface ConditionalBlock {
	uniformName: string;
	codeBlock: string;
	fullMatch: string;
	blockIndex: number;
}

interface PreprocessedWGSLResult {
	cacheKey: string;
	defaultSource: string;
	shaderSourceVariant: ShaderVariantGenerator;
	conditionalBlocks: string[];
}


const preprocessCache = new Map<string, PreprocessedWGSLResult>();

/**
 * 코드 해시 생성 (간단한 해시 함수)
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
 * 인클루드 처리 - SystemCode에서 해당 키의 코드를 가져와서 치환
 */
const processIncludes = (code: string): string => {
	return code.replace(includePattern, (match, key) => SystemCode[key] || match);
};

/**
 * 정의 처리 - 미리 정의된 값들로 치환
 */
const processDefines = (code: string): string => {
	return code.replace(definePattern, (match) =>
		defineValues[match as keyof typeof defineValues] || match
	);
};

/**
 * 조건부 블록 찾기 및 파싱
 */
const findConditionalBlocks = (code: string): ConditionalBlock[] => {
	const conditionalBlocks: ConditionalBlock[] = [];
	let match;
	let blockIndex = 0;

	conditionalBlockPattern.lastIndex = 0;
	while ((match = conditionalBlockPattern.exec(code)) !== null) {
		conditionalBlocks.push({
			uniformName: match[1],
			codeBlock: match[2].trim(),
			fullMatch: match[0],
			blockIndex: blockIndex++
		});
	}

	return conditionalBlocks;
};

/**
 * 중복 키 통계 및 로깅
 */
const logDuplicateKeys = (conditionalBlocks: ConditionalBlock[]): void => {
	if (!conditionalBlocks.length) return;

	const keyCount = new Map<string, number>();
	conditionalBlocks.forEach(block => {
		keyCount.set(block.uniformName, (keyCount.get(block.uniformName) || 0) + 1);
	});

	const duplicateKeys = Array.from(keyCount.entries()).filter(([_, count]) => count > 1);
	if (duplicateKeys.length > 0) {
		keepLog('🎯 중복 키 발견:', duplicateKeys.map(([key, count]) => `${key}(${count}개)`));
	}

	console.log('🎯 발견된 조건부 블록들:', conditionalBlocks.map(b => `${b.uniformName}[${b.blockIndex}]`));
};

/**
 * 기본 셰이더 소스 생성 (모든 조건부 블록 포함)
 */
const generateDefaultSource = (defines: string, conditionalBlocks: ConditionalBlock[]): string => {
	let defaultSource = defines;

	// 뒤에서부터 치환 (인덱스 변경 방지)
	for (let i = conditionalBlocks.length - 1; i >= 0; i--) {
		const block = conditionalBlocks[i];
		defaultSource = defaultSource.replace(block.fullMatch, block.codeBlock);
		console.log('✅ 기본 셰이더에 포함:', `${block.uniformName}[${block.blockIndex}]`);
	}

	return defaultSource;
};

/**
 * WGSL 전처리 메인 함수
 */
const preprocessWGSL = (code: string): PreprocessedWGSLResult => {
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
	const result: PreprocessedWGSLResult = {
		cacheKey,
		defaultSource,
		shaderSourceVariant,
		conditionalBlocks: uniqueKeys,
	};

	// 9. 캐싱 및 로깅
	const totalCombinations = Math.pow(2, uniqueKeys.length);
	preprocessCache.set(cacheKey, result);

	if (totalCombinations > 1) {
		console.log(`🎯 레이지 바리안트 생성기 초기화 (캐시 저장):`, totalCombinations, cacheKey);
		console.log('🎯 고유 키들:', uniqueKeys);
		keepLog('🎯 이론적 가능한 바리안트 수:', totalCombinations);
	}
// keepLog('shaderSourceVariant',shaderSourceVariant)
	return result;
};

export default preprocessWGSL;
