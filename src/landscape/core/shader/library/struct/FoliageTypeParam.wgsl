#redgpu_include landscape.struct.FoliageLODUniformInfo;

struct FoliageTypeParam {
    cullingDistance: f32,
    fadeStartDistance: f32,
    boundingRadius: f32,
    bottomOffset: f32,
    lodCount: u32,
    maxInstances: u32,
    culledBaseOffset: u32,
    indirectBaseOffset: u32,
    rawBaseOffset: u32,
    instanceCount: u32,
    shadowCullDistance: f32,
    invFadeRange: f32,
    boundingHeight: f32,
    pad0: f32,
    pad1: f32,
    pad2: f32,
    lods: array<FoliageLODUniformInfo, 8>,
};
