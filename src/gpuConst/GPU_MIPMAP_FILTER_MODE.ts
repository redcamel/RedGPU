/**
 * GPU_MIPMAP_FILTER_MODE represents the available mipmapping filter modes for GPU textures.
 */
const GPU_MIPMAP_FILTER_MODE = {
	NEAREST: 'nearest',
	LINEAR: 'linear'
} as const
Object.freeze(GPU_MIPMAP_FILTER_MODE)
export default GPU_MIPMAP_FILTER_MODE
