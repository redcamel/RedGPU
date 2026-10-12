#redgpu_include color.rgbToYCoCg
#redgpu_include color.YCoCgToRgb
#redgpu_include depth.getLinearizeDepth
#redgpu_include math.EPSILON
#redgpu_include math.reconstruct.getWorldNormalFromGNormalBuffer
#redgpu_include math.reconstruct.getWorldPositionFromDepth

/**
 * [KO] TAA 균일 버퍼(UBO) 구조체 (CPU 바인딩 1:1 매핑)
 * [EN] TAA Uniform Buffer (UBO) structure (1:1 mapping with CPU binding)
 */
struct Uniforms {
    frameIndex: f32,
    pad0: f32, // vec2 정렬 충족을 위한 명시적 4B 스칼라 패딩
    currJitterOffset: vec2<f32>,
    prevJitterOffset: vec2<f32>,
    pad1: f32, // 16바이트 바운더리 완성용 끝단 패딩
    pad2: f32,
};

/**
 * [KO] 3x3 국소 픽셀 영역 통계 데이터 구조체 (YCoCg 색공간 및 Alpha, 16B Coalesced 패킹)
 * [EN] 3x3 Local pixel neighborhood statistical data structure (YCoCg color space & Alpha, 16B Coalesced packing)
 */
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

/**
 * [KO] 샘플링된 색상 및 색공간 변환 캐시 구조체
 * [EN] Sampled color and color space conversion cache structure
 */
struct SampledColor {
    rgb: vec3<f32>,
    ycocg: vec3<f32>,
    alpha: f32,
};

// =============================================================================
// 1. 공용 엔진 모듈 연계 기하학적 신뢰도 판별 (Geometric Discontinuity Rejection)
// =============================================================================

/**
 * [KO] 3D 월드 역투영 기반 정밀 재투영 기대 깊이(Expected Depth) 오차 물리 검증
 * [EN] Physics-based expected reprojection depth error validation via 3D world position reconstruction
 */
fn get_geometric_depth_confidence(currUV: vec2<f32>, currDepth: f32, prevDepth: f32) -> f32 {
    let worldPos = getWorldPositionFromDepth(currUV, currDepth, systemUniforms.projection.inverseProjectionViewMatrix);
    let prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);
    let expectedPrevDepth = prevClipPos.z / max(prevClipPos.w, 1e-5);

    let expectedLinear = getLinearizeDepth(expectedPrevDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping);
    let actualLinear = getLinearizeDepth(prevDepth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping);
    let depthDiff = abs(expectedLinear - actualLinear);

    // 카메라 거리에 비례하는 스케일 적응형 허용 오차
    let tolerance = max(0.15, expectedLinear * 0.04);
    return 1.0 - saturate((depthDiff - tolerance * 0.5) / (tolerance * 1.5));
}

/**
 * [KO] G-Buffer 3D 물리 법선 내적 기반 지오메트리 실루엣 에지 판별
 * [EN] Geometric silhouette edge detection based on G-Buffer 3D physical normal dot product
 */
fn get_normal_confidence(currPixelCoord: vec2<i32>, historyCoord: vec2<i32>) -> f32 {
    let currNormalRaw = textureLoad(gBufferNormalTexture, currPixelCoord, 0).xyz;
    let prevNormalRaw = textureLoad(gBufferNormalTexture, historyCoord, 0).xyz;

    let currNormal = getWorldNormalFromGNormalBuffer(currNormalRaw);
    let prevNormal = getWorldNormalFromGNormalBuffer(prevNormalRaw);

    let normalDot = dot(currNormal, prevNormal);
    return smoothstep(0.707, 0.95, normalDot);
}

// =============================================================================
// 2. 워크그룹 공유 메모리(LDS) 및 온칩 신호 재구성 필터 (On-Chip Reconstruction)
// =============================================================================

// 8x8 스레드 타일 + 1픽셀 외곽 패딩 = 10x10 타일 온칩 공유 캐시 (2.0 KB)
var<workgroup> s_color : array<array<vec4<f32>, 10>, 10>;
var<workgroup> s_depth : array<array<f32, 10>, 10>;

/**
 * [KO] LDS 공유 메모리 기반 3x3 국소 영역 통계 산출 (YCoCg 색공간 및 Alpha)
 * [EN] Calculates 3x3 local neighborhood statistics from LDS shared memory (YCoCg space & Alpha)
 */
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

/**
 * [KO] 온칩 3x3 지수 재구성 필터 (Karis 2014 Reconstruction Filter)
 * 하드웨어 바이리니어 블러를 완전히 제거하고, 지터링된 3x3 국소 샘플로부터 픽셀 중심 참값 신호를 복원합니다.
 * [EN] On-chip 3x3 exponential reconstruction filter (Karis 2014)
 * Completely eliminates hardware bilinear blur and recovers true pixel-center signal from 3x3 jittered samples.
 */
