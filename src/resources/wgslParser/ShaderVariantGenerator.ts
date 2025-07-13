import {ConditionalBlock} from "./preprocessWGSL";

class ShaderVariantGenerator {
	private variantCache = new Map<string, string>();

	constructor(
		private defines: string,
		private uniqueKeys: string[],
		private conditionalBlocks: ConditionalBlock[]
	) {}

	/**
	 * 특정 변형 키에 대한 셰이더 코드를 레이지하게 생성
	 */
	getVariant(variantKey: string): string {
		// 캐시에서 확인
		if (this.variantCache.has(variantKey)) {
			console.log('🚀 바리안트 캐시 히트:', variantKey);
			return this.variantCache.get(variantKey)!;
		}

		console.log('🔄 바리안트 생성:', variantKey);

		// 활성화된 키 파싱
		const enabledKeys = variantKey === 'none' ? [] : variantKey.split('+');

		// 셰이더 코드 생성
		const variantCode = this.processConditionalBlocks(enabledKeys);

		// 캐시에 저장
		this.variantCache.set(variantKey, variantCode);

		return variantCode;
	}

	/**
	 * 사용 가능한 모든 변형 키를 반환 (필요시에만 호출)
	 */
	getAllVariantKeys(): string[] {
		const totalCombinations = Math.pow(2, this.uniqueKeys.length);
		const keys: string[] = [];

		for (let i = 0; i < totalCombinations; i++) {
			const enabledKeys = this.determineEnabledKeys(i);
			const variantKey = this.generateVariantKey(enabledKeys);
			keys.push(variantKey);
		}

		return keys;
	}

	/**
	 * 현재 캐시된 변형들의 정보를 반환
	 */
	getCachedVariants(): string[] {
		return Array.from(this.variantCache.keys());
	}

	/**
	 * 활성화된 키들을 기반으로 조건부 블록을 처리
	 */
	private processConditionalBlocks(enabledKeys: string[]): string {
		let variantCode = this.defines;

		// 뒤에서부터 처리 (인덱스 변경 방지)
		for (let blockIdx = this.conditionalBlocks.length - 1; blockIdx >= 0; blockIdx--) {
			const block = this.conditionalBlocks[blockIdx];
			const isKeyEnabled = enabledKeys.includes(block.uniformName);

			if (isKeyEnabled) {
				variantCode = variantCode.replace(block.fullMatch, block.codeBlock);
			} else {
				variantCode = variantCode.replace(block.fullMatch, '');
			}
		}

		return variantCode;
	}

	/**
	 * 비트 마스크를 사용하여 각 고유 키의 활성화 여부를 결정
	 */
	private determineEnabledKeys(combinationIndex: number): string[] {
		const enabledKeys: string[] = [];

		for (let j = 0; j < this.uniqueKeys.length; j++) {
			const key = this.uniqueKeys[j];
			const isEnabled = (combinationIndex >> j) & 1;

			if (isEnabled) {
				enabledKeys.push(key);
			}
		}

		return enabledKeys;
	}

	/**
	 * 활성화된 키들로부터 변형 키를 생성
	 */
	private generateVariantKey(enabledKeys: string[]): string {
		return enabledKeys.length > 0 ? enabledKeys.sort().join('+') : 'none';
	}
}

export default ShaderVariantGenerator;
