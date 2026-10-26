/**
 * [KO] `defineNumber` 함수에 전달할 속성 정의 옵션 인터페이스입니다.
 * [EN] Interface for property definition options passed to the `defineNumber` function.
 *
 * @category DefineProperty
 */
export interface DefineNumberInfo {
    /**
     * [KO] 대상 객체 프로토타입에 정의할 속성 키 이름
     * [EN] Property key name to define on the target object's prototype
     */
    key: string;
    /**
     * [KO] 속성의 초기 숫자 값
     * [EN] Initial numeric value of the property
     */
    value: number;
    /**
     * [KO] 허용할 최소값 (선택). 범위 미만의 값이 할당되면 경고를 출력하고 이 값으로 클램핑됩니다.
     * [EN] Optional minimum allowed value. Values below this limit log a warning and are clamped.
     */
    min?: number;
    /**
     * [KO] 허용할 최대값 (선택). 범위 초과의 값이 할당되면 경고를 출력하고 이 값으로 클램핑됩니다.
     * [EN] Optional maximum allowed value. Values above this limit log a warning and are clamped.
     */
    max?: number;
}
/**
 * [KO] 지정된 대상의 프로토타입에 GPU 유니폼 버퍼와 연동되는 숫자(Number) 속성을 정의합니다.
 * [EN] Defines numeric properties on the target's prototype that synchronize with GPU uniform buffers.
 *
 * [KO] 값 할당 시 숫자 유효성 검사를 수행하며, `min` 및 `max` 범위를 벗어나면 경고 출력 후 경계값으로 클램핑하여 유니폼 버퍼를 갱신합니다.
 * [EN] Validates numeric input upon assignment, clamping out-of-bounds values to `min` or `max` with a warning before updating the uniform buffer.
 *
 * ### Example
 * ```typescript
 * // [KO] 단일 숫자 속성 정의 (범위 제한 포함)
 * // [EN] Define a single numeric property (with range limits)
 * RedGPU.DefineGPUProperty.defineNumber(MyMaterial, { key: 'roughness', value: 0.5, min: 0, max: 1 });
 *
 * // [KO] 다중 숫자 속성 일괄 정의
 * // [EN] Define multiple numeric properties at once
 * RedGPU.DefineGPUProperty.defineNumber(MyMaterial, [
 *   { key: 'opacity', value: 1.0, min: 0, max: 1 },
 *   { key: 'shininess', value: 30 }
 * ]);
 * ```
 *
 * @param target -
 * [KO] 속성을 정의할 대상 클래스 또는 프로토타입
 * [EN] Target class or prototype to define properties on
 * @param defineInfo -
 * [KO] 단일 `DefineNumberInfo` 설정 또는 설정 배열
 * [EN] Single `DefineNumberInfo` configuration or an array of configurations
 * @category DefineProperty
 */
declare const defineNumber: (target: any, defineInfo: DefineNumberInfo | DefineNumberInfo[]) => void;
export default defineNumber;
