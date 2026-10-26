#redgpu_include color.rgbToYCoCg
#redgpu_include color.YCoCgToRgb
#redgpu_include depth.getLinearizeDepth
#redgpu_include math.EPSILON

// TAA uniform buffer layout (16-byte aligned)
struct Uniforms {
    currJitterOffset: vec2<f32>,
    frameIndex: f32,
    pad0: f32, // 16-byte tail alignment
};

// 3x3 neighborhood statistical moments and AABB bounds in YCoCg space (64 bytes, 16B aligned per slot)
struct NeighborhoodStats {
    minColor: vec3<f32>,
    minAlpha: f32, // 12B + 4B = 16B
    maxColor: vec3<f32>,
    maxAlpha: f32, // 12B + 4B = 16B
    mean: vec3<f32>,
    meanAlpha: f32, // 12B + 4B = 16B
    stdDev: vec3<f32>,
    pad0: f32, // 16-byte tail alignment
};

struct SampledColor {
    rgb: vec3<f32>,
    ycocg: vec3<f32>,
    alpha: f32,
};

// Evaluates depth continuity confidence between current and reprojected depth to detect disocclusion
fn get_geometric_depth_confidence(currDepth: f32, prevDepth: f32) -> f32 {
    let currLinear = getLinearizeDepth(currDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping);
    let prevLinear = getLinearizeDepth(prevDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping);
    let depthDiff = abs(currLinear - prevLinear);

    let tolerance = max(0.15, currLinear * 0.04);
    return 1.0 - saturate((depthDiff - tolerance * 0.5) / (tolerance * 1.5));
}

// 10x10 workgroup shared memory (8x8 active tile + 1-pixel halo border)
var<workgroup> s_color : array<array<vec4<f32>, 10>, 10>;
var<workgroup> s_depth : array<array<f32, 10>, 10>;

// Computes 3x3 YCoCg mean, standard deviation, and min/max bounds from workgroup shared memory
fn calculate_neighborhood_stats_ycocg_lds(localCoord: vec2<i32>) -> NeighborhoodStats {
    var m1 = vec3<f32>(0.0);
    var m2 = vec3<f32>(0.0);
    var minC = vec3<f32>(1e5);
    var maxC = vec3<f32>(-1e5);
    var sumAlpha = 0.0;
    var minA = 1e5;
    var maxA = -1e5;

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleRGBA = s_color[localCoord.y + y][localCoord.x + x];
            let colorYCoCg = rgbToYCoCg(sampleRGBA.rgb);
            let alpha = sampleRGBA.a;

            m1 += colorYCoCg;
            m2 += colorYCoCg * colorYCoCg;
            minC = min(minC, colorYCoCg);
            maxC = max(maxC, colorYCoCg);
            sumAlpha += alpha;
            minA = min(minA, alpha);
            maxA = max(maxA, alpha);
        }
    }

    let sampleCount = 9.0;
    var stats: NeighborhoodStats;
    stats.mean = m1 / sampleCount;
    stats.stdDev = sqrt(max((m2 / sampleCount) - (stats.mean * stats.mean), vec3<f32>(0.0)));
    stats.minColor = minC;
    stats.maxColor = maxC;
    stats.minAlpha = minA;
    stats.maxAlpha = maxA;
    stats.meanAlpha = sumAlpha / sampleCount;
    stats.pad0 = 0.0;

    return stats;
}

// Reconstructs unjittered current pixel color using a 3x3 sub-pixel Gaussian filter in shared memory
fn reconstruct_current_color_ycocg_lds(localCoord: vec2<i32>, jitterOffsetPix: vec2<f32>) -> SampledColor {
    var sumRGB = vec3<f32>(0.0);
    var sumAlpha = 0.0;
    var sumWeight = 0.0;

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let delta = vec2<f32>(f32(x), f32(y)) + jitterOffsetPix;
            let distSq = dot(delta, delta);
            let w = exp(-4.85 * distSq);

            let sampleRGBA = s_color[localCoord.y + y][localCoord.x + x];
            sumRGB += sampleRGBA.rgb * w;
            sumAlpha += sampleRGBA.a * w;
            sumWeight += w;
        }
    }

    let invW = 1.0 / max(sumWeight, EPSILON);
    var result: SampledColor;
    result.rgb = sumRGB * invW;
    result.ycocg = rgbToYCoCg(result.rgb);
    result.alpha = sumAlpha * invW;
    return result;
}

