/**
 * [KO] `defineColorRGB` 함수에 전달할 RGB 색상 프로퍼티 정의 옵션 인터페이스입니다.
 * [EN] Interface defining RGB color property options for the `defineColorRGB` function.
 *
 * @category DefineProperty
 */
export interface DefineColorRGBInfo {
    /**
     * [KO] 대상 프로토타입에 정의할 프로퍼티 키 이름입니다.
     * [EN] Property key name to define on the target prototype.
     */
    key: string;
    /**
     * [KO] 초기 16진수 색상 코드 문자열(예: `'#ff0000'`)입니다. 기본값은 `'#fff'`입니다.
     * [EN] Initial hex color code string (e.g., `'#ff0000'`). Default is `'#fff'`.
     */
    value?: string;
}
/**
 * [KO] 대상 클래스의 프로토타입에 GPU 유니폼 버퍼와 연동되는 `ColorRGB` 프로퍼티를 동적으로 정의합니다.
 * [EN] Dynamically defines `ColorRGB` properties linked to the GPU uniform buffer on the target class prototype.
 *
 * [KO] Setter는 16진수 색상 문자열(예: `'#ff0000'`) 또는 `ColorRGB` 인스턴스를 허용하며, 값 변경 시 정규화된 선형 RGB 값(`rgbNormalLinear`)을 유니폼 버퍼에 자동 기록합니다.
 * [EN] The setter accepts a hex color string (e.g., `'#ff0000'`) or a `ColorRGB` instance, automatically writing normalized linear RGB values (`rgbNormalLinear`) to the uniform buffer on change.
 *
 * ### Example
 * ```typescript
 * // [KO] 단일 RGB 색상 프로퍼티 정의
 * // [EN] Define a single RGB color property
 * RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, { key: 'albedoColor', value: '#ff0000' });
 *
 * // [KO] 다중 RGB 색상 프로퍼티 일괄 정의
 * // [EN] Define multiple RGB color properties at once
 * RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, [
 *     { key: 'emissiveColor', value: '#000000' },
 *     { key: 'specularColor', value: '#ffffff' }
 * ]);
 * ```
 *
 * @param target -
 * [KO] 프로퍼티를 정의할 대상 클래스 생성자
 * [EN] Target class constructor to define properties on
 * @param defineInfo -
 * [KO] 단일 `DefineColorRGBInfo` 설정 객체 또는 설정 배열
 * [EN] Single `DefineColorRGBInfo` configuration object or array of configurations
 * @category DefineProperty
 */
declare const defineColorRGB: (target: any, defineInfo: DefineColorRGBInfo | DefineColorRGBInfo[]) => void;
export default defineColorRGB;
