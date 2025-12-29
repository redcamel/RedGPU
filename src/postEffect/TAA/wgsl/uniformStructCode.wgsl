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

// 간단한 샤프닝 함수
fn applySharpening(pixelCoord: vec2<u32>, centerColor: vec4<f32>, tex: texture_2d<f32>) -> vec4<f32> {
    // 상하좌우 4방향 샘플링
    let up    = textureLoad(tex, pixelCoord + vec2<u32>(0, 1), 0);
    let down  = textureLoad(tex, pixelCoord - vec2<u32>(0, 1), 0);
    let left  = textureLoad(tex, pixelCoord - vec2<u32>(1, 0), 0);
    let right = textureLoad(tex, pixelCoord + vec2<u32>(1, 0), 0);

    // 주변 평균과의 차이를 구함
    let neighborAvg = (up + down + left + right) * 0.25;
    let edge = centerColor - neighborAvg;

    // 샤프닝 강도 (0.1 ~ 0.3 권장)
    // 너무 높으면 노이즈가 보일 수 있으니 조절해보세요.
    let sharpness = 0.2;

    return centerColor + edge * sharpness;
}
// Variance clipping 함수
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

    // k=2.0으로 적당한 클리핑
    let k = 2.0;
    let minColor = mean - k * stddev;
    let maxColor = mean + k * stddev;

    return clamp(historyColor, minColor, maxColor);
}
