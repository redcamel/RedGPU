#redgpu_include color.get_luminance
#redgpu_include depth.linearizeDepth

// ===== 1. 구조체 및 유틸리티 (Alpha 지원 확장) =====
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
    minAlpha: f32,    
    maxAlpha: f32,    
    meanAlpha: f32,   
    meanLuminance: f32,
    stdDevLuminance: f32,
};

struct SampledColor {
    rgb: vec3<f32>,
    ycocg: vec3<f32>,
    alpha: f32,       
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

fn get_depth_confidence(currDepth: f32, prevDepth: f32) -> f32 {
    let currLinear = linearizeDepth(currDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping);
    let prevLinear = linearizeDepth(prevDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping);
    let depthDiff = abs(currLinear - prevLinear);
    // [KO] 선형 거리 차이에 따른 신뢰도 계산 (0.1m 차이부터 감쇄 시작, 0.5m 이상이면 신뢰도 0)
    // [EN] Depth confidence based on linear distance (Decay starts at 0.1m, 0 confidence if > 0.5m)
    return 1.0 - clamp((depthDiff - 0.1) / 0.4, 0.0, 1.0);
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

fn calculate_neighborhood_stats_ycocg(pixelCoord: vec2<i32>, screenSizeU: vec2<u32>) -> NeighborhoodStats {
    let screenSize = vec2<f32>(screenSizeU);
    var m1 = vec3<f32>(0.0);
    var m2 = vec3<f32>(0.0);
    var m1L = 0.0;
    var m2L = 0.0;
    var m1A = 0.0;
    var minC = vec3<f32>(1e5);
    var maxC = vec3<f32>(-1e5);
    var minA = 1e5;
    var maxA = -1e5;

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let colorRGBA = textureLoad(sourceTexture, sampleCoord, 0);
            let colorRGB = colorRGBA.rgb;
            let colorYCoCg = rgb_to_ycocg(colorRGB);
            let lum = get_luminance(colorRGB);
            let alpha = colorRGBA.a;

            m1 += colorYCoCg;
            m2 += colorYCoCg * colorYCoCg;
            m1L += lum;
            m2L += lum * lum;
            m1A += alpha;
            minC = min(minC, colorYCoCg);
            maxC = max(maxC, colorYCoCg);
            minA = min(minA, alpha);
            maxA = max(maxA, alpha);
        }
    }

    let sampleCount = 9.0;
    var stats: NeighborhoodStats;
    stats.mean = m1 / sampleCount;
    stats.stdDev = sqrt(max((m2 / sampleCount) - (stats.mean * stats.mean), vec3<f32>(0.0)));
    stats.meanLuminance = m1L / sampleCount;
    stats.stdDevLuminance = sqrt(max((m2L / sampleCount) - (stats.meanLuminance * stats.meanLuminance), 0.0));
    stats.minColor = minC;
    stats.maxColor = maxC;
    stats.minAlpha = minA;
    stats.maxAlpha = maxA;
    stats.meanAlpha = m1A / sampleCount;

    return stats;
}

fn get_color_discrepancy_weight(stats: NeighborhoodStats, histRGB: vec3<f32>) -> f32 {
    let histLuminance = get_luminance(histRGB);
    let diff = abs(stats.meanLuminance - histLuminance);
    let threshold = max(stats.stdDevLuminance * 0.45, 0.01);
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
    var sumAlpha = 0.0;
    var sumW = 0.0;

    for(var i = 0; i < 5; i++) {
        let sampleRGBA = textureSampleLevel(tex, smp, coords[i], 0.0);
        let sampleRGB = max(sampleRGBA.rgb, vec3<f32>(0.0));
        let sampleYCoCg = rgb_to_ycocg(sampleRGB);

        let w = weights[i] * (1.0 / (1.0 + sampleYCoCg.x));

        sumRGB += sampleRGB * w;
        sumYCoCg += sampleYCoCg * w;
        sumAlpha += sampleRGBA.a * w;
        sumW += w;
    }

    var result: SampledColor;
    let invSumW = 1.0 / max(sumW, 0.0001);
    result.rgb = sumRGB * invSumW;
    result.ycocg = sumYCoCg * invSumW;
    result.alpha = sumAlpha * invSumW;
    return result;
}

fn clip_history_ycocg(historyYCoCg: vec3<f32>, stats: NeighborhoodStats, motion: f32) -> vec3<f32> {
    let gamma = mix(0.2, 0.7, motion);
    let v_min = min(stats.minColor, stats.mean - stats.stdDev * gamma);
    let v_max = max(stats.maxColor, stats.mean + stats.stdDev * gamma);
    return clamp(historyYCoCg, v_min, v_max);
}
