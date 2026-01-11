struct Uniforms {
    exposure: f32,
    contrast: f32,
    brightness: f32,
    _pad: f32,
};

/// 선형 RGB → sRGB 감마 보정
fn linearToSRGB(linearColor: vec3<f32>) -> vec3<f32> {
    // sRGB 표준 변환 공식
    let a = 0.055;
    let cutoff = 0.0031308;
    let gamma = 2.4;

    var srgb: vec3<f32>;

    // 각 채널별로 처리
    for (var i = 0; i < 3; i++) {
        let c = linearColor[i];
        if (c <= cutoff) {
            srgb[i] = 12.92 * c;
        } else {
            srgb[i] = (1.0 + a) * pow(c, 1.0 / gamma) - a;
        }
    }

    return srgb;
}
fn linearToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let exposed = color * exposure;
    return exposed;
}

// Khronos PBR Neutral Tonemapping - WGSL
// https://github.com/KhronosGroup/ToneMapping

fn khronosPBRNeutralToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let startCompression: f32 = 0.8 - 0.04;
    let desaturation: f32 = 0.15;

    var col = color * exposure;
    let x = min(col.r, min(col.g, col.b));
    var offset: f32;
    if (x < 0.08) {
        offset = x - 6.25 * x * x;
    } else {
        offset = 0.04;
    }
    col = col - vec3<f32>(offset);

    let peak = max(col.r, max(col.g, col.b));
    if (peak < startCompression) {
        return col;
    }

    let d = 1.0 - startCompression;
    let newPeak = 1.0 - d * d / (peak + d - startCompression);
    col = col * (newPeak / peak);

    let g = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0);
    return mix(col, vec3<f32>(newPeak), g);
}

/// ACES Filmic Narkowicz 톤맵핑
fn acesFilmicNarkowiczToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let v = color * exposure * 1.5;
    let a = 2.51;
    let b = 0.03;
    let c = 2.43;
    let d = 0.59;
    let e = 0.14;
    return (v * (a * v + b)) / (v * (c * v + d) + e);
}

/// ACES Filmic Hill 톤맵핑
fn acesFilmicHillToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let v = color * exposure * 1.6;
    let a1 = v.r * 0.59719 + v.g * 0.35458 + v.b * 0.04823;
    let a2 = v.r * 0.07600 + v.g * 0.90834 + v.b * 0.01566;
    let a3 = v.r * 0.02840 + v.g * 0.13383 + v.b * 0.83777;
    let a = vec3<f32>(a1, a2, a3);
    let b = (a * (a + 0.0245786) - 0.000090537) / (a * (0.983729 * a + 0.4329510) + 0.238081);
    let r = b.r * 1.60475 - b.g * 0.53108 - b.b * 0.07367;
    let g = b.r * -0.10208 + b.g * 1.10813 - b.b * 0.00605;
    let bl = b.r * -0.00327 - b.g * 0.07276 + b.b * 1.07602;
    return vec3<f32>(r, g, bl);
}

/// ACES Filmic Hill Exposure Boost 톤맵핑
fn acesFilmicHillExposureBoostToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let v = color * exposure * 0.6;
    let a1 = v.r * 0.59719 + v.g * 0.35458 + v.b * 0.04823;
    let a2 = v.r * 0.07600 + v.g * 0.90834 + v.b * 0.01566;
    let a3 = v.r * 0.02840 + v.g * 0.13383 + v.b * 0.83777;
    let a = vec3<f32>(a1, a2, a3);
    let b = (a * (a + 0.0245786) - 0.000090537) / (a * (0.983729 * a + 0.4329510) + 0.238081);
    let r = b.r * 1.60475 - b.g * 0.53108 - b.b * 0.07367;
    let g = b.r * -0.10208 + b.g * 1.10813 - b.b * 0.00605;
    let bl = b.r * -0.00327 - b.g * 0.07276 + b.b * 1.07602;
    return vec3<f32>(r, g, bl) / 0.6;
}
fn getFinalSRGB(toneMappedColor:vec3<f32>, contrast: f32, brightness: f32) -> vec3<f32> {
    let contrastRGB = applyContrast(toneMappedColor, uniforms.contrast);
    let finalLinearRGB = applyBrightness(contrastRGB, uniforms.brightness);
    let finalSRGB = clamp(linearToSRGB(finalLinearRGB), vec3<f32>(0.0), vec3<f32>(1.0));
    return finalSRGB;
}
/// 명암 조절
fn applyContrast(color: vec3<f32>, contrast: f32) -> vec3<f32> {
    return 0.5 + contrast * (color - 0.5);
}

/// 밝기 조절
fn applyBrightness(color: vec3<f32>, brightness: f32) -> vec3<f32> {
    return color + brightness;
}