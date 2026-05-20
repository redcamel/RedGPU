import applyProperties from "../../core/applyProperties";
import defineVector from "../../core/defineVector";

export interface IDefineVector2 {
    key: string;
    value?: [number, number];
}

function defineVector2_func(propertyKey: IDefineVector2) {
    return defineVector(propertyKey.key, propertyKey.value ?? [0, 0]);
}

/**
 * [KO] 지정된 클래스에 Vector2 속성들을 정의합니다.
 * [EN] Defines Vector2 properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 설정(IDefineVector2) 또는 설정 배열 [EN] Configuration (IDefineVector2) or array of configurations
 *
 * @example
 * ```typescript
 * // 설정 객체 방식 (IDefineVector2)
 * DefineUniformProperty.defineVector2(MyMaterial, { key: 'vec0', value: [1, 0] });
 * DefineUniformProperty.defineVector2(MyMaterial, [{ key: 'vec0', value: [1, 0] }]);
 * ```
 */
const defineVector2 = (target: any, keys: IDefineVector2 | IDefineVector2[]) => applyProperties(target, keys, defineVector2_func);

Object.freeze(defineVector2)
export default defineVector2;
