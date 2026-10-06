struct GrassTypeParam {
    cullingDistanceSq: f32, // Pre-squared culling distance for fast dot() check
    farDistanceSq: f32,     // Pre-squared Far distance threshold
    cullingDistance: f32,   // Scalar culling distance (reserved for fading/AScatter alignment)
    farDistance: f32,       // Scalar far distance (reserved for fading/AScatter alignment)
    rawBaseOffset: u32,
    culledNearBaseOffset: u32,
    culledFarBaseOffset: u32,
    nearIndirectSlot: u32,
    farIndirectSlot: u32,
    subMeshCount: u32,
    hasFarStage: u32,
    instanceCount: u32,
    maxInstances: u32,
    pad0: u32,
    pad1: u32,
    pad2: u32,
};
