/**
 * `defineColorRGBA` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.
 */
export interface DefineColorRGBAInfo {
    /**
     * [KO] 속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.
     * [EN] Key name of the property. Defined on the target object's prototype under this name.
     */
    key: string;
    /**
     * [KO] 초기 16진수 색상 코드값 (예: `#ff0000`). 지정하지 않을 경우 기본값은 `#fff`입니다.
     * [EN] Initial hex color code (e.g., `#ff0000`). If not specified, defaults to `#fff`.
     */
    value?: string;
}
/**
 * 지정된 클래스의 프로토타입에 GPU와 연동되는 RGBA 색상(ColorRGBA) 속성을 정의합니다.
 *
 * @remarks
 * **[KO]**
 * - 해당 속성의 getter는 {@link ColorRGBA} 인스턴스를 반환합니다.
 * - setter는 16진수 문자열(예: `#ff0000`) 또는 {@link ColorRGBA} 인스턴스를 허용합니다.
 * - 값이 설정되거나 내부 RGBA(알파 포함) 값이 바뀌면 감지하여 자동으로 GPU의 유니폼 버퍼에 정규화된 선형 RGBA 값(rgbaNormalLinear)을 업데이트합니다.
 *
 * **[EN]**
 * - The getter returns a {@link ColorRGBA} instance.
 * - The setter accepts a hex color string (e.g. `#ff0000`) or a {@link ColorRGBA} instance.
 * - When the value changes, it automatically normalizes and writes to the GPU uniform buffer as linear RGBA values (rgbaNormalLinear).
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param defineInfo - [KO] 단일 {@link DefineColorRGBAInfo} 설정 또는 그 배열 [EN] A single {@link DefineColorRGBAInfo} configuration or an array of configurations
 *
 * @example
 * ```typescript
 * // 단일 설정
 * RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, { key: 'diffuseColor', value: '#ff0000' });
 *
 * // 여러 속성 일괄 정의
 * RedGPU.DefineGPUProperty.defineColorRGBA(MyMaterial, [
 *   { key: 'ambientColor', value: '#111111' },
 *   { key: 'specularColor', value: '#ffffff' }
 * ]);
 * ```
 */
declare const defineColorRGBA: (target: any, defineInfo: DefineColorRGBAInfo | DefineColorRGBAInfo[]) => void;
export default defineColorRGBA;
