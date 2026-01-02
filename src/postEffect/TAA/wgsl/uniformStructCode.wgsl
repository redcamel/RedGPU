// ===== 구조체 및 유틸리티 =====
struct Uniforms {
    frameIndex: f32,
    currJitterOffset: vec2<f32>,
    prevJitterOffset: vec2<f32>,
};

struct NeighborhoodStats {
    minColor: vec4<f32>,
    maxColor: vec4<f32>,
    mean: vec4<f32>,
    stdDev: vec4<f32>,
    currentYCoCg: vec4<f32>,
};

fn rgb_to_ycocg(c: vec4<f32>) -> vec4<f32> {
    let y  =  0.25 * c.r + 0.5 * c.g + 0.25 * c.b;
    let co =  0.5 * c.r - 0.5 * c.b;
    let cg = -0.25 * c.r + 0.5 * c.g - 0.25 * c.b;
    return vec4<f32>(y, co, cg, c.a);
}

fn ycocg_to_rgb(c: vec4<f32>) -> vec4<f32> {
    let r = c.x + c.y - c.z;
    let g = c.x + c.z;
    let b = c.x - c.y - c.z;
    return vec4<f32>(max(r, 0.0), max(g, 0.0), max(b, 0.0), c.a);
}

// [핵심] 깊이 기반 신뢰도 계산: 현재와 과거의 깊이 차이가 크면 고스팅 방지를 위해 히스토리 거부
fn get_depth_confidence(currDepth: f32, prevDepth: f32) -> f32 {
    let depthDiff = abs(currDepth - prevDepth);
    // 임계값(0.001~0.01)은 씬의 스케일에 맞춰 조정하세요.
    return 1.0 - clamp((depthDiff - 0.002) / 0.01, 0.0, 1.0);
}

// ===== 고품질 샘플링 함수들 =====
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

fn calculate_neighborhood_stats(pixelCoord: vec2<i32>, screenSize: vec2<u32>) -> NeighborhoodStats {
    var m1 = vec4<f32>(0.0); var m2 = vec4<f32>(0.0);
    var minC = vec4<f32>(1e5); var maxC = vec4<f32>(-1e5);
    var currentYCoCg = vec4<f32>(0.0);

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSize) - 1);
            let colorYCoCg = rgb_to_ycocg(textureLoad(sourceTexture, sampleCoord, 0));
            m1 += colorYCoCg; m2 += colorYCoCg * colorYCoCg;
            minC = min(minC, colorYCoCg); maxC = max(maxC, colorYCoCg);
            if (x == 0 && y == 0) { currentYCoCg = colorYCoCg; }
        }
    }
    let sampleCount = 9.0;
    var stats: NeighborhoodStats;
    stats.mean = m1 / sampleCount;
    stats.stdDev = sqrt(max((m2 / sampleCount) - (stats.mean * stats.mean), vec4<f32>(0.0)));
    stats.minColor = minC; stats.maxColor = maxC; stats.currentYCoCg = currentYCoCg;
    return stats;
}

fn clip_history_to_neighborhood(historyColor: vec4<f32>, currentColor: vec4<f32>, stats: NeighborhoodStats) -> vec4<f32> {
    let gamma = 1.0;
    let v_min = max(stats.minColor, stats.mean - stats.stdDev * gamma);
    let v_max = min(stats.maxColor, stats.mean + stats.stdDev * gamma);
    let segment = historyColor - currentColor;
    let direction = segment + select(vec4<f32>(1e-7), vec4<f32>(-1e-7), segment < vec4<f32>(0.0));
    var t_max = vec4<f32>(1.0);
    t_max = select(t_max, clamp((v_min - currentColor) / direction, vec4<f32>(0.0), vec4<f32>(1.0)), segment < (v_min - currentColor));
    t_max = select(t_max, clamp((v_max - currentColor) / direction, vec4<f32>(0.0), vec4<f32>(1.0)), segment > (v_max - currentColor));
    return currentColor + segment * min(t_max.x, min(t_max.y, t_max.z));
}