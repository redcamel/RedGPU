/**
 * `defineUint` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.
 */
export interface DefineUintInfo {
    /**
     * [KO] 속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.
     * [EN] Key name of the property. Defined on the target object's prototype under this name.
     */
    key: string;
    /**
     * [KO] 속성의 초기 부호 없는 정수(Uint) 값.
     * [EN] Initial unsigned integer (Uint) value of the property.
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
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 부호 없는 정수(Uint) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 값 설정 시 {@link validateUintRange}를 통해 0 이상의 정수(unsigned integer)인지 검사합니다.
 * - 범위 외의 정수나 실수가 들어오면 `console.warn` 경고를 출력한 후 최소/최대 범위 및 정수 값으로 조절하여 저장하고 GPU 버퍼에 반영합니다.
 *
 * **[EN]**
 * - Validates that the input is an unsigned integer (>= 0) via {@link validateUintRange}.
 * - Values outside the range print a `console.warn` and are clamped/adjusted before writing to the GPU buffer.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link DefineUintInfo} 설정 또는 그 배열 [EN] A single {@link DefineUintInfo} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineUint(MyMaterial, { key: 'lightType', value: 1, min: 0, max: 10 });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineUint(MyMaterial, [
 *   { key: 'shadowMode', value: 0 },
 *   { key: 'maxLights', value: 4, min: 0, max: 16 }
 * ]);
 * ```
 */
declare const defineUint: (target: any, defineInfo: DefineUintInfo | DefineUintInfo[]) => void;
export default defineUint;
