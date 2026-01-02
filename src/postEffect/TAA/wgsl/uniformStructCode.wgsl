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
    currentYCoCg: vec4<f32>, // [최적화] 중앙 픽셀의 변환된 값을 재사용
};

struct ClosestDepth {
    coord: vec2<i32>,
    depth: f32,
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
    // 클램핑은 호출부 상황에 따라 선택 (보통 0 미만 방지 위해 유지)
    return vec4<f32>(max(r, 0.0), max(g, 0.0), max(b, 0.0), c.a);
}

// ===== 주변 픽셀 통계 계산 =====
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

            // [최적화] 중앙 픽셀인 경우 값을 따로 저장하여 중복 계산 방지
            if (x == 0 && y == 0) {
                currentYCoCg = colorYCoCg;
            }
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

// ===== 히스토리 클리핑 (AABB 방식) =====
fn clip_history_to_neighborhood(historyColor: vec4<f32>, currentColor: vec4<f32>, stats: NeighborhoodStats) -> vec4<f32> {
    let segment = historyColor - currentColor;
    let v_max = stats.maxColor - currentColor;
    let v_min = stats.minColor - currentColor;

    var t_max = vec4<f32>(1.0);
    let epsilon = 1e-7;
    // [최적화] select를 사용하여 분기 최소화
    let direction = segment + select(vec4<f32>(epsilon), vec4<f32>(-epsilon), segment < vec4<f32>(0.0));

    t_max = select(t_max, clamp(v_min / direction, vec4<f32>(0.0), vec4<f32>(1.0)), segment < v_min);
    t_max = select(t_max, clamp(v_max / direction, vec4<f32>(0.0), vec4<f32>(1.0)), segment > v_max);

    let t = min(t_max.x, min(t_max.y, t_max.z));
    return currentColor + segment * t;
}

// ===== Catmull-Rom 텍스처 샘플링 =====
fn sample_history_catmull_rom(tex: texture_2d<f32>, smp: sampler, uv: vec2<f32>, texSize: vec2<f32>, invTexSize: vec2<f32>) -> vec4<f32> {
    let samplePos = uv * texSize;
    let texPos1 = floor(samplePos - 0.5) + 0.5;
    let f = samplePos - texPos1;

    let w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
    let w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
    let w2 = f * (0.5 + f * (2.0 - 1.5 * f));
    let w3 = f * f * (-0.5 + 0.5 * f);

    let w12 = w1 + w2;
    let offset12 = w2 / w12;

    let xPos = vec3<f32>(texPos1.x - 1.0, texPos1.x + offset12.x, texPos1.x + 2.0) * invTexSize.x;
    let yPos = vec3<f32>(texPos1.y - 1.0, texPos1.y + offset12.y, texPos1.y + 2.0) * invTexSize.y;

    var result = vec4<f32>(0.0);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos.x, yPos.x), 0.0) * (w0.x * w0.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos.y, yPos.x), 0.0) * (w12.x * w0.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos.z, yPos.x), 0.0) * (w3.x * w0.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos.x, yPos.y), 0.0) * (w0.x * w12.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos.y, yPos.y), 0.0) * (w12.x * w12.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos.z, yPos.y), 0.0) * (w3.x * w12.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos.x, yPos.z), 0.0) * (w0.x * w3.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos.y, yPos.z), 0.0) * (w12.x * w3.y);
    result += textureSampleLevel(tex, smp, vec2<f32>(xPos.z, yPos.z), 0.0) * (w3.x * w3.y);

    return max(result, vec4<f32>(0.0));
}

fn get_luma_weight(c: vec4<f32>) -> f32 {
    return 1.0 / (1.0 + max(c.x, 0.0));
}

// [최적화] 뎁스 값까지 동시에 반환하여 추가 textureLoad 방지
fn find_closest_depth_info(pixelCoord: vec2<i32>, screenSize: vec2<u32>) -> ClosestDepth {
    var res: ClosestDepth;
    res.depth = 1.0; // Reverse-Z가 아닐 경우 1.0부터 시작
    res.coord = pixelCoord;

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSize) - 1);
            let d = textureLoad(depthTexture, sampleCoord, 0);
            if (d < res.depth) {
                res.depth = d;
                res.coord = sampleCoord;
            }
        }
    }
    return res;
}

fn sample_history_depth_bilinear(uv: vec2<f32>, screenSize: vec2<f32>) -> f32 {
    let screenSizeU = vec2<u32>(screenSize);
    let samplePos = uv * screenSize - 0.5;
    let f = fract(samplePos);
    let base = vec2<i32>(floor(samplePos));

    let c00 = clamp(base + vec2<i32>(0, 0), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
    let c10 = clamp(base + vec2<i32>(1, 0), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
    let c01 = clamp(base + vec2<i32>(0, 1), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
    let c11 = clamp(base + vec2<i32>(1, 1), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);

    let d00 = textureLoad(historyDepthTexture, c00, 0);
    let d10 = textureLoad(historyDepthTexture, c10, 0);
    let d01 = textureLoad(historyDepthTexture, c01, 0);
    let d11 = textureLoad(historyDepthTexture, c11, 0);

    return mix(mix(d00, d10, f.x), mix(d01, d11, f.x), f.y);
}