struct Uniforms {
    jitterStrength: f32,
    frameIndex: f32,
    invViewProj: mat4x4<f32>,
    prevViewProj: mat4x4<f32>,
    jitterOffset: vec2<f32>,
};
// RGB를 YCoCg 공간으로 변환
fn rgb_to_ycocg(rgb: vec3<f32>) -> vec3<f32> {
    let y = dot(rgb, vec3<f32>(0.25, 0.5, 0.25));
    let co = dot(rgb, vec3<f32>(0.5, 0.0, -0.5));
    let cg = dot(rgb, vec3<f32>(-0.25, 0.5, -0.25));
    return vec3<f32>(y, co, cg);
}

// YCoCg를 RGB 공간으로 복원
fn ycocg_to_rgb(ycocg: vec3<f32>) -> vec3<f32> {
    let y = ycocg.x;
    let co = ycocg.y;
    let cg = ycocg.z;
    return vec3<f32>(y + co - cg, y + cg, y - co - cg);
}
// 휘도(밝기) 계산 함수: ITU-R BT.709 계수 사용
fn getLuminance(color: vec3<f32>) -> f32 {
    return dot(color, vec3<f32>(0.2126, 0.7152, 0.0722));
}
fn varianceClipping(sampleUV: vec2<f32>, historyColor: vec4<f32>, tex: texture_2d<f32>, texSampler: sampler) -> vec4<f32> {
    var m1 = vec3<f32>(0.0);
    var m2 = vec3<f32>(0.0);

    var minNeighbor = vec3<f32>(1e5);
    var maxNeighbor = vec3<f32>(-1e5);

    let texSize = vec2<f32>(textureDimensions(tex));
    let pixelSize = 1.0 / texSize;

    // 히스토리 컬러를 YCoCg로 변환
    let historyYCoCg = rgb_to_ycocg(historyColor.rgb);

    for(var y: i32 = -1; y <= 1; y++) {
        for(var x: i32 = -1; x <= 1; x++) {
            let offset = vec2<f32>(f32(x), f32(y)) * pixelSize;
            let neighborUV = clamp(sampleUV + offset, vec2<f32>(0.0), vec2<f32>(1.0));

            // 샘플링 후 즉시 YCoCg로 변환
            let sampleRGB = textureSampleLevel(tex, texSampler, neighborUV, 0.0).rgb;
            let color = rgb_to_ycocg(sampleRGB);

            m1 += color;
            m2 += color * color;

            minNeighbor = min(minNeighbor, color);
            maxNeighbor = max(maxNeighbor, color);
        }
    }

    let mean = m1 / 9.0;
    let stddev = sqrt(max(m2 / 9.0 - mean * mean, vec3<f32>(0.0)));

    let k = 2.0; // YCoCg에서는 RGB보다 조금 더 넓은 범위를 잡아도 안정적입니다.
    let minColor = mean - k * stddev;
    let maxColor = mean + k * stddev;

    let finalMin = max(minColor, minNeighbor);
    let finalMax = min(maxColor, maxNeighbor);

    // YCoCg 공간에서 클리핑 후 다시 RGB로 복원하여 반환
    let clippedYCoCg = clamp(historyYCoCg, finalMin, finalMax);
    return vec4<f32>(ycocg_to_rgb(clippedYCoCg), historyColor.a);
}
// 5-tap 최적화된 Catmull-Rom 필터링 함수
fn sampleTextureCatmullRom(tex: texture_2d<f32>, texSampler: sampler, uv: vec2<f32>) -> vec4<f32> {
    let texSize = vec2<f32>(textureDimensions(tex));
    let samplePos = uv * texSize;
    let texPos1 = floor(samplePos - 0.5) + 0.5;
    let f = samplePos - texPos1;

    let w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
    let w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
    let w2 = f * (0.5 + f * (2.0 - 1.5 * f));
    let w3 = f * f * (-0.5 + 0.5 * f);

    let w12 = w1 + w2;
    let offset12 = w2 / w12;

    let texPos0 = texPos1 - 1.0;
    let texPos3 = texPos1 + 2.0;
    let texPos12 = texPos1 + offset12;

    let invTexSize = 1.0 / texSize;

    // 5-tap 샘플링 (중앙 십자 형태 샘플링으로 9-tap 효과)
    var result = vec4<f32>(0.0);
    result += textureSampleLevel(tex, texSampler, vec2<f32>(texPos12.x, texPos0.y) * invTexSize, 0.0) * w12.x * w0.y;
    result += textureSampleLevel(tex, texSampler, vec2<f32>(texPos0.x, texPos12.y) * invTexSize, 0.0) * w0.x * w12.y;
    result += textureSampleLevel(tex, texSampler, vec2<f32>(texPos12.x, texPos12.y) * invTexSize, 0.0) * w12.x * w12.y;
    result += textureSampleLevel(tex, texSampler, vec2<f32>(texPos3.x, texPos12.y) * invTexSize, 0.0) * w3.x * w12.y;
    result += textureSampleLevel(tex, texSampler, vec2<f32>(texPos12.x, texPos3.y) * invTexSize, 0.0) * w12.x * w3.y;

    // 가중치 합으로 정규화
    let weightSum = w12.x * w0.y + w0.x * w12.y + w12.x * w12.y + w3.x * w12.y + w12.x * w3.y;
    return result / weightSum;
}
