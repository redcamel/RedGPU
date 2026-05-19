import applyProperties from "../core/applyProperties";
import defineVector from "../core/defineVector";

export interface IDefineVec3 {
    key: string,
    value: [number, number, number]
}

function defineVector3_func(propertyKey: string | IDefineVec3, initValue: [number, number, number] = [0, 0, 0]) {
    if (typeof propertyKey === 'object') {
        return defineVector(propertyKey.key, propertyKey.value);
    }
    return defineVector(propertyKey, initValue)
}

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
 * // IDefineVec3 인터페이스 사용
 * DefineProperty.defineVector3(MyMaterial, [{ key: 'vec0', value: [1, 0, 0] }]);
 * ```
 */
const defineVector3 = (target: any, keys: string | (string | IDefineVec3 | [string, [number, number, number]])[]) => applyProperties(target, keys, defineVector3_func);

Object.freeze(defineVector3)
export default defineVector3;
