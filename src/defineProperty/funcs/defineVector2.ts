import applyProperties from "../core/applyProperties";
import defineVector from "../core/defineVector";

/**
 * [KO] Vector2 정의를 위한 설정 인터페이스.
 * [EN] Configuration interface for Vector2 definition.
 */
export interface IDefineVec2 {
    /** [KO] 속성 키 이름 [EN] Property key name */
    key: string,
    /** [KO] 초기값 [EN] Initial value */
    value: [number, number]
}

/**
 * [KO] 개별 Vector2 속성에 대한 속성 기술자(Property Descriptor)를 생성합니다.
 * [EN] Creates a property descriptor for an individual Vector2 property.
 */
function defineVector2_func(propertyKey: string | IDefineVec2, initValue: [number, number] = [0, 0]) {
    if (typeof propertyKey === 'object') {
        return defineVector(propertyKey.key, propertyKey.value);
    }
    return defineVector(propertyKey, initValue)
}

/**
 * [KO] 지정된 클래스에 Vector2 속성들을 정의합니다.
 * [EN] Defines Vector2 properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 키, 키 배열, 또는 IDefineVec2 배열 [EN] Property key, array of keys, or array of IDefineVec2
 *
 * @example
 * ```typescript
 * // 단일 키 정의 (기본값 [0, 0])
 * DefineProperty.defineVector2(MyMaterial, 'myVec2');
 * // 배열을 이용한 다중 키 정의
 * DefineProperty.defineVector2(MyMaterial, ['vec0', 'vec1']);
 * // 초기값과 함께 정의
 * DefineProperty.defineVector2(MyMaterial, [['vec0', [1, 0]], ['vec1', [0, 1]]]);
 * // IDefineVec2 인터페이스 사용
 * DefineProperty.defineVector2(MyMaterial, [{ key: 'vec0', value: [1, 0] }]);
 * ```
 */
const defineVector2 = (target: any, keys: string | (string | IDefineVec2 | [string, [number, number]])[]) => applyProperties(target, keys, defineVector2_func);

Object.freeze(defineVector2)
export default defineVector2;
