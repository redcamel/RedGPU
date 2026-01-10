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


/// 선형 톤맵핑: 노출 + sRGB 보정 (단순 클램프 - HDR에 부적합)
fn linearToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    return color * exposure;
}


/// Khronos PBR Neutral 톤맵핑
fn khronosPbrNeutralToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let v = color * exposure;
    let lum = max(v.r, max(v.g, v.b));
    let logLum = log2(lum);
    let startCompression = 4.26191;

    var mapped = v;
    if (logLum > startCompression) {
        let bhf = 4.0;
        let e = 0.0037930732552754493;
        let exceedance = logLum - startCompression;
        let remappedLogLum = startCompression +
                            (1.0 / bhf) * log(1.0 + exceedance * bhf * e) / (bhf * e);
        let scale = exp2(remappedLogLum) / lum;
        mapped = v * scale;
    }

    return mapped;
}

/// 명암 조절
fn applyContrast(color: vec3<f32>, contrast: f32) -> vec3<f32> {
    return 0.5 + contrast * (color - 0.5);
}

/// 밝기 조절
fn applyBrightness(color: vec3<f32>, brightness: f32) -> vec3<f32> {
    return color + brightness;
}