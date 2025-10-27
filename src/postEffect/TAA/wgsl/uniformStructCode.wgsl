struct Uniforms {
    temporalBlendFactor: f32,
    motionThreshold: f32,
    colorBoxSize: f32,
    jitterStrength: f32,
    varianceClipping: f32,
    frameIndex: f32,
    currentFrameSliceIndex: f32,
    // 모션벡터 기반 TAA를 위한 새로운 파라미터들
    useMotionVectors: f32,
    motionBlurReduction: f32,
    disocclusionThreshold: f32,
};
