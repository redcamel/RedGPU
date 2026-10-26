/**
 * [KO] `defineVector4` 함수에 전달할 속성 정의 옵션 인터페이스입니다.
 * [EN] Interface for property definition options passed to the `defineVector4` function.
 *
 * @category DefineProperty
 */
export interface DefineVector4Info {
    /**
     * [KO] 대상 객체 프로토타입에 정의할 속성 키 이름
     * [EN] Property key name to define on the target object's prototype
     */
    key: string;
    /**
     * [KO] 속성의 초기 4차원 벡터 튜플 값 (기본값: `[0, 0, 0, 0]`)
     * [EN] Initial 4D vector tuple value of the property (default: `[0, 0, 0, 0]`)
     */
    value?: [number, number, number, number];
}
/**
 * [KO] 지정된 대상의 프로토타입에 GPU 유니폼 버퍼와 연동되는 4차원 벡터(`[number, number, number, number]`) 속성을 정의합니다.
 * [EN] Defines 4D vector (`[number, number, number, number]`) properties on the target's prototype that synchronize with the GPU uniform buffer.
 *
 * ### Example
 * ```typescript
 * // [KO] 단일 4차원 벡터 속성 정의
 * // [EN] Define a single 4D vector property
 * RedGPU.DefineGPUProperty.defineVector4(MyMaterial, { key: 'lightColor', value: [1, 1, 1, 1] });
 *
 * // [KO] 다중 4차원 벡터 속성 일괄 정의
 * // [EN] Define multiple 4D vector properties at once
 * RedGPU.DefineGPUProperty.defineVector4(MyMaterial, [
 *   { key: 'tilingAndOffset', value: [1, 1, 0, 0] },
 *   { key: 'viewport', value: [0, 0, 1920, 1080] }
 * ]);
 * ```
 *
 * @param target -
 * [KO] 속성을 정의할 대상 클래스 또는 프로토타입
 * [EN] Target class or prototype to define properties on
 * @param defineInfo -
 * [KO] 단일 `DefineVector4Info` 설정 또는 설정 배열
 * [EN] Single `DefineVector4Info` configuration or an array of configurations
 * @category DefineProperty
 */
declare const defineVector4: (target: any, defineInfo: DefineVector4Info | DefineVector4Info[]) => void;
export default defineVector4;
