import applyProperties from "../core/applyProperties";
import defineVector from "../core/defineVector";

/**
 * [KO] Vector4 정의를 위한 설정 인터페이스.
 * [EN] Configuration interface for Vector4 definition.
 */
export interface IDefineVec4 {
    /** [KO] 속성 키 이름 [EN] Property key name */
    key: string,
    /** [KO] 초기값 [EN] Initial value */
    value: [number, number, number, number]
}

/**
 * [KO] 개별 Vector4 속성에 대한 속성 기술자(Property Descriptor)를 생성합니다.
 * [EN] Creates a property descriptor for an individual Vector4 property.
 */
function defineVector4_func(propertyKey: string | IDefineVec4, initValue: [number, number, number, number] = [0, 0, 0, 0]) {
    if (typeof propertyKey === 'object') {
        return defineVector(propertyKey.key, propertyKey.value);
    }
    return defineVector(propertyKey, initValue)
}

/**
 * [KO] 지정된 클래스에 Vector4 속성들을 정의합니다.
 * [EN] Defines Vector4 properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 키, 키 배열, 또는 IDefineVec4 배열 [EN] Property key, array of keys, or array of IDefineVec4
 *
 * @example
 * ```typescript
 * // 단일 키 정의 (기본값 [0, 0, 0, 0])
 * DefineProperty.defineVector4(MyMaterial, 'myVec4');
 * // 배열을 이용한 다중 키 정의
 * DefineProperty.defineVector4(MyMaterial, [['vec0', [1, 0, 0, 1]], ['vec1', [0, 1, 0, 1]]]);
 * // IDefineVec4 인터페이스 사용
 * DefineProperty.defineVector4(MyMaterial, [{ key: 'vec0', value: [1, 0, 0, 1] }]);
 * ```
 */
const defineVector4 = (target: any, keys: string | (string | IDefineVec4 | [string, [number, number, number, number]])[]) => applyProperties(target, keys, defineVector4_func);

Object.freeze(defineVector4)
export default defineVector4;
