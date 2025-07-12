import PassClustersLightHelper from "../../light/clusterLight/PassClustersLightHelper";
import {keepLog} from "../../utils";
import SystemCode from "../systemCode/SystemCode";

const shaderCodeKeys = Object.keys(SystemCode).join('|');
const includePattern = new RegExp(`#redgpu_include (${shaderCodeKeys})`, 'g');
// 모든 정의를 하나의 정규식으로 통합
const definePattern = /REDGPU_DEFINE_(?:TILE_COUNT_[XYZ]|TOTAL_TILES|WORKGROUP_SIZE_[XYZ]|MAX_LIGHTS_PER_CLUSTER)/g;
// 값들을 미리 계산해서 캐시
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

interface ConditionalBlock {
	uniformName: string;
	codeBlock: string;
	fullMatch: string;
}

interface PreprocessedWGSLResult {
	defaultSource: string;
	shaderSourceVariant: Record<string, string>;
}

// 🎯 캐싱 시스템
const preprocessCache = new Map<string, PreprocessedWGSLResult>();
/**
 * 코드 해시 생성 (간단한 해시 함수)
 */
const generateCodeHash = (code: string): string => {
	let hash = 0;
	for (let i = 0; i < code.length; i++) {
		const char = code.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // 32비트 정수로 변환
	}
	return hash.toString(36);
};
const preprocessWGSL = (code: string): PreprocessedWGSLResult => {
	// 🎯 캐시 확인
	const cacheKey = generateCodeHash(code);
	const cachedResult = preprocessCache.get(cacheKey);
	if (cachedResult) {
		console.log('🚀 캐시에서 WGSL 로드:', cacheKey);
		return cachedResult;
	}
	console.log('🔄 WGSL 파싱 시작:', cacheKey);
	// 1. 인클루드 처리
	const withIncludes = code.replace(includePattern, (match, key) => SystemCode[key] || match);
	// 2. 정의 처리 (한 번의 replace로 모든 정의 처리)
	const defines = withIncludes.replace(definePattern, (match) =>
		defineValues[match as keyof typeof defineValues] || match
	);
	// 3. 조건부 블록 찾기
	const conditionalBlocks: ConditionalBlock[] = [];
	let match;
	// 정규식 초기화
	conditionalBlockPattern.lastIndex = 0;
	while ((match = conditionalBlockPattern.exec(defines)) !== null) {
		conditionalBlocks.push({
			uniformName: match[1],
			codeBlock: match[2].trim(),
			fullMatch: match[0]
		});
	}
	if (conditionalBlocks.length) {
		keepLog('🎯 발견된 조건부 블록들:', conditionalBlocks);
	}
	// 4. 기본 셰이더 (모든 조건부 블록 포함)
	const defaultSource = defines.replace(conditionalBlockPattern, (match, uniformName, codeBlock) => {
		keepLog('✅ 기본 셰이더에 포함:', uniformName);
		return codeBlock.trim();
	});
	// 5. 모든 조합 생성 (2^n 개의 조합)
	const totalCombinations = Math.pow(2, conditionalBlocks.length);
	const shaderSourceVariant: Record<string, string> = {};
	for (let i = 0; i < totalCombinations; i++) {
		let variantCode = defines;
		const enabledBlocks: string[] = [];
		// 각 조건부 블록을 포함할지 결정
		for (let j = 0; j < conditionalBlocks.length; j++) {
			const block = conditionalBlocks[j];
			const isEnabled = (i >> j) & 1; // 비트 마스크로 조합 결정
			if (isEnabled) {
				// 조건부 블록을 코드 블록으로 치환
				variantCode = variantCode.replace(block.fullMatch, block.codeBlock);
				enabledBlocks.push(block.uniformName);
			} else {
				// 조건부 블록을 완전히 제거
				variantCode = variantCode.replace(block.fullMatch, '');
			}
		}
		// 조합 키 생성
		const variantKey = enabledBlocks.length > 0 ? enabledBlocks.join('_') : 'none';
		shaderSourceVariant[variantKey] = variantCode;
	}
	// 🎯 결과 생성
	const result: PreprocessedWGSLResult = {
		defaultSource,           // 🎯 모든 조건부 블록 포함
		shaderSourceVariant,     // 🎯 모든 조합 객체
	};
	// 🎯 캐시에 저장
	preprocessCache.set(cacheKey, result);
	if (totalCombinations > 1) {
		keepLog(`🎯 Variants 생성 완료 (캐시 저장):`, totalCombinations, cacheKey);
		keepLog(result);
	}
	return result;
};
export default preprocessWGSL;
export type {PreprocessedWGSLResult};
