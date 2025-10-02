import { ConditionalBlock } from "./preprocessWGSL";
/**
 * 조건부 블록과 define 문자열을 기반으로 WGSL 셰이더의 다양한 변형(variant) 코드를 생성하는 유틸리티.
 *
 * 변형 키(variantKey)에 따라 조건부 블록을 처리하여, 각기 다른 쉐이더 소스를 동적으로 생성하고 캐싱합니다.

 */
declare class ShaderVariantGenerator {
    #private;
    /**
     * ShaderVariantGenerator 생성자
     * @param defines - WGSL 셰이더의 define 문자열(기본 소스)
     * @param conditionalBlocks - 조건부 블록 정보 배열
     */
    constructor(defines: string, conditionalBlocks: ConditionalBlock[]);
    /**
     * 특정 변형 키에 대한 셰이더 코드를 레이지하게 생성합니다.
     *
     * @param variantKey - 활성화할 조건부 키를 '+'로 연결한 문자열(예: "FOO+BAR"), 조건이 없으면 'none'
     * @returns 변형된 WGSL 셰이더 코드 문자열
     */
    getVariant(variantKey: string): string;
    /**
     * 현재 캐시된 변형 키 목록을 반환합니다.
     *
     * @returns 캐시된 variantKey 문자열 배열
     */
    getCachedVariants(): string[];
}
export default ShaderVariantGenerator;
