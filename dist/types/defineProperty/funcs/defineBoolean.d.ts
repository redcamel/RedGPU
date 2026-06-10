/**
 * `defineBoolean` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.
 *
 * @remarks
 * [KO] GPU는 불리언(Boolean)을 직접 지원하지 않으므로, 유니폼 버퍼에 기록 시 정수 0 또는 1로 변환됩니다.
 * [EN] Since GPUs do not natively support booleans, they are converted to 0 or 1 integers when written to the uniform buffer.
 */
export interface DefineBooleanInfo {
    /**
     * [KO] 속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.
     * [EN] Key name of the property. Defined on the target object's prototype under this name.
     */
    key: string;
    /**
     * [KO] 속성의 초기 불리언 값.
     * [EN] Initial boolean value of the property.
     */
    value: boolean;
}
/**
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 사용자 정의 불리언(Boolean) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - GPU 버퍼는 불리언을 지원하지 않으므로, setter는 `true` → `1`, `false` → `0`으로 변환하여 {@link updateTargetUniform}에 전달합니다.
 * - 속성에 `boolean`이 아닌 값을 할당하면 `console.warn`으로 경고합니다.
 * - 값 변경 시 `dirtyPipeline = true`로 설정하여 렌더 파이프라인 재빌드를 트리거합니다.
 *
 * **[EN]**
 * - Since GPU buffers do not support booleans, the setter converts `true` → `1` and `false` → `0` before calling {@link updateTargetUniform}.
 * - Assigning a non-boolean value emits a `console.warn`.
 * - Sets `dirtyPipeline = true` on change to trigger render pipeline rebuild.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link DefineBooleanInfo} 설정 또는 그 배열 [EN] A single {@link DefineBooleanInfo} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, { key: 'useAlphaTest', value: true });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, [
 *   { key: 'useAlphaTest', value: true },
 *   { key: 'useNormalMap', value: false },
 * ]);
 * ```
 */
declare const defineBoolean: (target: any, defineInfo: DefineBooleanInfo | DefineBooleanInfo[]) => void;
export default defineBoolean;
