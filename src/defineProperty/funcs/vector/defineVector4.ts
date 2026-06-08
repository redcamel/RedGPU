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
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 4차원 벡터(Vector4) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 해당 속성의 getter/setter는 숫자 4개를 가진 튜플 배열(`[number, number, number, number]`)을 다룹니다.
 * - 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼를 업데이트합니다.
 *
 * **[EN]**
 * - Handles a 4-tuple array (`[number, number, number, number]`).
 * - Automatically updates the GPU uniform buffer on value change.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link IDefineVector4} 설정 또는 그 배열 [EN] A single {@link IDefineVector4} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineVector4(MyMaterial, { key: 'lightColor', value: [1, 1, 1, 1] });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineVector4(MyMaterial, [
 *   { key: 'tilingAndOffset', value: [1, 1, 0, 0] },
 *   { key: 'viewport', value: [0, 0, 1920, 1080] }
 * ]);
 * ```
 */
const defineVector4 = (target: any, defineInfo: IDefineVector4 | IDefineVector4[]) => applyProperties(target, defineInfo, defineVector4_func);

Object.freeze(defineVector4)
export default defineVector4;
