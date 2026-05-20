import applyProperties from "../../core/applyProperties";
import defineVector from "../../core/defineVector";

export interface IDefineVector4 {
    key: string;
    value?: [number, number, number, number];
}

function defineVector4_func(propertyInfo: IDefineVector4) {
    return defineVector(propertyInfo.key, propertyInfo.value ?? [0, 0, 0, 0]);
}

/**
 * [KO] 지정된 클래스에 Vector4 속성들을 정의합니다.
 * [EN] Defines Vector4 properties on the specified class.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 정의할 속성 설정(IDefineVector4) 또는 설정 배열 [EN] Configuration (IDefineVector4) or array of configurations
 *
 * @example
 * ```typescript
 * // 설정 객체 방식 (IDefineVector4)
 * DefineUniformProperty.defineVector4(MyMaterial, { key: 'vec0', value: [1, 0, 0, 1] });
 * DefineUniformProperty.defineVector4(MyMaterial, [{ key: 'vec0', value: [1, 0, 0, 1] }]);
 * ```
 */
const defineVector4 = (target: any, defineInfo: IDefineVector4 | IDefineVector4[]) => applyProperties(target, defineInfo, defineVector4_func);

Object.freeze(defineVector4)
export default defineVector4;
