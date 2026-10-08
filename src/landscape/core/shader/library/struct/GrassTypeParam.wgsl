struct GrassTypeParam {
    cullingDistanceSq: f32, // Pre-squared culling distance for fast dot() check
    farDistanceSq: f32,     // Pre-squared Far distance threshold
    reserved0: f32,         // Reserved (64B struct alignment)
    reserved1: f32,         // Reserved (64B struct alignment)
    rawBaseOffset: u32,
    culledNearBaseOffset: u32,
    culledFarBaseOffset: u32,
    nearIndirectSlot: u32,
    farIndirectSlot: u32,
    renderUnitCount: u32,
    hasFarStage: u32,
    instanceCount: u32,
    maxInstances: u32,
    pad0: u32,
    pad1: u32,
    pad2: u32,
};
