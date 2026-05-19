import defineSampler from "./funcs/defineSampler";
import defineVector from "./funcs/defineVector";

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
        } else if (typeof keyInfo === 'object' && keyInfo !== null && 'key' in keyInfo) {
            Object.defineProperty(target.prototype, keyInfo.key, definer(keyInfo));
        } else {
            Object.defineProperty(target.prototype, keyInfo, definer(keyInfo));
        }
    });
};
export interface IDefineVec2 {
    key: string,
    value: [number, number]
}

export interface IDefineVec3 {
    key: string,
    value: [number, number, number]
}

export interface IDefineVec4 {
    key: string,
    value: [number, number, number, number]
}

function defineProperty_vec2(propertyKey: string | IDefineVec2, initValue: [number, number] = [0, 0]) {
    if (typeof propertyKey === 'object') {
        return defineVector(propertyKey.key, propertyKey.value);
    }
    return defineVector(propertyKey, initValue)
}

function defineProperty_vec3(propertyKey: string | IDefineVec3, initValue: [number, number, number] = [0, 0, 0]) {
    if (typeof propertyKey === 'object') {
        return defineVector(propertyKey.key, propertyKey.value);
    }
    return defineVector(propertyKey, initValue)
}

function defineProperty_vec4(propertyKey: string | IDefineVec4, initValue: [number, number, number, number] = [0, 0, 0, 0]) {
    if (typeof propertyKey === 'object') {
        return defineVector(propertyKey.key, propertyKey.value);
    }
    return defineVector(propertyKey, initValue)
}

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
    /**
     * [KO] 지정된 클래스에 Vector2 속성들을 정의합니다.
     * [EN] Defines Vector2 properties on the specified class.
     *
     * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
     * @param keys - [KO] 정의할 속성 키, 키 배열, 또는 IDefineVec2 배열 [EN] Property key, array of keys, or array of IDefineVec2
     *
     * @example
     * ```typescript
     * // 단일 키 정의
     * DefineProperty.defineVector2(MyMaterial, 'myVec2');
     * // 배열을 이용한 다중 키 정의
     * DefineProperty.defineVector2(MyMaterial, ['vec0', 'vec1']);
     * // 초기값과 함께 정의
     * DefineProperty.defineVector2(MyMaterial, [['vec0', [1, 0]], ['vec1', [0, 1]]]);
     * // IDefineVec2 인터페이스 사용
     * DefineProperty.defineVector2(MyMaterial, [{ key: 'vec0', value: [1, 0] }]);
     * ```
     */
    defineVector2: (target: any, keys: string | (string | IDefineVec2 | [string, [number, number]])[]) => applyProperties(target, keys, defineProperty_vec2),
    /**
     * [KO] 지정된 클래스에 Vector3 속성들을 정의합니다.
     * [EN] Defines Vector3 properties on the specified class.
     *
     * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
     * @param keys - [KO] 정의할 속성 키, 키 배열, 또는 IDefineVec3 배열 [EN] Property key, array of keys, or array of IDefineVec3
     *
     * @example
     * ```typescript
     * // 단일 키 정의
     * DefineProperty.defineVector3(MyMaterial, 'myVec3');
     * // 배열을 이용한 다중 키 정의
     * DefineProperty.defineVector3(MyMaterial, [['vec0', [1, 0, 0]], ['vec1', [0, 1, 0]]]);
     * ```
     */
    defineVector3: (target: any, keys: string | (string | IDefineVec3 | [string, [number, number, number]])[]) => applyProperties(target, keys, defineProperty_vec3),
    /**
     * [KO] 지정된 클래스에 Vector4 속성들을 정의합니다.
     * [EN] Defines Vector4 properties on the specified class.
     *
     * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
     * @param keys - [KO] 정의할 속성 키, 키 배열, 또는 IDefineVec4 배열 [EN] Property key, array of keys, or array of IDefineVec4
     *
     * @example
     * ```typescript
     * // 단일 키 정의
     * DefineProperty.defineVector4(MyMaterial, 'myVec4');
     * // 배열을 이용한 다중 키 정의
     * DefineProperty.defineVector4(MyMaterial, [['vec0', [1, 0, 0, 1]], ['vec1', [0, 1, 0, 1]]]);
     * ```
     */
    defineVector4: (target: any, keys: string | (string | IDefineVec4 | [string, [number, number, number, number]])[]) => applyProperties(target, keys, defineProperty_vec4),

}

Object.freeze(DefineProperty)
export default DefineProperty

