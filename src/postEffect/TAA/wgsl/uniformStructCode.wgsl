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
    invViewProj:mat4x4<f32>,
    prevViewProj:mat4x4<f32>,
};

fn varianceClipping(sampleUV: vec2<f32>, historyColor: vec4<f32>, tex: texture_2d<f32>, texSampler: sampler) -> vec4<f32> {
    var m1 = vec4<f32>(0.0);
    var m2 = vec4<f32>(0.0);

    let texSize = vec2<f32>(textureDimensions(tex));
    let pixelSize = 1.0 / texSize;

    // 3x3 샘플링 (bilinear 필터링으로 부드럽게)
    for(var y: i32 = -1; y <= 1; y++) {
        for(var x: i32 = -1; x <= 1; x++) {
            let offset = vec2<f32>(f32(x), f32(y)) * pixelSize;
            let neighborUV = clamp(sampleUV + offset, vec2<f32>(0.0), vec2<f32>(1.0) - pixelSize * 0.5);

            let sample = textureSampleLevel(tex, texSampler, neighborUV, 0.0);
            m1 += sample;
            m2 += sample * sample;
        }
    }

    let mean = m1 / 9.0;
    let stddev = sqrt(max(m2 / 9.0 - mean * mean, vec4<f32>(0.0)));

    // k=1.0으로 매우 엄격한 클리핑 (선명도 최우선)
    let k = 1.0;
    let minColor = mean - k * stddev;
    let maxColor = mean + k * stddev;

    return clamp(historyColor, minColor, maxColor);
}
