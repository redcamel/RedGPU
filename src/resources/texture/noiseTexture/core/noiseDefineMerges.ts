/**
 * [KO] 기본 유니폼 구조체 정의 문자열과 추가 정의 문자열을 줄바꿈으로 병합합니다.
 * [EN] Merges the base uniform struct definition string with an additional definition string using line breaks.
 *
 * ### Example
 * ```typescript
 * const struct = RedGPU.Resource.CoreNoiseTexture.mergerNoiseUniformStruct('frequency: f32,', 'seed: f32,');
 * ```
 *
 * @param baseStruct -
 * [KO] 기본 유니폼 구조체 멤버 정의 (WGSL)
 * [EN] Base uniform struct member definitions (WGSL)
 * @param addStruct -
 * [KO] 추가할 유니폼 구조체 멤버 정의 (WGSL, 비어 있으면 무시)
 * [EN] Additional uniform struct member definitions to append (WGSL, ignored if empty)
 * @returns
 * [KO] 병합된 유니폼 구조체 정의 문자열
 * [EN] Merged uniform struct definition string
 */
const mergerNoiseUniformStruct = (baseStruct: string, addStruct: string): string => {
    return [baseStruct, addStruct].filter(Boolean).join('\n')
}
/**
 * [KO] 기본 유니폼 기본값 객체와 추가 기본값 객체를 얕은 병합하여 새 객체를 반환합니다.
 * [EN] Shallow-merges the base uniform default object with an additional default object and returns a new object.
 *
 * [KO] 동일한 키가 존재하면 `addOption`의 값이 우선합니다.
 * [EN] If the same key exists, the value from `addOption` takes precedence.
 *
 * @param basicOption -
 * [KO] 기본 유니폼 기본값 객체
 * [EN] Base uniform default object
 * @param addOption -
 * [KO] 추가 유니폼 기본값 객체 (선택)
 * [EN] Additional uniform default object (optional)
 * @returns
 * [KO] 병합된 유니폼 기본값 객체
 * [EN] Merged uniform default object
 */
const mergerNoiseUniformDefault = (basicOption, addOption) => {
    return {
        ...basicOption,
        ...(addOption || {}),
    }
}
/**
 * [KO] 기본 WGSL 헬퍼 함수 코드와 추가 헬퍼 함수 코드를 줄바꿈으로 병합합니다.
 * [EN] Merges the base WGSL helper function code with additional helper function code using line breaks.
 *
 * @param baseHelperFunctions -
 * [KO] 기본 WGSL 헬퍼 함수 코드
 * [EN] Base WGSL helper function code
 * @param addHelperFunctions -
 * [KO] 추가할 WGSL 헬퍼 함수 코드 (비어 있으면 무시)
 * [EN] Additional WGSL helper function code to append (ignored if empty)
 * @returns
 * [KO] 병합된 WGSL 헬퍼 함수 코드
 * [EN] Merged WGSL helper function code
 */
const mergerNoiseHelperFunctions = (baseHelperFunctions: string, addHelperFunctions: string): string => {
    return [baseHelperFunctions, addHelperFunctions].filter(Boolean).join('\n')
}
export {
    mergerNoiseUniformStruct,
    mergerNoiseUniformDefault,
    mergerNoiseHelperFunctions
}
