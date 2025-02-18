/**
 * GPU address mode options for texture sampling and wrapping.
 */
const GPU_ADDRESS_MODE = {
    CLAMP_TO_EDGE: 'clamp-to-edge',
    REPEAT: 'repeat',
    MIRRORED_REPEAT: 'mirror-repeat'
} as const
Object.freeze(GPU_ADDRESS_MODE)
export default GPU_ADDRESS_MODE
