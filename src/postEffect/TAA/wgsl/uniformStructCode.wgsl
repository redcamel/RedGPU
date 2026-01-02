// ===== 구조체 정의 =====
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

// ===== 색상 및 휘도 유틸리티 =====
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

fn get_luminance(c: vec3<f32>) -> f32 {
    return dot(c, vec3<f32>(0.2126, 0.7152, 0.0722));
}

// 휘도가 높을수록 낮은 가중치를 주어 고대비 플리커링 억제
fn get_luminance_weight(color: vec3<f32>) -> f32 {
    return 1.0 / (1.0 + get_luminance(color));
}

// ===== 고품질 Catmull-Rom 5-Tap 샘플링 =====
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

    let texPos0 = texPos1 - 1.0;
    let texPos3 = texPos1 + 2.0;
    let texPos12 = texPos1 + offset12;
    let invTexSize = 1.0 / texSize;

    var result = vec4<f32>(0.0);
    result += textureSampleLevel(tex, smp, vec2<f32>(texPos12.x, texPos0.y) * invTexSize, 0.0) * w12.x * w0.y;
    result += textureSampleLevel(tex, smp, vec2<f32>(texPos0.x, texPos12.y) * invTexSize, 0.0) * w0.x * w12.y;
    result += textureSampleLevel(tex, smp, vec2<f32>(texPos12.x, texPos12.y) * invTexSize, 0.0) * w12.x * w12.y;
    result += textureSampleLevel(tex, smp, vec2<f32>(texPos3.x, texPos12.y) * invTexSize, 0.0) * w3.x * w12.y;
    result += textureSampleLevel(tex, smp, vec2<f32>(texPos12.x, texPos3.y) * invTexSize, 0.0) * w12.x * w3.y;

    return max(result, vec4<f32>(0.0));
}

// ===== 통계 및 재투영 보조 함수 =====
fn find_closest_depth_coord(pixelCoord: vec2<i32>, screenSize: vec2<u32>) -> vec2<i32> {
    var closestCoord = pixelCoord;
    var minDepth = 1.0;
    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSize) - 1);
            let d = textureLoad(depthTexture, sampleCoord, 0);
            if (d < minDepth) { minDepth = d; closestCoord = sampleCoord; }
        }
    }
    return closestCoord;
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
    let clip_min = v_min - currentColor; let clip_max = v_max - currentColor;
    var t_max = vec4<f32>(1.0);
    let direction = segment + select(vec4<f32>(1e-7), vec4<f32>(-1e-7), segment < vec4<f32>(0.0));
    t_max = select(t_max, clamp(clip_min / direction, vec4<f32>(0.0), vec4<f32>(1.0)), segment < clip_min);
    t_max = select(t_max, clamp(clip_max / direction, vec4<f32>(0.0), vec4<f32>(1.0)), segment > clip_max);
    return currentColor + segment * min(t_max.x, min(t_max.y, t_max.z));
}