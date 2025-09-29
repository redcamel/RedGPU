import {ConditionalBlock} from "./preprocessWGSL";

/**
 * 조건부 블록과 define 문자열을 기반으로 WGSL 셰이더의 다양한 변형(variant) 코드를 생성하는 유틸리티.
 *
 * 변형 키(variantKey)에 따라 조건부 블록을 처리하여, 각기 다른 ��이더 소스를 동적으로 생성하고 캐싱합니다.
 * @category WGSL
 */
class ShaderVariantGenerator {
	#variantCache = new Map<string, string>();
	#defines: string;
	#conditionalBlocks: ConditionalBlock[];

	/**
	 * ShaderVariantGenerator 생성자
	 * @param defines - WGSL 셰이더의 define 문자열(기본 소스)
	 * @param conditionalBlocks - 조건부 블록 정보 배열
	 */
	constructor(
		defines: string,
		conditionalBlocks: ConditionalBlock[]
	) {
		this.#defines = defines;
		this.#conditionalBlocks = conditionalBlocks;
	}

	/**
	 * 특정 변형 키에 대한 셰이더 코드를 레이지하게 생성합니다.
	 *
	 * @param variantKey - 활성화할 조건부 키를 '+'로 연결한 문자열(예: "FOO+BAR"), 조건이 없으면 'none'
	 * @returns 변형된 WGSL 셰이더 코드 문자열
	 */
	getVariant(variantKey: string): string {
		// 캐시에서 확인
		if (this.#variantCache.has(variantKey)) {
			console.log(' 바리안트 캐시 히트:', variantKey);
			return this.#variantCache.get(variantKey)!;
		}
		console.log('바리안트 생성:', variantKey);
		// 활성화된 키 파싱
		const enabledKeys = variantKey === 'none' ? [] : variantKey.split('+');
		// 셰이더 코드 생성
		const variantCode = this.#processConditionalBlocks(enabledKeys);
		// 캐시에 저장
		this.#variantCache.set(variantKey, variantCode);
		return variantCode;
	}

	/**
	 * 현재 캐시된 변형 키 목록을 반환합니다.
	 *
	 * @returns 캐시된 variantKey 문자열 배열
	 */
	getCachedVariants(): string[] {
		return Array.from(this.#variantCache.keys());
	}

	/**
	 * 활성화된 키들을 기반으로 조건부 블록을 처리하여 WGSL 셰이더 코드를 생성합니다.
	 *
	 * @param enabledKeys - 활성화된 조건부 키 배열
	 * @returns 변형된 WGSL 셰이더 코드 문자열
	 */
	#processConditionalBlocks(enabledKeys: string[]): string {
		let variantCode = this.#defines;
		// 뒤에서부터 처리 (인덱스 변경 방지)
		for (let blockIdx = this.#conditionalBlocks.length - 1; blockIdx >= 0; blockIdx--) {
			const block = this.#conditionalBlocks[blockIdx];
			const isKeyEnabled = enabledKeys.includes(block.uniformName);
			if (isKeyEnabled) {
				// 조건이 true일 때 - ifBlock 사용
				variantCode = variantCode.replace(block.fullMatch, block.ifBlock);
			} else {
				// 조건이 false일 때 - elseBlock 사용 (없으면 빈 문자열)
				variantCode = variantCode.replace(block.fullMatch, block.elseBlock || '');
			}
		}
		return variantCode;
	}
}

export default ShaderVariantGenerator;
