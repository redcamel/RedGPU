/**
 * Represents the available index formats for GPUs.
 * Each format is associated with its corresponding string representation.
 *
 * @typedef {Object} GPU_INDEX_FORMAT
 *
 * @property {string} UINT16 - The uint16 index format.
 * @property {string} UINT32 - The uint32 index format.
 */
const GPU_INDEX_FORMAT = {
	UINT16: 'uint16',
	UINT32: 'uint32'
} as const
Object.freeze(GPU_INDEX_FORMAT)
export default GPU_INDEX_FORMAT
