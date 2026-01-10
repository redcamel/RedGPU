struct Uniforms {
    exposure: f32,
    contrast: f32,
    brightness: f32,
    _pad: f32,
};

/// 선형 RGB → sRGB 감마 보정
fn linearToSRGB(linearColor: vec3<f32>) -> vec3<f32> {
    let cutoff = vec3<f32>(0.0031308);
    let gamma = 1.0 / 2.4;

    let higher = 1.055 * pow(linearColor, vec3<f32>(gamma)) - 0.055;
    let lower = 12.92 * linearColor;

    return mix(higher, lower, step(linearColor, cutoff));
}
fn linearToneMapping(color: vec3<f32>, exposure: f32, contrast: f32, brightness: f32) -> vec3<f32> {
    // 1. 순수하게 노출만 적용합니다.
    let exposed = color * exposure;

    // 2. 만약 contrast가 1.0, brightness가 0.0이 아니라면 여기서 '선형적으로' 변합니다.
    // 하지만 None 매핑의 목적은 '원본 그대로'이므로 이 계산이 위험할 수 있습니다.
    // 테스트를 위해 아래처럼 노출만 적용된 값을 먼저 확인해 보세요.
    let adjusted = applyContrast(applyBrightness(exposed, brightness), contrast);

    // 3. 반환값에서 clamp를 제거하거나 sRGB 변환 전후 위치를 고민해야 합니다.
    // 일단 0~1로 자르되, 만약 너무 타면 exposure 값을 낮춰야 합니다.
    return adjusted;
}

/// Khronos PBR Neutral 톤맵핑
fn khronosPbrNeutralToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    var v = color * exposure;
    let lum = max(v.r, max(v.g, v.b));
    let startCompression = 0.8;
    let bhf = 0.8;

    var mapped = v;
    if (lum > startCompression) {
        let exceedance = lum - startCompression;
        let compressedExceedance = exceedance / (exceedance + bhf);
        let compressedLum = startCompression + (1.0 - startCompression) * compressedExceedance;
        mapped = v * (compressedLum / lum);
    }

    let peak = max(mapped.r, max(mapped.g, mapped.b));
    if (peak > 1.0) {
        mapped = mix(mapped, vec3<f32>(peak), (peak - 1.0) / peak);
    }
    return mapped;
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

/// 명암 조절
fn applyContrast(color: vec3<f32>, contrast: f32) -> vec3<f32> {
    return 0.5 + contrast * (color - 0.5);
}

/// 밝기 조절
fn applyBrightness(color: vec3<f32>, brightness: f32) -> vec3<f32> {
    return color + brightness;
}