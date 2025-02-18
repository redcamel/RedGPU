const GPU_PRIMITIVE_TOPOLOGY = {
    POINT_LIST: 'point-list',
    LINE_LIST: 'line-list',
    LINE_STRIP: 'line-strip',
    TRIANGLE_LIST: 'triangle-list',
    TRIANGLE_STRIP: 'triangle-strip',
} as const
Object.freeze(GPU_PRIMITIVE_TOPOLOGY)
export default GPU_PRIMITIVE_TOPOLOGY
