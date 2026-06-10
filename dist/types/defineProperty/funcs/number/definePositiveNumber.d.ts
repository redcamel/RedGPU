/**
 * `definePositiveNumber` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.
 */
export interface DefinePositiveNumberInfo {
    /**
     * [KO] 속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.
     * [EN] Key name of the property. Defined on the target object's prototype under this name.
     */
    key: string;
    /**
     * [KO] 속성의 초기 양수값.
     * [EN] Initial positive numeric value of the property.
     */
    value: number;
    /**
     * [KO] 허용할 최소값 (옵션, 기본값 0). 설정 범위 미만의 값이 setter에 할당되면 경고를 내고 이 값으로 고정됩니다.
     * [EN] Optional minimum allowed value (defaults to 0). Assigning a value below this limit will log a warning and clamp it.
     */
    min?: number;
    /**
     * [KO] 허용할 최대값 (옵션). 설정 범위 초과의 값이 setter에 할당되면 경고를 내고 이 값으로 고정됩니다.
     * [EN] Optional maximum allowed value. Assigning a value above this limit will log a warning and clamp it.
     */
    max?: number;
}
/**
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 양수(Positive Number) 범위 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 값 설정 시 {@link validatePositiveNumberRange}를 통해 0 이상의 양수인지 검사합니다.
 * - 최소값 `min`은 0 이상이어야 하며 기본값은 0입니다. `max`가 제공된 경우 최대값을 넘지 못하도록 클램핑(Clamping)합니다.
 * - 범위 외의 값이 할당되면 `console.warn` 경고를 출력한 후 최소/최대값 한계치로 조정하여 저장하고 GPU 버퍼에 반영합니다.
 *
 * **[EN]**
 * - Validates that the input is a positive number (>= 0) via {@link validatePositiveNumberRange}.
 * - The minimum value `min` defaults to 0. Clamps the value if it exceeds `max` (if provided).
 * - Values outside the range print a `console.warn` and are clamped before writing to the GPU buffer.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link DefinePositiveNumberInfo} 설정 또는 그 배열 [EN] A single {@link DefinePositiveNumberInfo} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.definePositiveNumber(MyMaterial, { key: 'shininess', value: 30, min: 0, max: 100 });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.definePositiveNumber(MyMaterial, [
 *   { key: 'fogDensity', value: 0.01, min: 0 },
 *   { key: 'roughness', value: 0.5, min: 0, max: 1 }
 * ]);
 * ```
 */
declare const definePositiveNumber: (target: any, defineInfo: DefinePositiveNumberInfo | DefinePositiveNumberInfo[]) => void;
export default definePositiveNumber;
