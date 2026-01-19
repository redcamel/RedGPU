import {ConditionalBlock} from "./preprocessWGSL";

/**
 * [KO] 조건부 블록과 define 문자열을 기반으로 WGSL 셰이더의 다양한 변형(variant) 코드를 생성하는 유틸리티 클래스입니다.
 * [EN] Utility class that generates various variant codes for WGSL shaders based on conditional blocks and define strings.
 *
 * [KO] 변형 키(variantKey)에 따라 조건부 블록을 처리하여, 각기 다른 셰이더 소스를 동적으로 생성하고 캐싱합니다.
 * [EN] Processes conditional blocks according to the variant key (variantKey), dynamically generating and caching different shader sources.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly.
 * :::
 *
 * @category WGSL
 */
class ShaderVariantGenerator {
    #variantCache = new Map<string, string>();
    #defines: string;
    #conditionalBlocks: ConditionalBlock[];

    /**
     * [KO] ShaderVariantGenerator 인스턴스를 생성합니다. (내부 시스템 전용)
     * [EN] Creates a ShaderVariantGenerator instance. (Internal system only)
     * @param defines -
     * [KO] WGSL 셰이더의 define 문자열 (기본 소스)
     * [EN] Define string of WGSL shader (base source)
     * @param conditionalBlocks -
     * [KO] 조건부 블록 정보 배열
     * [EN] Array of conditional block information
     */
    constructor(
        defines: string,
        conditionalBlocks: ConditionalBlock[]
    ) {
        this.#defines = defines;
        this.#conditionalBlocks = conditionalBlocks;
    }

    /**
     * [KO] 특정 변형 키에 대한 셰이더 코드를 지연 생성(Lazy generate)합니다.
     * [EN] Lazy-generates shader code for a specific variant key.
     * @param variantKey -
     * [KO] 활성화할 조건부 키를 '+'로 연결한 문자열 (예: "FOO+BAR"), 조건이 없으면 'none'
     * [EN] String connecting conditional keys to activate with '+' (e.g., "FOO+BAR"), or 'none' if no conditions
     * @returns
     * [KO] 변형된 WGSL 셰이더 코드 문자열
     * [EN] Variant WGSL shader code string
     */
    getVariant(variantKey: string): string {
        if (this.#variantCache.has(variantKey)) {
            return this.#variantCache.get(variantKey)!;
        }
        const enabledKeys = variantKey === 'none' ? [] : variantKey.split('+');
        const variantCode = this.#processConditionalBlocks(enabledKeys);
        this.#variantCache.set(variantKey, variantCode);
        return variantCode;
    }

    /**
     * [KO] 현재 캐시된 변형 키 목록을 반환합니다.
     * [EN] Returns the list of currently cached variant keys.
     */
    getCachedVariants(): string[] {
        return Array.from(this.#variantCache.keys());
    }

    /**
     * [KO] 활성화된 키들을 기반으로 조건부 블록을 처리하여 WGSL 셰이더 코드를 생성합니다.
     * [EN] Generates WGSL shader code by processing conditional blocks based on activated keys.
     */
    #processConditionalBlocks(enabledKeys: string[]): string {
        let variantCode = this.#defines;
        for (let blockIdx = this.#conditionalBlocks.length - 1; blockIdx >= 0; blockIdx--) {
            const block = this.#conditionalBlocks[blockIdx];
            const isKeyEnabled = enabledKeys.includes(block.uniformName);
            if (isKeyEnabled) {
                variantCode = variantCode.replace(block.fullMatch, block.ifBlock);
            } else {
                variantCode = variantCode.replace(block.fullMatch, block.elseBlock || '');
            }
        }
        return variantCode;
    }
}

export default ShaderVariantGenerator;