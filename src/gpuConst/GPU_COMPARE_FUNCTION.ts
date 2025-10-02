/**
 * GPU 비교 함수 옵션
 *
 * 깊이 테스트, 스텐실 테스트 등에서 사용되는 비교 연산을 정의합니다.
 * 테스트는 `reference [compareFunction] target` 형태로 수행됩니다.
 *
 * @constant
 */
const GPU_COMPARE_FUNCTION = {
	/**
	 * 항상 실패합니다.
	 *
	 * 모든 값에 대해 false를 반환합니다.
	 */
	NEVER: 'never',

	/**
	 * reference < target일 때 통과합니다.
	 *
	 * reference 값이 target 값보다 작으면 true를 반환합니다.
	 */
	LESS: 'less',

	/**
	 * reference == target일 때 통과합니다.
	 *
	 * reference 값과 target 값이 같으면 true를 반환합니다.
	 */
	EQUAL: 'equal',

	/**
	 * reference <= target일 때 통과합니다.
	 *
	 * reference 값이 target 값보다 작거나 같으면 true를 반환합니다.
	 */
	LESS_EQUAL: 'less-equal',

	/**
	 * reference > target일 때 통과합니다.
	 *
	 * reference 값이 target 값보다 크면 true를 반환합니다.
	 */
	GREATER: 'greater',

	/**
	 * reference != target일 때 통과합니다.
	 *
	 * reference 값과 target 값이 다르면 true를 반환합니다.
	 */
	NOT_EQUAL: 'not-equal',

	/**
	 * reference >= target일 때 통과합니다.
	 *
	 * reference 값이 target 값보다 크거나 같으면 true를 반환합니다.
	 */
	GREATER_EQUAL: 'greater-equal',

	/**
	 * 항상 통과합니다.
	 *
	 * 모든 값에 대해 true를 반환합니다.
	 */
	ALWAYS: 'always',
} as const

Object.freeze(GPU_COMPARE_FUNCTION)

export default GPU_COMPARE_FUNCTION
