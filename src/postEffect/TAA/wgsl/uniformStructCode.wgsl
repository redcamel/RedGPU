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

// ===== 색상 공간 변환 (YCoCg) =====
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

// ===== 통계 및 클리핑 함수 =====
fn calculate_neighborhood_stats(pixelCoord: vec2<i32>, screenSize: vec2<u32>) -> NeighborhoodStats {
    var m1 = vec4<f32>(0.0);
    var m2 = vec4<f32>(0.0);
    var minC = vec4<f32>(1e5);
    var maxC = vec4<f32>(-1e5);
    var currentYCoCg = vec4<f32>(0.0);

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSize) - 1);
            let colorYCoCg = rgb_to_ycocg(textureLoad(sourceTexture, sampleCoord, 0));

            m1 += colorYCoCg;
            m2 += colorYCoCg * colorYCoCg;
            minC = min(minC, colorYCoCg);
            maxC = max(maxC, colorYCoCg);

            if (x == 0 && y == 0) { currentYCoCg = colorYCoCg; }
        }
    }

    let sampleCount = 9.0;
    var stats: NeighborhoodStats;
    stats.mean = m1 / sampleCount;
    let variance = max((m2 / sampleCount) - (stats.mean * stats.mean), vec4<f32>(0.0));
    stats.stdDev = sqrt(variance);
    stats.minColor = minC;
    stats.maxColor = maxC;
    stats.currentYCoCg = currentYCoCg;

    return stats;
}

fn clip_history_to_neighborhood(historyColor: vec4<f32>, currentColor: vec4<f32>, stats: NeighborhoodStats) -> vec4<f32> {
    // [개선] Variance Clipping: 표준편차를 이용해 범위를 동적으로 제한
    let gamma = 1.0; // 0.75 ~ 1.25 사이에서 조절 가능
    let v_min = max(stats.minColor, stats.mean - stats.stdDev * gamma);
    let v_max = min(stats.maxColor, stats.mean + stats.stdDev * gamma);

    let segment = historyColor - currentColor;
    let clip_min = v_min - currentColor;
    let clip_max = v_max - currentColor;

    var t_max = vec4<f32>(1.0);
    let epsilon = 1e-7;
    let direction = segment + select(vec4<f32>(epsilon), vec4<f32>(-epsilon), segment < vec4<f32>(0.0));

    t_max = select(t_max, clamp(clip_min / direction, vec4<f32>(0.0), vec4<f32>(1.0)), segment < clip_min);
    t_max = select(t_max, clamp(clip_max / direction, vec4<f32>(0.0), vec4<f32>(1.0)), segment > clip_max);

    let t = min(t_max.x, min(t_max.y, t_max.z));
    return currentColor + segment * t;
}