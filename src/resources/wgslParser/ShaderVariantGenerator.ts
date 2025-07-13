import {ConditionalBlock} from "./preprocessWGSL";

class ShaderVariantGenerator {
	#variantCache = new Map<string, string>();
	#defines: string
	#conditionalBlocks: ConditionalBlock[]
	constructor(
		 defines: string,
		 conditionalBlocks: ConditionalBlock[]
	) {
		this.#defines = defines;
		this.#conditionalBlocks = conditionalBlocks;

	}

	/**
	 * 특정 변형 키에 대한 셰이더 코드를 레이지하게 생성
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
	 * 현재 캐시된 변형들의 정보를 반환
	 */
	getCachedVariants(): string[] {
		return Array.from(this.#variantCache.keys());
	}

	/**
	 * 활성화된 키들을 기반으로 조건부 블록을 처리
	 */
	#processConditionalBlocks(enabledKeys: string[]): string {
		let variantCode = this.#defines;

		// 뒤에서부터 처리 (인덱스 변경 방지)
		for (let blockIdx = this.#conditionalBlocks.length - 1; blockIdx >= 0; blockIdx--) {
			const block = this.#conditionalBlocks[blockIdx];
			const isKeyEnabled = enabledKeys.includes(block.uniformName);

			if (isKeyEnabled) {
				variantCode = variantCode.replace(block.fullMatch, block.codeBlock);
			} else {
				variantCode = variantCode.replace(block.fullMatch, '');
			}
		}

		return variantCode;
	}

}

export default ShaderVariantGenerator;
