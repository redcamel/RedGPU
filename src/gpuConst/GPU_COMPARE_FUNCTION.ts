/**
 * [KO] 비교 연산 시 사용되는 함수 옵션을 정의하는 상수군입니다.
 * [EN] Constants defining comparison function options.
 *
 * [KO] 깊이 테스트나 스텐실 테스트에서 두 값을 비교하는 방식을 결정합니다.
 * [EN] Determines how two values are compared in depth or stencil tests.
 * 
 * @category Constants
 */
const GPU_COMPARE_FUNCTION = {
	/**
	 * [KO] 비교 테스트를 항상 통과하지 못하게 합니다.
	 * [EN] Causes the comparison test to always fail.
	 */
	NEVER: 'never',
	/**
	 * [KO] 새로운 값이 기존 값보다 작을 때 통과합니다.
	 * [EN] Passes if the new value is less than the existing value.
	 */
	LESS: 'less',
	/**
	 * [KO] 새로운 값이 기존 값과 같을 때 통과합니다.
	 * [EN] Passes if the new value is equal to the existing value.
	 */
	EQUAL: 'equal',
	/**
	 * [KO] 새로운 값이 기존 값보다 작거나 같을 때 통과합니다.
	 * [EN] Passes if the new value is less than or equal to the existing value.
	 */
	LESS_EQUAL: 'less-equal',
	/**
	 * [KO] 새로운 값이 기존 값보다 클 때 통과합니다.
	 * [EN] Passes if the new value is greater than the existing value.
	 */
	GREATER: 'greater',
	/**
	 * [KO] 새로운 값이 기존 값과 다를 때 통과합니다.
	 * [EN] Passes if the new value is not equal to the existing value.
	 */
	NOT_EQUAL: 'not-equal',
	/**
	 * [KO] 새로운 값이 기존 값보다 크거나 같을 때 통과합니다.
	 * [EN] Passes if the new value is greater than or equal to the existing value.
	 */
	GREATER_EQUAL: 'greater-equal',
	/**
	 * [KO] 비교 테스트를 항상 통과하게 합니다.
	 * [EN] Causes the comparison test to always pass.
	 */
	ALWAYS: 'always',
} as const;
Object.freeze(GPU_COMPARE_FUNCTION);
export default GPU_COMPARE_FUNCTION;