// Measures luminance discrepancy between neighborhood mean and clipped history luminance
fn get_color_discrepancy_weight(stats: NeighborhoodStats, historyLuminance: f32) -> f32 {
    let diff = abs(stats.mean.x - historyLuminance);
    let threshold = max(stats.stdDev.x * 0.45, 0.01);
    return smoothstep(threshold, threshold * 2.0, diff);
}

// 5-tap bicubic Catmull-Rom history sampler to minimize reprojection resampling blur
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
    var sumAlpha = 0.0;
    var sumW = 0.0;

    for (var i = 0; i < 5; i++) {
        let sampleRGBA = textureSampleLevel(tex, smp, coords[i], 0.0);
        let sampleRGB = max(sampleRGBA.rgb, vec3<f32>(0.0));
        let w = weights[i];

        sumRGB += sampleRGB * w;
        sumAlpha += sampleRGBA.a * w;
        sumW += w;
    }

    var result: SampledColor;
    let invSumW = 1.0 / max(sumW, EPSILON);
    result.rgb = sumRGB * invSumW;
    result.ycocg = rgbToYCoCg(result.rgb);
    result.alpha = sumAlpha * invSumW;
    return result;
}

// Computes local screen-space velocity variance across 4-cardinal neighbors to detect motion boundaries
fn calculate_velocity_variance(tex: texture_2d<f32>, centerCoord: vec2<i32>, centerVel: vec2<f32>, screenSize: vec2<f32>) -> f32 {
    let velR = textureLoad(tex, centerCoord + vec2<i32>(1, 0), 0).xy;
    let velL = textureLoad(tex, centerCoord - vec2<i32>(1, 0), 0).xy;
    let velU = textureLoad(tex, centerCoord + vec2<i32>(0, 1), 0).xy;
    let velD = textureLoad(tex, centerCoord - vec2<i32>(0, 1), 0).xy;

    let dR = (velR - centerVel) * screenSize;
    let dL = (velL - centerVel) * screenSize;
    let dU = (velU - centerVel) * screenSize;
    let dD = (velD - centerVel) * screenSize;

    let varSq = dot(dR, dR) + dot(dL, dL) + dot(dU, dU) + dot(dD, dD);
    return sqrt(varSq * 0.25);
}

// Increases current-frame blend weight in translucent regions where motion vectors may not match
fn get_reactive_transparency_weight(stats: NeighborhoodStats) -> f32 {
    return saturate(1.0 - stats.meanAlpha);
}

// Karis reversible luminance-weighted tone map to suppress HDR fireflies during temporal filtering
fn reversible_tonemap(rgb: vec3<f32>) -> vec3<f32> {
    let luma = max(dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722)), 0.0);
    return rgb / (1.0 + luma);
}

// Inverse Karis tone map to restore linear HDR radiance before storing to the history buffer
fn inverse_tonemap(rgb: vec3<f32>) -> vec3<f32> {
    let luma = max(dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722)), 0.0);
    return rgb / max(1.0 - luma, 1e-4);
}

// Clips history YCoCg color toward current pixel color against a variance-guided AABB using slab intersection
fn clip_history_ray_box_ycocg(
    historyYCoCg: vec3<f32>,
    currentYCoCg: vec3<f32>,
    stats: NeighborhoodStats,
    motion: f32,
    velVariance: f32
) -> vec3<f32> {
    let edgeTighten = smoothstep(0.1, 1.5, velVariance);
    let baseGamma = mix(2.25, 2.75, motion);
    let gamma = mix(baseGamma, 1.5, edgeTighten);

    let v_min = max(stats.minColor, stats.mean - stats.stdDev * gamma);
    let v_max = min(stats.maxColor, stats.mean + stats.stdDev * gamma);

    let rayDir = currentYCoCg - historyYCoCg;
    let invDir = 1.0 / select(rayDir, sign(rayDir) * 1e-5, abs(rayDir) < vec3<f32>(1e-5));

    let t0 = (v_min - historyYCoCg) * invDir;
    let t1 = (v_max - historyYCoCg) * invDir;

    let tMin = min(t0, t1);
    let tMax = max(t0, t1);

    let tEnter = max(max(tMin.x, tMin.y), tMin.z);
    let tExit = min(min(tMax.x, tMax.y), tMax.z);

    if (tEnter <= tExit && tEnter >= 0.0 && tEnter <= 1.0) {
        return historyYCoCg + rayDir * tEnter;
    }

    return clamp(historyYCoCg, v_min, v_max);
}
