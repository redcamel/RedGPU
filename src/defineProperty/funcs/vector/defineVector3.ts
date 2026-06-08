import applyProperties from "../../core/applyProperties";
import defineVector from "../../core/defineVector";

export interface IDefineVector3 {
    key: string;
    value?: [number, number, number];
}

function defineVector3_func(propertyInfo: IDefineVector3) {
    return defineVector(propertyInfo.key, propertyInfo.value ?? [0, 0, 0]);
}

/**
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 3차원 벡터(Vector3) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 해당 속성의 getter/setter는 숫자 3개를 가진 튜플 배열(`[number, number, number]`)을 다룹니다.
 * - 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼를 업데이트합니다.
 *
 * **[EN]**
 * - Handles a 3-tuple array (`[number, number, number]`).
 * - Automatically updates the GPU uniform buffer on value change.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link IDefineVector3} 설정 또는 그 배열 [EN] A single {@link IDefineVector3} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineVector3(MyMaterial, { key: 'lightPosition', value: [0, 10, 0] });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineVector3(MyMaterial, [
 *   { key: 'direction', value: [0, -1, 0] },
 *   { key: 'gravity', value: [0, -9.8, 0] }
 * ]);
 * ```
 */
const defineVector3 = (target: any, defineInfo: IDefineVector3 | IDefineVector3[]) => applyProperties(target, defineInfo, defineVector3_func);

Object.freeze(defineVector3)
export default defineVector3;
