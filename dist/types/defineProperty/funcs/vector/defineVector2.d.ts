/**
 * `defineVector2` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.
 */
export interface DefineVector2Info {
    /**
     * [KO] 속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.
     * [EN] Key name of the property. Defined on the target object's prototype under this name.
     */
    key: string;
    /**
     * [KO] 속성의 초기 2차원 숫자 배열 값 (튜플 형태). 기본값은 `[0, 0]`입니다.
     * [EN] Initial 2-dimensional numeric array value (tuple). Defaults to `[0, 0]`.
     */
    value?: [number, number];
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
 * @param defineInfo - [KO] 단일 {@link DefineVector2Info} 설정 또는 그 배열 [EN] A single {@link DefineVector2Info} configuration or an array of configurations
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
declare const defineVector2: (target: any, defineInfo: DefineVector2Info | DefineVector2Info[]) => void;
export default defineVector2;
