#redgpu_include color.getLuminance
#redgpu_include color.rgbToYCoCg
#redgpu_include color.YCoCgToRgb
#redgpu_include depth.getLinearizeDepth
#redgpu_include math.EPSILON
#redgpu_include math.reconstruct.getWorldNormalFromGNormalBuffer
#redgpu_include math.reconstruct.getWorldPositionFromDepth

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

// 🌟 [공용 모듈: 3D 월드 역투영 기반 정밀 재투영 기대 깊이(Expected Reprojection Depth) 검증]
fn get_geometric_depth_confidence(currUV: vec2<f32>, currDepth: f32, prevDepth: f32) -> f32 {
    let worldPos = getWorldPositionFromDepth(currUV, currDepth, systemUniforms.projection.inverseProjectionViewMatrix);
    let prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);
    let expectedPrevDepth = prevClipPos.z / max(prevClipPos.w, 1e-5);

    let expectedLinear = getLinearizeDepth(expectedPrevDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping);
    let actualLinear = getLinearizeDepth(prevDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping);
    let depthDiff = abs(expectedLinear - actualLinear);

    let tolerance = max(0.2, expectedLinear * 0.05);
    return 1.0 - clamp((depthDiff - tolerance * 0.5) / (tolerance * 1.5), 0.0, 1.0);
}

// 🌟 [공용 모듈: G-Buffer 3D 물리 법선 내적 기반 지오메트리 실루엣 에지 판별 (Normal Discontinuity)]
fn get_normal_confidence(currPixelCoord: vec2<i32>, historyCoord: vec2<i32>) -> f32 {
    let currNormalRaw = textureLoad(gBufferNormalTexture, currPixelCoord, 0).xyz;
    let prevNormalRaw = textureLoad(gBufferNormalTexture, historyCoord, 0).xyz;

    let currNormal = getWorldNormalFromGNormalBuffer(currNormalRaw);
    let prevNormal = getWorldNormalFromGNormalBuffer(prevNormalRaw);

    // 두 법선의 내적 (각도 차이 판별, 45도 이상 꺾인 면은 히스토리 감쇄)
    let normalDot = dot(currNormal, prevNormal);
    return smoothstep(0.707, 0.95, normalDot);
}

fn fetch_depth_point(uv: vec2<f32>, screenSize: vec2<f32>) -> f32 {
    let size = vec2<i32>(textureDimensions(prevDepthTexture));
    let coord = clamp(vec2<i32>(uv * screenSize), vec2<i32>(0), size - 1);
    return textureLoad(prevDepthTexture, coord, 0);
}

// ===== 1.5. LDS (Workgroup Shared Memory) 선언 =====
// 8x8 타일 + 1픽셀 외곽 패딩 = 10x10 타일 (총 2.0 KB 온칩 캐시)
var<workgroup> s_color : array<array<vec4<f32>, 10>, 10>;
var<workgroup> s_depth : array<array<f32, 10>, 10>;

fn calculate_neighborhood_stats_ycocg_lds(localCoord: vec2<i32>) -> NeighborhoodStats {
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
            let samplePos = localCoord + vec2<i32>(x, y);
            let colorRGBA = s_color[samplePos.y][samplePos.x];
            let colorRGB = colorRGBA.rgb;
            let colorYCoCg = rgbToYCoCg(colorRGB);
            let lum = getLuminance(colorRGB);
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

// 🚀 [표준 TAA: 온칩 3x3 서브픽셀 신호 재구성 필터 (Exponential Reconstruction Filter)]
// 하드웨어 바이리니어 블러를 완전히 제거하고, 지터링된 3x3 샘플로부터 픽셀 중심 참값 신호를 복원합니다.
fn reconstruct_current_color_ycocg_lds(localCoord: vec2<i32>, jitterOffsetPix: vec2<f32>) -> SampledColor {
    var sumRGB = vec3<f32>(0.0);
    var sumAlpha = 0.0;
    var sumWeight = 0.0;

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let delta = vec2<f32>(f32(x), f32(y)) + jitterOffsetPix;
            let distSq = dot(delta, delta);
            // 🚀 Karis 2014 표준 지수 재구성 필터 (Exponential Reconstruction Weight)
            let w = exp(-2.29 * distSq);

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

fn get_color_discrepancy_weight(stats: NeighborhoodStats, histRGB: vec3<f32>) -> f32 {
    let histLuminance = getLuminance(histRGB);
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
        let sampleYCoCg = rgbToYCoCg(sampleRGB);
        let sampleLum = getLuminance(sampleRGB);

        // [KO] 엔진 표준 휘도(Rec. 709)를 기반으로 안티 플리커 가중치 계산
        // [EN] Calculate anti-flicker weight based on engine standard luminance (Rec. 709)
        let w = weights[i] * (1.0 / (1.0 + sampleLum));

        sumRGB += sampleRGB * w;
        sumYCoCg += sampleYCoCg * w;
        sumAlpha += sampleRGBA.a * w;
        sumW += w;
    }

    var result: SampledColor;
    let invSumW = 1.0 / max(sumW, EPSILON);
    result.rgb = sumRGB * invSumW;
    result.ycocg = sumYCoCg * invSumW;
    result.alpha = sumAlpha * invSumW;
    return result;
}

fn clip_history_ycocg(historyYCoCg: vec3<f32>, stats: NeighborhoodStats, motion: f32) -> vec3<f32> {
    // [KO] 언리얼 엔진 / Playdead 표준 Variance Clipping 교집합 박스 (원거리 서브픽셀 디테일 안정화)
    // [EN] Unreal Engine / Playdead standard Variance Clipping intersection box (Far subpixel detail stabilization)
    let gamma = mix(1.50, 2.25, motion);
    let v_min = max(stats.minColor, stats.mean - stats.stdDev * gamma);
    let v_max = min(stats.maxColor, stats.mean + stats.stdDev * gamma);
    return clamp(historyYCoCg, v_min, v_max);
}
