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

fn calculate_neighborhood_stats(pixelCoord: vec2<i32>, screenSize: vec2<u32>) -> NeighborhoodStats {
    var m1 = vec4<f32>(0.0); // 1차 합계 (평균 계산용)
    var m2 = vec4<f32>(0.0); // 2차 합계 (분산/표준편차 계산용)
    var minC = vec4<f32>(1e5);
    var maxC = vec4<f32>(-1e5);
    var currentYCoCg = vec4<f32>(0.0);

    // 3x3 주변 샘플링
    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSize) - 1);

            // 색상 공간을 YCoCg로 변환하여 계산 (휘도 중심의 처리를 위해)
            let colorYCoCg = rgb_to_ycocg(textureLoad(sourceTexture, sampleCoord, 0));

            m1 += colorYCoCg;
            m2 += colorYCoCg * colorYCoCg;
            minC = min(minC, colorYCoCg);
            maxC = max(maxC, colorYCoCg);

            if (x == 0 && y == 0) {
                currentYCoCg = colorYCoCg;
            }
        }
    }

    let sampleCount = 9.0;
    var stats: NeighborhoodStats;
    stats.mean = m1 / sampleCount;
    // 분산 계산: E[X^2] - (E[X])^2
    let variance = max((m2 / sampleCount) - (stats.mean * stats.mean), vec4<f32>(0.0));
    stats.stdDev = sqrt(variance);
    stats.minColor = minC;
    stats.maxColor = maxC;
    stats.currentYCoCg = currentYCoCg;

    return stats;
}
fn clip_history_to_neighborhood(historyColor: vec4<f32>, currentColor: vec4<f32>, stats: NeighborhoodStats) -> vec4<f32> {
    // 현재 색상에서 과거 색상으로 이어지는 선분을 정의
    let segment = historyColor - currentColor;

    // 현재 주변 통계를 기준으로 한 경계값 (AABB)
    let v_max = stats.maxColor - currentColor;
    let v_min = stats.minColor - currentColor;

    var t_max = vec4<f32>(1.0);
    let epsilon = 1e-7;

    // 0으로 나누기 방지 및 방향성 결정
    let direction = segment + select(vec4<f32>(epsilon), vec4<f32>(-epsilon), segment < vec4<f32>(0.0));

    // 선분이 경계면에 닿는 지점(t) 계산
    t_max = select(t_max, clamp(v_min / direction, vec4<f32>(0.0), vec4<f32>(1.0)), segment < v_min);
    t_max = select(t_max, clamp(v_max / direction, vec4<f32>(0.0), vec4<f32>(1.0)), segment > v_max);

    // X, Y, Z(Y, Co, Cg) 축 중 가장 먼저 경계에 닿는 비율 선택
    let t = min(t_max.x, min(t_max.y, t_max.z));

    // 최종적으로 클리핑된 색상 반환
    return currentColor + segment * t;
}