import defineSampler from "./funcs/defineSampler";

/**
 * [KO] 클래스 프로토타입에 속성 정의 로직을 일괄 적용하는 내부 헬퍼 함수입니다.
 * [EN] Internal helper function that batch-applies property definition logic to a class prototype.
 * @param target
 * @param keys
 * @param definer
 */
const applyProperties = (target: any, keys: any | any[], definer: Function) => {
    const keyList = Array.isArray(keys) ? keys : [keys];
    keyList.forEach(keyInfo => {
        if (Array.isArray(keyInfo)) {
            const [key, ...args] = keyInfo;
            Object.defineProperty(target.prototype, key, definer(key, ...args));
        } else {
            Object.defineProperty(target.prototype, keyInfo, definer(keyInfo));
        }
    });
};

/**
 * [KO] RedGPU의 통합 속성 정의 시스템입니다.
 * [EN] Integrated property definition system for RedGPU.
 *
 * [KO] 기존의 DefineForFragment, DefineForVertex를 대체하며, 셰이더 단계에 의존하지 않는 범용적인 속성 정의 기능을 제공합니다.
 * [EN] Replaces the existing DefineForFragment and DefineForVertex, providing general-purpose property definition features independent of shader stages.
 *
 * @namespace DefineProperty
 */
const DefineProperty = {
    /**
     * [KO] 지정된 클래스에 샘플러(Sampler) 속성들을 정의합니다.
     * [EN] Defines sampler properties on the specified class.
     *
     * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
     * @param keys - [KO] 정의할 속성 키 또는 키 배열 [EN] Property key or array of keys to define
     *
     * @example
     * ```typescript
     * // 단일 키 정의
     * DefineProperty.defineSampler(MyMaterial, 'diffuseSampler');
     * // 배열을 이용한 다중 키 정의
     * DefineProperty.defineSampler(MyMaterial, ['sampler0', 'sampler1']);
     * ```
     */
    defineSampler: (target: any, keys: string | string[]) => applyProperties(target, keys, defineSampler),

}
Object.freeze(DefineProperty)
export default DefineProperty

