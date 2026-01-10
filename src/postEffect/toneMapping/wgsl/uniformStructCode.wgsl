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

/// ACES Filmic 톤맵핑 (HDR → SDR 압축, 영화 업계 표준)
fn acesFilmicToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    var v = color * exposure;

    // ACES 입력 변환 행렬 (AP0 → AP1)
    let ACESInputMat = mat3x3<f32>(
        vec3<f32>(0.59719, 0.07600, 0.02840),
        vec3<f32>(0.35458, 0.90834, 0.13383),
        vec3<f32>(0.04823, 0.01566, 0.83777)
    );

    // ACES 출력 변환 행렬 (AP1 → sRGB)
    let ACESOutputMat = mat3x3<f32>(
        vec3<f32>( 1.60475, -0.10208, -0.00327),
        vec3<f32>(-0.53108,  1.10813, -0.07276),
        vec3<f32>(-0.07367, -0.00605,  1.07602)
    );

    v = ACESInputMat * v;

    // RRT + ODT fit (S-curve 압축)
    let a = v * (v + 0.0245786) - 0.000090537;
    let b = v * (0.983729 * v + 0.4329510) + 0.238081;
    v = a / b;

    v = ACESOutputMat * v;
    v = clamp(v, vec3<f32>(0.0), vec3<f32>(1.0));

    return linearToSRGB(v);
}

/// Reinhard Extended 톤맵핑 (간단하지만 효과적)
fn reinhardExtendedToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let v = color * exposure;
    let whitePoint = 4.0; // 화이트포인트 (조절 가능)

    let numerator = v * (1.0 + v / (whitePoint * whitePoint));
    let mapped = numerator / (1.0 + v);

    return linearToSRGB(clamp(mapped, vec3<f32>(0.0), vec3<f32>(1.0)));
}

/// 선형 톤맵핑: 노출 + sRGB 보정 (단순 클램프 - HDR에 부적합)
fn linearToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let toneMapped = clamp(color * exposure, vec3<f32>(0.0), vec3<f32>(1.0));
    return linearToSRGB(toneMapped);
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

    mapped = linearToSRGB(mapped);
    return clamp(mapped, vec3<f32>(0.0), vec3<f32>(1.0));
}

/// 명암 조절
fn applyContrast(color: vec3<f32>, contrast: f32) -> vec3<f32> {
    return 0.5 + contrast * (color - 0.5);
}

/// 밝기 조절
fn applyBrightness(color: vec3<f32>, brightness: f32) -> vec3<f32> {
    return color + brightness;
}