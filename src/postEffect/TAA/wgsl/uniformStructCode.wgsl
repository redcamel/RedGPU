struct Uniforms {
    temporalBlendFactor: f32,
    motionThreshold: f32,
    colorBoxSize: f32,
    jitterStrength: f32,
    varianceClipping: f32,
    frameIndex: f32,
    currentFrameSliceIndex: f32,
    useMotionVectors: f32,
    motionBlurReduction: f32,
    disocclusionThreshold: f32,
    invViewProj: mat4x4<f32>,
    prevViewProj: mat4x4<f32>,
};

// 휘도(밝기) 계산 함수: ITU-R BT.709 계수 사용
fn getLuminance(color: vec3<f32>) -> f32 {
    return dot(color, vec3<f32>(0.2126, 0.7152, 0.0722));
}

fn varianceClipping(sampleUV: vec2<f32>, historyColor: vec4<f32>, tex: texture_2d<f32>, texSampler: sampler) -> vec4<f32> {
    var m1 = vec4<f32>(0.0);
    var m2 = vec4<f32>(0.0);

    let texSize = vec2<f32>(textureDimensions(tex));
    let pixelSize = 1.0 / texSize;

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

    // 표준편차 배수(k): 값이 작을수록 고스트가 줄지만 노이즈가 보일 수 있음
    let k = 1.2;
    let minColor = mean - k * stddev;
    let maxColor = mean + k * stddev;

    return clamp(historyColor, minColor, maxColor);
}
