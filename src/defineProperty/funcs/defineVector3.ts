import applyProperties from "../core/applyProperties";
import defineVector from "../core/defineVector";

export interface IDefineVector3 {
    key: string;
    value?: [number, number, number];
}

function defineVector3_func(propertyKey: IDefineVector3) {
    return defineVector(propertyKey.key, propertyKey.value ?? [0, 0, 0]);
}

/**
 * [KO] 지정된 클래스에 Vector3 속성들을 정의합니다.
 * [EN] Defines Vector3 properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 설정(IDefineVector3) 또는 설정 배열 [EN] Configuration (IDefineVector3) or array of configurations
 *
 * @example
 * ```typescript
 * // 설정 객체 방식 (IDefineVector3)
 * DefineUniformProperty.defineVector3(MyMaterial, { key: 'vec0', value: [1, 0, 0] });
 * DefineUniformProperty.defineVector3(MyMaterial, [{ key: 'vec0', value: [1, 0, 0] }]);
 * ```
 */
const defineVector3 = (target: any, keys: IDefineVector3 | IDefineVector3[]) => applyProperties(target, keys, defineVector3_func);

Object.freeze(defineVector3)
export default defineVector3;
