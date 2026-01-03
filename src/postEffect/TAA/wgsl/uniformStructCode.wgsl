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
struct SampledColor {
    rgb: vec3<f32>,
    ycocg: vec3<f32>,
};
// RGB -> YCoCg 변환
fn rgb_to_ycocg(rgb: vec3<f32>) -> vec3<f32> {
    let y  = dot(rgb, vec3<f32>(0.25, 0.5, 0.25));
    let co = dot(rgb, vec3<f32>(0.5, 0.0, -0.5));
    let cg = dot(rgb, vec3<f32>(-0.25, 0.5, -0.25));
    return vec3<f32>(y, co, cg);
}

// YCoCg -> RGB 변환
fn ycocg_to_rgb(ycocg: vec3<f32>) -> vec3<f32> {
    let y  = ycocg.x;
    let co = ycocg.y;
    let cg = ycocg.z;
    return vec3<f32>(y + co - cg, y + cg, y - co - cg);
}

// 깊이 기반 신뢰도 계산
fn get_depth_confidence(currDepth: f32, prevDepth: f32) -> f32 {
    let depthDiff = abs(currDepth - prevDepth);
    // 차이가 0.01 이상이면 신뢰도를 깎기 시작함
    return 1.0 - clamp((depthDiff - 0.01) / 0.02, 0.0, 1.0);
}

// 픽셀 불일치 보정을 위한 Bilinear 깊이 샘플링
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

// 주변 3x3 통계 계산 (YCoCg)
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

// 색상 차이 가중치 (고스팅 감지용)
fn get_color_discrepancy_weight(stats: NeighborhoodStats, histYCoCg: vec3<f32>) -> f32 {
    // 단순 거리가 아니라, 히스토리가 주변 표준 편차(stdDev) 범위에서 얼마나 벗어났는지 확인
    let diff = abs(stats.mean.x - histYCoCg.x);

    // 표준 편차를 활용한 가변 임계값:
    // 주변이 복잡하면(stdDev가 크면) 차이에 관대하고, 평탄하면(stdDev가 작으면) 엄격하게 잡음
    let threshold = max(stats.stdDev.x * 0.45, 0.01);

    return smoothstep(threshold, threshold * 2.0, diff);
}
fn sample_texture_catmull_rom_antiflicker(tex: texture_2d<f32>, smp: sampler, uv: vec2<f32>, texSize: vec2<f32>) -> SampledColor {
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

    let coords = array<vec2<f32>, 5>(
        (texPos1 + vec2<f32>(offset12.x, -1.0)) * invTexSize,
        (texPos1 + vec2<f32>(-1.0, offset12.y)) * invTexSize,
        (texPos1 + offset12) * invTexSize,
        (texPos1 + vec2<f32>(2.0, offset12.y)) * invTexSize,
        (texPos1 + vec2<f32>(offset12.x, 2.0)) * invTexSize
    );

    let weights = array<f32, 5>(
        w12.x * w0.y, w0.x * w12.y, w12.x * w12.y, w3.x * w12.y, w12.x * w3.y
    );

    var sumRGB = vec3<f32>(0.0);
    var sumYCoCg = vec3<f32>(0.0);
    var sumW = 0.0;

    for(var i = 0; i < 5; i++) {
        let sampleRGB = max(textureSampleLevel(tex, smp, coords[i], 0.0).rgb, vec3<f32>(0.0));
        let sampleYCoCg = rgb_to_ycocg(sampleRGB); // 여기서 미리 변환

        // 루마(Y) 기반 가중치 계산 (Anti-flicker)
        let w = weights[i] * (1.0 / (1.0 + sampleYCoCg.x));

        sumRGB += sampleRGB * w;
        sumYCoCg += sampleYCoCg * w;
        sumW += w;
    }

    var result: SampledColor;
    result.rgb = sumRGB / max(sumW, 0.0001);
    result.ycocg = sumYCoCg / max(sumW, 0.0001);
    return result;
}

// 개선된 타이트 클리핑
fn clip_history_ycocg(historyYCoCg: vec3<f32>, stats: NeighborhoodStats, motion: f32) -> vec3<f32> {
    // gamma 값을 낮게 잡아 글자 경계에서 잔상을 강하게 잘라냄
    let gamma = mix(0.2, 0.7, motion);
    let v_min = min(stats.minColor, stats.mean - stats.stdDev * gamma);
    let v_max = max(stats.maxColor, stats.mean + stats.stdDev * gamma);

    return clamp(historyYCoCg, v_min, v_max);
}