/**
 * [KO] `defineVector2` 함수에 전달할 속성 정의 옵션 인터페이스입니다.
 * [EN] Interface for property definition options passed to the `defineVector2` function.
 *
 * @category DefineProperty
 */
export interface DefineVector2Info {
    /**
     * [KO] 대상 객체 프로토타입에 정의할 속성 키 이름
     * [EN] Property key name to define on the target object's prototype
     */
    key: string;
    /**
     * [KO] 속성의 초기 2차원 벡터 튜플 값 (기본값: `[0, 0]`)
     * [EN] Initial 2D vector tuple value of the property (default: `[0, 0]`)
     */
    value?: [number, number];
}
/**
 * [KO] 지정된 대상의 프로토타입에 GPU 유니폼 버퍼와 연동되는 2차원 벡터(`[number, number]`) 속성을 정의합니다.
 * [EN] Defines 2D vector (`[number, number]`) properties on the target's prototype that synchronize with the GPU uniform buffer.
 *
 * ### Example
 * ```typescript
 * // [KO] 단일 2차원 벡터 속성 정의
 * // [EN] Define a single 2D vector property
 * RedGPU.DefineGPUProperty.defineVector2(MyMaterial, { key: 'uvScale', value: [1, 1] });
 *
 * // [KO] 다중 2차원 벡터 속성 일괄 정의
 * // [EN] Define multiple 2D vector properties at once
 * RedGPU.DefineGPUProperty.defineVector2(MyMaterial, [
 *   { key: 'uvOffset', value: [0, 0] },
 *   { key: 'tiling', value: [2, 2] }
 * ]);
 * ```
 *
 * @param target -
 * [KO] 속성을 정의할 대상 클래스 또는 프로토타입
 * [EN] Target class or prototype to define properties on
 * @param defineInfo -
 * [KO] 단일 `DefineVector2Info` 설정 또는 설정 배열
 * [EN] Single `DefineVector2Info` configuration or an array of configurations
 * @category DefineProperty
 */
declare const defineVector2: (target: any, defineInfo: DefineVector2Info | DefineVector2Info[]) => void;
export default defineVector2;
