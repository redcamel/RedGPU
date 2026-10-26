import {ConditionalBlock} from "../WGSLParser";

/**
 * [KO] 조건부 블록과 define 문자열을 기반으로 WGSL 셰이더의 다양한 변형(Variant) 코드를 동적으로 생성하고 캐싱하는 유틸리티 클래스입니다.
 * [EN] Utility class that dynamically generates and caches various WGSL shader variant codes based on conditional blocks and define strings.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category WGSL
 */
class ShaderVariantGenerator {
    #variantCache = new Map<string, string>();
    #defines: string;
    #conditionalBlocks: ConditionalBlock[];
    #baseTextures: any[] = [];
    #baseSamplers: any[] = [];
    #texturesByUniformName = new Map<string, any[]>();
    #samplersByUniformName = new Map<string, any[]>();

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
     * [KO] 기본 텍스처 및 샘플러 정보를 설정합니다.
     * [EN] Sets the base texture and sampler information.
     * @param textures -
     * [KO] 기본 텍스처 배열
     * [EN] Base textures array
     * @param samplers -
     * [KO] 기본 샘플러 배열
     * [EN] Base samplers array
     */
    setBaseInfo(textures: any[], samplers: any[]) {
        this.#baseTextures = textures;
        this.#baseSamplers = samplers;
    }

    /**
     * [KO] 특정 유니폼 키에 연결된 텍스처 및 샘플러 정보를 추가합니다.
     * [EN] Adds texture and sampler information associated with a specific globalStruct key.
     * @param uniformName -
     * [KO] 유니폼 이름
     * [EN] Uniform name
     * @param textures -
     * [KO] 해당 조건에서 활성화될 텍스처 배열
     * [EN] Textures array to be activated in this condition
     * @param samplers -
     * [KO] 해당 조건에서 활성화될 샘플러 배열
     * [EN] Samplers array to be activated in this condition
     */
    addConditionalInfo(uniformName: string, textures: any[], samplers: any[]) {
        this.#texturesByUniformName.set(uniformName, textures);
        this.#samplersByUniformName.set(uniformName, samplers);
    }

    /**
     * [KO] 특정 변형 키에 활성화된 텍스처 목록을 반환합니다.
     * [EN] Returns the list of textures activated for a specific variant key.
     * @param variantKey -
     * [KO] 변형 키
     * [EN] Variant key
     * @returns
     * [KO] 활성화된 텍스처 배열
     * [EN] Activated textures array
     */
    getVariantTextures(variantKey: string): any[] {
        const enabledKeys = variantKey === 'none' ? [] : variantKey.split('+');
        const result = [...this.#baseTextures];
        enabledKeys.forEach(key => {
            const extra = this.#texturesByUniformName.get(key);
            if (extra) {
                extra.forEach(t => {
                    if (!result.find(rt => rt.name === t.name)) result.push(t);
                });
            }
        });
        return result;
    }

    /**
     * [KO] 특정 변형 키에 활성화된 샘플러 목록을 반환합니다.
     * [EN] Returns the list of samplers activated for a specific variant key.
     * @param variantKey -
     * [KO] 변형 키
     * [EN] Variant key
     * @returns
     * [KO] 활성화된 샘플러 배열
     * [EN] Activated samplers array
     */
    getVariantSamplers(variantKey: string): any[] {
        const enabledKeys = variantKey === 'none' ? [] : variantKey.split('+');
        const result = [...this.#baseSamplers];
        enabledKeys.forEach(key => {
            const extra = this.#samplersByUniformName.get(key);
            if (extra) {
                extra.forEach(s => {
                    if (!result.find(rs => rs.name === s.name)) result.push(s);
                });
            }
        });
        return result;
    }

    /**
     * [KO] 모든 가능한 텍스처 목록(합집합)을 반환합니다.
     * [EN] Returns the list of all possible textures (union).
     * @returns
     * [KO] 모든 텍스처 배열
     * [EN] All textures array
     */
    getUnionTextures(): any[] {
        const result = [...this.#baseTextures];
        this.#texturesByUniformName.forEach(textures => {
            textures.forEach(t => {
                if (!result.find(rt => rt.name === t.name)) result.push(t);
            });
        });
        return result;
    }

    /**
     * [KO] 모든 가능한 샘플러 목록(합집합)을 반환합니다.
     * [EN] Returns the list of all possible samplers (union).
     * @returns
     * [KO] 모든 샘플러 배열
     * [EN] All samplers array
     */
    getUnionSamplers(): any[] {
        const result = [...this.#baseSamplers];
        this.#samplersByUniformName.forEach(samplers => {
            samplers.forEach(s => {
                if (!result.find(rs => rs.name === s.name)) result.push(s);
            });
        });
        return result;
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
        const cached = this.#variantCache.get(variantKey);
        if (cached !== undefined) {
            return cached;
        }
        const enabledKeys = variantKey === 'none' ? [] : variantKey.split('+');
        const variantCode = this.#processConditionalBlocks(enabledKeys);
        this.#variantCache.set(variantKey, variantCode);
        return variantCode;
    }

    /**
     * [KO] 현재 캐시된 변형 키 목록을 반환합니다.
     * [EN] Returns the list of currently cached variant keys.
     * @returns
     * [KO] 캐시된 변형 키 배열
     * [EN] Cached variant keys array
     */
    getCachedVariants(): string[] {
        return Array.from(this.#variantCache.keys());
    }

    /**
     * [KO] 캐시된 변형 코드 및 내부 텍스처/샘플러 맵들의 참조를 명시적으로 해제합니다.
     * [EN] Explicitly releases references to cached variant codes and internal texture/sampler maps.
     */
    destroy() {
        this.#variantCache.clear();
        this.#baseTextures = [];
        this.#baseSamplers = [];
        this.#texturesByUniformName.clear();
        this.#samplersByUniformName.clear();
        this.#defines = '';
        this.#conditionalBlocks = [];
    }

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

Object.freeze(ShaderVariantGenerator);
export default ShaderVariantGenerator;