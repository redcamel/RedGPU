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

 fn haltonSequence(index: f32, base: f32) -> f32 {
        var result: f32 = 0.0;
        var fraction: f32 = 1.0 / base;
        var i: f32 = index;

        for (var iter = 0; iter < 10 && i > 0.0; iter++) {
            result += (i % base) * fraction;
            i = floor(i / base);
            fraction /= base;
        }

        return result;
    }
