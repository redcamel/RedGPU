/**
 * GPU_COMPARE_FUNCTION represents the available compare functions for GPU operations.
 */
const GPU_COMPARE_FUNCTION = {
	NEVER: 'never',
	LESS: 'less',
	EQUAL: 'equal',
	LESS_EQUAL: 'less-equal',
	GREATER: 'greater',
	NOT_EQUAL: 'not-equal',
	GREATER_EQUAL: 'greater-equal',
	ALWAYS: 'always',
} as const
Object.freeze(GPU_COMPARE_FUNCTION)
export default GPU_COMPARE_FUNCTION



