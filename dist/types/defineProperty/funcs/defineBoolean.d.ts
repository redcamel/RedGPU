/**
 * [KO] `defineBoolean` 함수에 전달할 불리언 프로퍼티 정의 옵션 인터페이스입니다.
 * [EN] Interface defining boolean property options for the `defineBoolean` function.
 *
 * @category DefineProperty
 */
export interface DefineBooleanInfo {
    /**
     * [KO] 대상 프로토타입에 정의할 프로퍼티 키 이름입니다.
     * [EN] Property key name to define on the target prototype.
     */
    key: string;
    /**
     * [KO] 프로퍼티의 초기 불리언 값입니다.
     * [EN] Initial boolean value of the property.
     */
    value: boolean;
}
/**
 * [KO] 대상 클래스의 프로토타입에 GPU 유니폼 버퍼와 연동되는 불리언(`boolean`) 프로퍼티를 동적으로 정의합니다.
 * [EN] Dynamically defines boolean (`boolean`) properties linked to the GPU uniform buffer on the target class prototype.
 *
 * [KO] 값 변경 시 GPU 유니폼 버퍼에는 `1`(`true`) 또는 `0`(`false`)으로 변환되어 기록되며, `dirtyPipeline` 플래그를 `true`로 갱신합니다.
 * [EN] On value change, writes `1` (`true`) or `0` (`false`) to the GPU uniform buffer and sets the `dirtyPipeline` flag to `true`.
 *
 * ### Example
 * ```typescript
 * // [KO] 단일 불리언 프로퍼티 정의
 * // [EN] Define a single boolean property
 * RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, { key: 'useAlphaTest', value: true });
 *
 * // [KO] 다중 불리언 프로퍼티 일괄 정의
 * // [EN] Define multiple boolean properties at once
 * RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, [
 *     { key: 'useAlphaTest', value: true },
 *     { key: 'useNormalMap', value: false }
 * ]);
 * ```
 *
 * @param target -
 * [KO] 프로퍼티를 정의할 대상 클래스 생성자
 * [EN] Target class constructor to define properties on
 * @param defineInfo -
 * [KO] 단일 `DefineBooleanInfo` 설정 객체 또는 설정 배열
 * [EN] Single `DefineBooleanInfo` configuration object or array of configurations
 * @category DefineProperty
 */
declare const defineBoolean: (target: any, defineInfo: DefineBooleanInfo | DefineBooleanInfo[]) => void;
export default defineBoolean;
