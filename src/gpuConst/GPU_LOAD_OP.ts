/**
 * GPU_LOAD_OP represents the available options for load operations in GPU.
 *
 * @property {string} LOAD - Represents that the GPU should load the previous content at the specified location.
 * @property {string} CLEAR - Represents that the GPU should clear the previous content at the specified location.
 */
const GPU_LOAD_OP = {
    LOAD: 'load',
    CLEAR: 'clear',
} as const
Object.freeze(GPU_LOAD_OP)
export default GPU_LOAD_OP
