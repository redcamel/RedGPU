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

// Halton sequence 함수 (Renderer.ts와 동일한 로직)
fn haltonSequence(index: u32, base: u32) -> f32 {
    var result: f32 = 0.0;
    var fraction: f32 = 1.0;
    var idx = index;

    while (idx > 0u) {
        fraction /= f32(base);
        result += fraction * f32(idx % base);
        idx = idx / base;
    }
    return result;
}
