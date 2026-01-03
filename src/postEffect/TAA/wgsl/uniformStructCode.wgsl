// ===== 구조체 및 유틸리티 =====
struct Uniforms {
    frameIndex: f32,
    currJitterOffset: vec2<f32>,
    prevJitterOffset: vec2<f32>,
};

struct NeighborhoodStats {
    minColor: vec3<f32>,
    maxColor: vec3<f32>,
    mean: vec3<f32>,
    stdDev: vec3<f32>,
};

// YCoCg 변환 유틸리티
fn rgb_to_ycocg(rgb: vec3<f32>) -> vec3<f32> {
    let y  = dot(rgb, vec3<f32>(0.25, 0.5, 0.25));
    let co = dot(rgb, vec3<f32>(0.5, 0.0, -0.5));
    let cg = dot(rgb, vec3<f32>(-0.25, 0.5, -0.25));
    return vec3<f32>(y, co, cg);
}

fn ycocg_to_rgb(ycocg: vec3<f32>) -> vec3<f32> {
    let y  = ycocg.x;
    let co = ycocg.y;
    let cg = ycocg.z;
    return vec3<f32>(y + co - cg, y + cg, y - co - cg);
}

fn get_depth_confidence(currDepth: f32, prevDepth: f32) -> f32 {
    let depthDiff = abs(currDepth - prevDepth);
    return 1.0 - clamp((depthDiff - 0.01) / 0.02, 0.0, 1.0);
}

fn fetch_depth_bilinear(tex: texture_depth_2d, uv: vec2<f32>, screenSize: vec2<f32>) -> f32 {
    let samplePos = uv * screenSize - 0.5;
    let f = fract(samplePos);
    let base = vec2<i32>(floor(samplePos));
    let size = vec2<i32>(textureDimensions(tex));

    let d00 = textureLoad(tex, clamp(base + vec2<i32>(0, 0), vec2<i32>(0), size - 1), 0);
    let d10 = textureLoad(tex, clamp(base + vec2<i32>(1, 0), vec2<i32>(0), size - 1), 0);
    let d01 = textureLoad(tex, clamp(base + vec2<i32>(0, 1), vec2<i32>(0), size - 1), 0);
    let d11 = textureLoad(tex, clamp(base + vec2<i32>(1, 1), vec2<i32>(0), size - 1), 0);

    return mix(mix(d00, d10, f.x), mix(d01, d11, f.x), f.y);
}

fn sample_texture_catmull_rom(tex: texture_2d<f32>, smp: sampler, uv: vec2<f32>, texSize: vec2<f32>) -> vec4<f32> {
    let samplePos = uv * texSize;
    let texPos1 = floor(samplePos - 0.5) + 0.5;
    let f = samplePos - texPos1;

    let w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
    let w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
    let w2 = f * (0.5 + f * (2.0 - 1.5 * f));
    let w3 = f * f * (-0.5 + 0.5 * f);

    let w12 = w1 + w2;
    let offset12 = w2 / w12;
    let invTexSize = 1.0 / texSize;

    var result = vec4<f32>(0.0);
    result += textureSampleLevel(tex, smp, (texPos1 + vec2<f32>(offset12.x, -1.0)) * invTexSize, 0.0) * w12.x * w0.y;
    result += textureSampleLevel(tex, smp, (texPos1 + vec2<f32>(-1.0, offset12.y)) * invTexSize, 0.0) * w0.x * w12.y;
    result += textureSampleLevel(tex, smp, (texPos1 + offset12) * invTexSize, 0.0) * w12.x * w12.y;
    result += textureSampleLevel(tex, smp, (texPos1 + vec2<f32>(2.0, offset12.y)) * invTexSize, 0.0) * w3.x * w12.y;
    result += textureSampleLevel(tex, smp, (texPos1 + vec2<f32>(offset12.x, 2.0)) * invTexSize, 0.0) * w12.x * w3.y;

    return max(result, vec4<f32>(0.0));
}

// YCoCg 공간에서 주변 통계 계산
fn calculate_neighborhood_stats_ycocg(pixelCoord: vec2<i32>, screenSizeU: vec2<u32>) -> NeighborhoodStats {
    let screenSize = vec2<f32>(screenSizeU);
    var m1 = vec3<f32>(0.0);
    var m2 = vec3<f32>(0.0);
    var minC = vec3<f32>(1e5);
    var maxC = vec3<f32>(-1e5);

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = pixelCoord + vec2<i32>(x, y);
            let sampleUV = (vec2<f32>(sampleCoord) + 0.5 - uniforms.currJitterOffset) / screenSize;

            // RGB 샘플링 후 즉시 YCoCg로 변환
            let colorRGB = textureSampleLevel(sourceTexture, taaTextureSampler, sampleUV, 0.0).rgb;
            let color = rgb_to_ycocg(colorRGB);

            m1 += color;
            m2 += color * color;
            minC = min(minC, color);
            maxC = max(maxC, color);
        }
    }

    let sampleCount = 9.0;
    var stats: NeighborhoodStats;
    stats.mean = m1 / sampleCount;
    stats.stdDev = sqrt(max((m2 / sampleCount) - (stats.mean * stats.mean), vec3<f32>(0.0)));
    stats.minColor = minC;
    stats.maxColor = maxC;

    return stats;
}
fn get_color_discrepancy_weight(currMeanYCoCg: vec3<f32>, histYCoCg: vec3<f32>) -> f32 {
    // 두 색상 벡터 사이의 거리를 계산 (Y, Co, Cg 전체 차이)
    let diff = length(currMeanYCoCg - histYCoCg);

    // vec3 전체를 고려하므로 임계값을 루마 단독일 때보다 약간 높여주는 것이 안정적입니다.
    // 0.1(차이 거의 없음) ~ 0.5(차이 큼)
    return smoothstep(0.1, 0.5, diff);
}
// YCoCg 공간에서 클리핑 수행
fn clip_history_ycocg(historyYCoCg: vec3<f32>, stats: NeighborhoodStats, motion: f32) -> vec3<f32> {
    let gamma = mix(0.5, 1.0, motion);
    let v_min = min(stats.minColor, stats.mean - stats.stdDev * gamma);
    let v_max = max(stats.maxColor, stats.mean + stats.stdDev * gamma);

    return clamp(historyYCoCg, v_min, v_max);
}