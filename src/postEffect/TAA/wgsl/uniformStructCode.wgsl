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

fn get_tone_mapped_weight(c: vec3<f32>) -> f32 {
    let l = dot(c, vec3<f32>(0.2126, 0.7152, 0.0722));
    return 1.0 / (1.0 + l);
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

// [수정 완료] 타입 캐스팅 오류 해결
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
    // vec2<i32>를 vec2<f32>로 캐스팅하여 연산
    result += textureSampleLevel(tex, smp, (texPos1 + vec2<f32>(2.0, 0.0) + vec2<f32>(0.0, offset12.y)) * invTexSize, 0.0) * w3.x * w12.y;
    result += textureSampleLevel(tex, smp, (texPos1 + vec2<f32>(0.0, 2.0) + vec2<f32>(offset12.x, 0.0)) * invTexSize, 0.0) * w12.x * w3.y;
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