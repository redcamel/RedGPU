struct GrassTypeParam {
    cullingDistanceSq: f32, // Pre-squared culling distance for fast dot() check
    farDistanceSq: f32,     // Pre-squared Far distance threshold
    fadeStartSq: f32,       // Pre-squared distance threshold for fade start
    invFadeRange: f32,      // 1.0 / (cullingDistance - fadeStart)
    rawBaseOffset: u32,
    culledNearBaseOffset: u32,
    culledFarBaseOffset: u32,
    nearIndirectSlot: u32,
    farIndirectSlot: u32,
    renderUnitCount: u32,
    hasFarStage: u32,
    instanceCount: u32,
    maxInstances: u32,
    cullingDistance: f32,   // Camera distance boundary for linear fade
    shadowCullDistanceSq: f32,
    shadowFadeStartSq: f32,
    invShadowFadeRange: f32,
    shadowCullDistance: f32,
    pad1: u32,
    pad2: u32,
};

