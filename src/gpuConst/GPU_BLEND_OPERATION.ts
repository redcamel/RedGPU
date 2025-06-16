/**
 * The GPU blend operation options.
 */
const GPU_BLEND_OPERATION = {
	ADD: "add",
	SUBTRACT: "subtract",
	REVERSE_SUBTRACT: "reverse-subtract",
	MIN: "min",
	MAX: "max",
} as const;
Object.freeze(GPU_BLEND_OPERATION)
export default GPU_BLEND_OPERATION
