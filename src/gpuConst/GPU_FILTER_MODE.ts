/**
 * GPU_FILTER_MODE represents the available filter modes for GPU filtering.
 */
const GPU_FILTER_MODE = {
    NEAREST: 'nearest',
    LINEAR: 'linear'
} as const
Object.freeze(GPU_FILTER_MODE)
export default GPU_FILTER_MODE