fn reconstruct_current_color_ycocg_lds(localCoord: vec2<i32>, jitterOffsetPix: vec2<f32>) -> SampledColor {
    var sumRGB = vec3<f32>(0.0);
    var sumAlpha = 0.0;
    var sumWeight = 0.0;

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let delta = vec2<f32>(f32(x), f32(y)) + jitterOffsetPix;
            let distSq = dot(delta, delta);
            // Karis 2014 / UE5 표준 지수 감쇄 가중치 (Exponential falloff weight: 중심 신호 43% 강화)
            let w = exp(-3.29 * distSq);

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

// =============================================================================
// 3. 히스토리 샘플링 및 분산 클리핑 (History Sampling & Variance Clipping)
// =============================================================================

/**
 * [KO] 히스토리 색상과 국소 통계 간 휘도 불일치 가중치 산출
 * [EN] Calculates luminance discrepancy weight between history color and local neighborhood stats
 */
fn get_color_discrepancy_weight(stats: NeighborhoodStats, historyLuminance: f32) -> f32 {
    let diff = abs(stats.mean.x - historyLuminance);
    let threshold = max(stats.stdDev.x * 0.45, 0.01);
    return smoothstep(threshold, threshold * 2.0, diff);
}

/**
 * [KO] Catmull-Rom 5-Tap 고정밀 바이큐빅 안티 플리커 히스토리 샘플링
 * [EN] Catmull-Rom 5-tap high-precision bicubic anti-flicker history sampling
 */
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
        let sampleLum = dot(sampleRGB, vec3<f32>(0.25, 0.5, 0.25));
        let w = weights[i] * (1.0 / (1.0 + sampleLum));

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

/**
 * [KO] 3x3 국소 십자 방향 모션 벡터 분산(Subpixel Velocity Variance) 산출
 * 움직이는 오브젝트와 배경의 실루엣 경계를 물리적으로 검출합니다.
 * [EN] Calculates 3x3 local cross-pattern subpixel motion vector variance
 * Physically detects silhouette boundaries between moving objects and background.
 */
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

/**
 * [KO] 반투명/파티클 영역 반응형 마스크 가중치 산출 (Reactive Transparency Factor)
 * [EN] Calculates reactive transparency mask weight for translucent/particle regions
 */
fn get_reactive_transparency_weight(stats: NeighborhoodStats) -> f32 {
    // 통계 알파가 1.0 미만인 반투명 영역은 반응성을 높여 이전 프레임 잔상을 즉시 차단
    return saturate(1.0 - stats.meanAlpha);
}

/**
 * [KO] Karis 2014 표준 가역 톤매핑 압축 (Reversible Tonemapping)
 * 고휘도 HDR 하이라이트(스펙큘러, 라이트)의 색상 파단 및 파이어플라이를 안정적인 가역 범위로 압축합니다.
 * [EN] Karis 2014 standard reversible tonemapping compression
 * Compresses high-luminance HDR highlights into a stable reversible range.
 */
fn reversible_tonemap(rgb: vec3<f32>) -> vec3<f32> {
    let luma = max(dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722)), 0.0);
    return rgb / (1.0 + luma);
}

/**
 * [KO] 가역 톤매핑 100% 무손실 역복원 (Inverse Tonemapping)
 * 압축 공간에서 블렌딩된 색상을 원본 HDR 다이내믹 레인지로 무손실 복원합니다.
 * [EN] 100% Lossless Inverse Tonemapping
 * Restores blended color from compressed space back to original HDR dynamic range.
 */
fn inverse_tonemap(rgb: vec3<f32>) -> vec3<f32> {
    let luma = max(dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722)), 0.0);
    return rgb / max(1.0 - luma, 1e-4);
}

/**
 * [KO] 3D 선분-AABB 교차 클리핑 (Ray-Box Segment Clipping in YCoCg)
 * 단순 축별 독립 clamp()의 탈색(Desaturation) 문제를 해결하고, 3D 색상 벡터 방향을 100% 보존합니다.
 * [EN] 3D Ray-Box Segment Clipping in YCoCg
 * Solves color desaturation of per-axis clamp() and preserves 3D color vector direction 100%.
 */
fn clip_history_ray_box_ycocg(historyYCoCg: vec3<f32>, stats: NeighborhoodStats, motion: f32, velVariance: f32) -> vec3<f32> {
    let edgeTighten = smoothstep(0.1, 1.5, velVariance);
    let baseGamma = mix(1.75, 2.25, motion);
    let gamma = mix(baseGamma, 1.25, edgeTighten);

    let v_min = max(stats.minColor, stats.mean - stats.stdDev * gamma);
    let v_max = min(stats.maxColor, stats.mean + stats.stdDev * gamma);

    let boxCenter = (v_min + v_max) * 0.5;
    let boxExtent = max((v_max - v_min) * 0.5, vec3<f32>(EPSILON));

    // 히스토리 기준 중심 상대 좌표
    let p_clip = historyYCoCg - boxCenter;
    let p_unit = p_clip / boxExtent;
    let p_unit_abs = abs(p_unit);
    let max_unit = max(max(p_unit_abs.x, p_unit_abs.y), p_unit_abs.z);

    if (max_unit > 1.0) {
        return boxCenter + p_clip / max_unit;
    }
    return historyYCoCg;
}


