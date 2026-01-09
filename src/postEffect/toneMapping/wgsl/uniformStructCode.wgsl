struct Uniforms {
    exposure: f32,
    contrast: f32,
    brightness: f32,
    _pad: f32,
};

// 🎨 ACES Filmic 톤매핑
// HDR → SDR 변환, 영화 같은 자연스러운 톤
fn aces_filmic(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let x = color * exposure;
    let a = 2.51;
    let b = 0.03;
    let c = 2.43;
    let d = 0.59;
    let e = 0.14;
    let mapped = (x * (a * x + b)) / (x * (c * x + d) + e);

    // 채도 조절 (0.9 = 10% 채도 감소)
    let luminance = dot(mapped, vec3<f32>(0.2126, 0.7152, 0.0722));
    let desaturated = mix(vec3<f32>(luminance), mapped, 0.9);

    return clamp(desaturated, vec3<f32>(0.0), vec3<f32>(1.0));
}

// 🎨 Linear 톤매핑
// 단순 클램핑, 노출 적용 후 0~1 범위로 제한
fn linearToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    return clamp(color * exposure, vec3<f32>(0.0), vec3<f32>(1.0));
}

// 🎨 Khronos PBR Neutral 톤매핑
// 범용 HDR 대응, 중간 톤 보존, 하이라이트 부드러운 압축
fn khronosPbrNeutralToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    // 1. 노출 적용
    let x = color * exposure;

    // 2. 파라미터 설정
    let invK: f32 = 1.0;
    let startCompression: f32 = 0.8;

    // 3. 휘도 기준 압축 (RGB 중 최대값 사용)
    let max_col = max(x.r, max(x.g, x.b));

    var res = x;
    if (max_col > startCompression) {
        // 하이라이트 압축 곡선
        let diff = max_col - startCompression;
        let offset = diff / (1.0 + diff);
        let scale = (startCompression + offset) / max_col;
        res = x * scale;
    }

    return res * invK;
}

// 🎨 ACES Hill 톤매핑 (기본 추천)
// ACES 필름 톤매핑의 변형, 밝고 선명한 결과
fn toneMappingAcesHill(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let x = color * exposure;
    let a = 2.51;
    let b = 0.03;
    let c = 2.43;
    let d = 0.59;
    let e = 0.14;
    let mapped = (x * (a * x + b)) / (x * (c * x + d) + e);

    // 채도 조절 (0.85 = 15% 채도 감소)
    let luminance = dot(mapped, vec3<f32>(0.2126, 0.7152, 0.0722));
    let desaturated = mix(vec3<f32>(luminance), mapped, 0.85);

    return clamp(desaturated, vec3<f32>(0.0), vec3<f32>(1.0));
}

// 🎨 Reinhard 톤매핑
// 전통적인 톤매핑, 밝은 영역 자연스럽게 압축
fn reinhardToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let x = color * exposure;
    return x / (vec3<f32>(1.0) + x);
}

// 🎨 Reinhard Extended 톤매핑
// Reinhard 개선 버전, 매우 밝은 영역도 디테일 보존
fn reinhardExtendedToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let x = color * exposure;
    let whitePoint = 4.0; // 순백 기준점
    let numerator = x * (vec3<f32>(1.0) + (x / (whitePoint * whitePoint)));
    let denominator = vec3<f32>(1.0) + x;
    return numerator / denominator;
}

// 🎨 Uncharted 2 톤매핑
// 게임 "언차티드 2"에서 사용, 영화 같은 톤
fn uncharted2ToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    let x = color * exposure;
    let A = 0.15; // Shoulder Strength
    let B = 0.50; // Linear Strength
    let C = 0.10; // Linear Angle
    let D = 0.20; // Toe Strength
    let E = 0.02; // Toe Numerator
    let F = 0.30; // Toe Denominator

    let curr = ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
    let W = 11.2; // Linear White Point
    let whiteScale = ((W * (A * W + C * B) + D * E) / (W * (A * W + B) + D * F)) - E / F;

    return curr / whiteScale;
}

// 🎨 선형 RGB → sRGB 감마 보정
// 정확한 sRGB 표준 커브 적용
fn linearToSRGB(linearValue: f32) -> f32 {
    if (linearValue <= 0.0031308) {
        return 12.92 * linearValue;
    } else {
        return 1.055 * pow(linearValue, 1.0 / 2.4) - 0.055;
    }
}

// 🎨 벡터 버전 선형 RGB → sRGB 감마 보정
fn linear_to_srgb(linearColor: vec4<f32>) -> vec4<f32> {
    let cutoff = vec4<f32>(0.0031308);
    let higher = vec4<f32>(1.055) * pow(linearColor, vec4<f32>(1.0/2.4)) - vec4<f32>(0.055);
    let lower = linearColor * vec4<f32>(12.92);

    return vec4<f32>(
        mix(higher.r, lower.r, step(linearColor.r, cutoff.r)),
        mix(higher.g, lower.g, step(linearColor.g, cutoff.g)),
        mix(higher.b, lower.b, step(linearColor.b, cutoff.b)),
        linearColor.a
    );
}

// 🎨 명암 조절
fn applyContrast(color: f32, contrast: f32) -> f32 {
    return 0.5 + contrast * (color - 0.5);
}