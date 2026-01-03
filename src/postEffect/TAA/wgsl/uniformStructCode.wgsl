// ===== 구조체 및 유틸리티 =====
struct Uniforms {
    frameIndex: f32,
    currJitterOffset: vec2<f32>, // 픽셀 단위 오프셋 (예: -0.5 ~ 0.5)
    prevJitterOffset: vec2<f32>, // 픽셀 단위 오프셋
};

struct NeighborhoodStats {
    minColor: vec3<f32>,
    maxColor: vec3<f32>,
    mean: vec3<f32>,
    stdDev: vec3<f32>,
};

fn rgb_to_ycbcr(rgb: vec3<f32>) -> vec3<f32> {
    let y = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    let cb = (rgb.b - y) * 0.564;
    let cr = (rgb.r - y) * 0.713;
    return vec3<f32>(y, cb, cr);
}

fn ycbcr_to_rgb(ycbcr: vec3<f32>) -> vec3<f32> {
    let r = ycbcr.x + 1.402 * ycbcr.z;
    let g = ycbcr.x - 0.344 * ycbcr.y - 0.714 * ycbcr.z;
    let b = ycbcr.x + 1.772 * ycbcr.y;
    return vec3<f32>(r, g, b);
}

fn get_depth_confidence(currDepth: f32, prevDepth: f32) -> f32 {
    let depthDiff = abs(currDepth - prevDepth);
    return 1.0 - clamp((depthDiff - 0.005) / 0.01, 0.0, 1.0); //
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

    return mix(mix(d00, d10, f.x), mix(d01, d11, f.x), f.y); //
}

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

    return max(result, vec4<f32>(0.0)); //
}

fn calculate_neighborhood_stats_ycbcr(pixelCoord: vec2<i32>, screenSize: vec2<u32>) -> NeighborhoodStats {
    var m1 = vec3<f32>(0.0); var m2 = vec3<f32>(0.0);
    var minC = vec3<f32>(1e5); var maxC = vec3<f32>(-1e5);

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSize) - 1);
            let color = rgb_to_ycbcr(textureLoad(sourceTexture, sampleCoord, 0).rgb);
            m1 += color; m2 += color * color;
            minC = min(minC, color); maxC = max(maxC, color);
        }
    }

    let sampleCount = 9.0;
    var stats: NeighborhoodStats;
    stats.mean = m1 / sampleCount;
    stats.stdDev = sqrt(max((m2 / sampleCount) - (stats.mean * stats.mean), vec3<f32>(0.0)));
    stats.minColor = minC; stats.maxColor = maxC;
    return stats; //
}