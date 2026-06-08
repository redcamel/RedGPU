import applyProperties from "../../core/applyProperties";
import defineVector from "../../core/defineVector";

export interface IDefineVector2 {
    key: string;
    value?: [number, number];
}

function defineVector2_func(propertyInfo: IDefineVector2) {
    return defineVector(propertyInfo.key, propertyInfo.value ?? [0, 0]);
}

/**
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 2차원 벡터(Vector2) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 해당 속성의 getter/setter는 숫자 2개를 가진 튜플 배열(`[number, number]`)을 다룹니다.
 * - 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼를 업데이트합니다.
 *
 * **[EN]**
 * - Handles a 2-tuple array (`[number, number]`).
 * - Automatically updates the GPU uniform buffer on value change.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link IDefineVector2} 설정 또는 그 배열 [EN] A single {@link IDefineVector2} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineVector2(MyMaterial, { key: 'uvScale', value: [1, 1] });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineVector2(MyMaterial, [
 *   { key: 'uvOffset', value: [0, 0] },
 *   { key: 'tiling', value: [2, 2] }
 * ]);
 * ```
 */
const defineVector2 = (target: any, defineInfo: IDefineVector2 | IDefineVector2[]) => applyProperties(target, defineInfo, defineVector2_func);

Object.freeze(defineVector2)
export default defineVector2;
