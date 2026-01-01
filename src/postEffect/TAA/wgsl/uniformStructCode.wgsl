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
// 1. Variance(분산) 기반 통계 계산 함수
fn get_neighborhood_stats(pixelCoord: vec2<i32>, screenSizeU: vec2<u32>) -> NeighborhoodStats {
    var stats: NeighborhoodStats;
    var m1 = vec4<f32>(0.0); // 색상의 합
    var m2 = vec4<f32>(0.0); // 색상 제곱의 합

    // 단순 Min/Max도 안정성을 위해 병행 사용
    var minC = vec4<f32>(1e5);
    var maxC = vec4<f32>(-1e5);

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let c = textureLoad(sourceTexture, sampleCoord, 0);

            m1 += c;
            m2 += c * c;
            minC = min(minC, c);
            maxC = max(maxC, c);
        }
    }

    let numSamples = 9.0;
    stats.mean = m1 / numSamples;
    let variance = (m2 / numSamples) - (stats.mean * stats.mean);
    stats.stdDev = sqrt(max(variance, vec4<f32>(0.0))); // 음수 방지

    stats.minColor = minC;
    stats.maxColor = maxC;

    return stats;
}

// 2. Variance Clipping을 적용한 클램핑 함수
fn clamp_history(history: vec4<f32>, stats: NeighborhoodStats) -> vec4<f32> {
    // 감도 조절 파라미터 Gamma (보통 1.0 ~ 1.5)
    // 이 값이 작을수록 잔상 제거가 강해지고, 클수록 안티앨리어싱이 부드러워집니다.
    let gamma = 1.25;

    let vMin = stats.mean - (stats.stdDev * gamma);
    let vMax = stats.mean + (stats.stdDev * gamma);

    // Variance 범위로 1차 클램핑 후, 물리적 Min/Max로 최종 안전장치
    let clamped = clamp(history, vMin, vMax);
    return clamp(clamped, stats.minColor, stats.maxColor);
}