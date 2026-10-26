/**
 * [KO] 깊이(Depth)·스텐실(Stencil) 테스트 및 그림자 비교 샘플러(Comparison Sampler)에서 사용하는 비교 연산 함수 상수입니다.
 * [EN] Comparison function constants used in depth/stencil tests and shadow comparison samplers.
 *
 * @category Constants
 */
declare const GPU_COMPARE_FUNCTION: {
    /**
     * [KO] 비교 테스트가 항상 실패합니다. (`false`)
     * [EN] Comparison test always fails. (`false`)
     */
    readonly NEVER: "never";
    /**
     * [KO] 새로운 값이 기존 값보다 작을 때 통과합니다. (`new < existing`)
     * [EN] Passes if the new value is strictly less than the existing value. (`new < existing`)
     */
    readonly LESS: "less";
    /**
     * [KO] 새로운 값이 기존 값과 같을 때 통과합니다. (`new == existing`)
     * [EN] Passes if the new value is equal to the existing value. (`new == existing`)
     */
    readonly EQUAL: "equal";
    /**
     * [KO] 새로운 값이 기존 값보다 작거나 같을 때 통과합니다. (`new <= existing`)
     * [EN] Passes if the new value is less than or equal to the existing value. (`new <= existing`)
     */
    readonly LESS_EQUAL: "less-equal";
    /**
     * [KO] 새로운 값이 기존 값보다 클 때 통과합니다. (`new > existing`)
     * [EN] Passes if the new value is strictly greater than the existing value. (`new > existing`)
     */
    readonly GREATER: "greater";
    /**
     * [KO] 새로운 값이 기존 값과 다를 때 통과합니다. (`new != existing`)
     * [EN] Passes if the new value is not equal to the existing value. (`new != existing`)
     */
    readonly NOT_EQUAL: "not-equal";
    /**
     * [KO] 새로운 값이 기존 값보다 크거나 같을 때 통과합니다. (`new >= existing`)
     * [EN] Passes if the new value is greater than or equal to the existing value. (`new >= existing`)
     */
    readonly GREATER_EQUAL: "greater-equal";
    /**
     * [KO] 비교 테스트가 항상 통과합니다. (`true`)
     * [EN] Comparison test always passes. (`true`)
     */
    readonly ALWAYS: "always";
};
export default GPU_COMPARE_FUNCTION;
