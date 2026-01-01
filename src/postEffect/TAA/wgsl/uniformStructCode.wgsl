// ===== Uniforms =====
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
};
// ===== 1. 색공간 변환 함수 추가 =====
fn rgb_to_ycocg(c: vec4<f32>) -> vec4<f32> {
    let y =  0.25 * c.r + 0.5 * c.g + 0.25 * c.b;
    let co =  0.5 * c.r - 0.5 * c.b;
    let cg = -0.25 * c.r + 0.5 * c.g - 0.25 * c.b;
    return vec4<f32>(y, co, cg, c.a);
}

fn ycocg_to_rgb(c: vec4<f32>) -> vec4<f32> {
    let r = c.x + c.y - c.z;
    let g = c.x + c.z;
    let b = c.x - c.y - c.z;
    return vec4<f32>(r, g, b, c.a);
}

// ===== 2. YCoCg 기반 통계 수집 함수 =====
fn get_neighborhood_stats_ycocg(pixelCoord: vec2<i32>, screenSizeU: vec2<u32>) -> NeighborhoodStats {
    var stats: NeighborhoodStats;
    var m1 = vec4<f32>(0.0);
    var m2 = vec4<f32>(0.0);
    var minC = vec4<f32>(1e5);
    var maxC = vec4<f32>(-1e5);

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            // 읽어온 즉시 YCoCg로 변환하여 통계 계산
            let c = rgb_to_ycocg(textureLoad(sourceTexture, sampleCoord, 0));

            m1 += c;
            m2 += c * c;
            minC = min(minC, c);
            maxC = max(maxC, c);
        }
    }

    let numSamples = 9.0;
    stats.mean = m1 / numSamples;
    let variance = (m2 / numSamples) - (stats.mean * stats.mean);
    stats.stdDev = sqrt(max(variance, vec4<f32>(0.0)));
    stats.minColor = minC;
    stats.maxColor = maxC;

    return stats;
}

fn clip_history(history: vec4<f32>, current: vec4<f32>, stats: NeighborhoodStats) -> vec4<f32> {
    let minColor = stats.minColor;
    let maxColor = stats.maxColor;

    // 현재 픽셀과 히스토리 사이의 벡터
    let p_clip = history - current;
    let v_max = maxColor - current;
    let v_min = minColor - current;

    var t_max = vec4<f32>(1.0);

    // 교점 계산 (AABB Intersection)
    if (p_clip.x > v_max.x) { t_max.x = v_max.x / p_clip.x; }
    if (p_clip.x < v_min.x) { t_max.x = v_min.x / p_clip.x; }
    if (p_clip.y > v_max.y) { t_max.y = v_max.y / p_clip.y; }
    if (p_clip.y < v_min.y) { t_max.y = v_min.y / p_clip.y; }
    if (p_clip.z > v_max.z) { t_max.z = v_max.z / p_clip.z; }
    if (p_clip.z < v_min.z) { t_max.z = v_min.z / p_clip.z; }

    let t = min(t_max.x, min(t_max.y, t_max.z));
    return current + p_clip * clamp(t, 0.0, 1.0);
}

fn catmull_rom_weights(t: f32) -> vec4<f32> {
    let t2 = t * t;
    let t3 = t2 * t;
    return vec4<f32>(
        -0.5 * t3 + t2 - 0.5 * t,
        1.5 * t3 - 2.5 * t2 + 1.0,
        -1.5 * t3 + 2.0 * t2 + 0.5 * t,
        0.5 * t3 - 0.5 * t2
    );
}
fn sample_texture_catmull_rom(tex: texture_2d<f32>, smp: sampler, uv: vec2<f32>, texSize: vec2<f32>) -> vec4<f32> {
    let invTexSize = 1.0 / texSize;
    let samplePos = uv * texSize;
    let texPos1 = floor(samplePos - 0.5) + 0.5;
    let f = samplePos - texPos1;

    let w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
    let w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
    let w2 = f * (0.5 + f * (2.0 - 1.5 * f));
    let w3 = f * f * (-0.5 + 0.5 * f);

    let w12 = w1 + w2;
    let offset12 = w2 / w12;

    // 수정 포인트: invTexSize의 .x와 .y 성분을 명확히 지정하여 f32 연산으로 만듦
    let xPos0 = (texPos1.x - 1.0) * invTexSize.x;
    let xPos12 = (texPos1.x + offset12.x) * invTexSize.x;
    let xPos3 = (texPos1.x + 2.0) * invTexSize.x;

    let yPos0 = (texPos1.y - 1.0) * invTexSize.y;
    let yPos12 = (texPos1.y + offset12.y) * invTexSize.y;
    let yPos3 = (texPos1.y + 2.0) * invTexSize.y;

    var result = vec4<f32>(0.0);

    // Row 0
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos0,  yPos0), 0.0)  * (w0.x * w0.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos12, yPos0), 0.0)  * (w12.x * w0.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos3,  yPos0), 0.0)  * (w3.x * w0.y);

    // Row 1 & 2
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos0,  yPos12), 0.0) * (w0.x * w12.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos12, yPos12), 0.0) * (w12.x * w12.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos3,  yPos12), 0.0) * (w3.x * w12.y);

    // Row 3
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos0,  yPos3), 0.0)  * (w0.x * w3.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos12, yPos3), 0.0)  * (w12.x * w3.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos3,  yPos3), 0.0)  * (w3.x * w3.y);

    return max(result, vec4<f32>(0.0));
}
// 블렌딩 개선
fn apply_luma_weight(curr: vec4<f32>, hist: vec4<f32>, alpha: f32) -> vec4<f32> {
    let w_c = alpha / (1.0 + curr.x); // YCoCg.x는 밝기
    let w_h = (1.0 - alpha) / (1.0 + hist.x);
    return (curr * w_c + hist * w_h) / (w_c + w_h);
}