
struct Uniforms {
    exposure: f32,
    contrast: f32,
    brightness: f32,
    _pad: f32,
};
fn aces_filmic(x: vec3<f32>) -> vec3<f32> {
    let a = 2.51;
    let b = 0.03;
    let c = 2.43;
    let d = 0.59;
    let e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3<f32>(0.0), vec3<f32>(1.0));
}
fn linearToneMapping(color: vec3<f32>) -> vec3<f32> {
    return clamp(color, vec3<f32>(0.0), vec3<f32>(1.0));
}
// 🎨 ACES 톤매핑 함수
// 범용 HDR 대응을 위해 수정된 Khronos PBR Neutral 톤매핑
fn khronosPbrNeutralToneMapping(color: vec3<f32>, exposure: f32) -> vec3<f32> {
    // 1. 노출 적용 (함수 내부에서 수행하여 압축 지점을 정확히 계산)
    let x = color * exposure;

    // 2. 파라미터 설정
    // invK를 1.0으로 설정하여 중간 톤의 밝기 손실을 방지합니다.
    let invK: f32 = 1.0;
    let startCompression: f32 = 0.8;

    // 3. 휘도 기준 압축 (RGB 중 최대값 사용)
    let max_col = max(x.r, max(x.g, x.b));

    var res = x;
    if (max_col > startCompression) {
        // 하이라이트 압축 곡선 (더 부드러운 롤오프 적용)
        let diff = max_col - startCompression;
        let offset = diff / (1.0 + diff);
        let scale = (startCompression + offset) / max_col;
        res = x * scale;
    }

    return res * invK;
}
fn toneMappingAcesHill(color: vec3<f32>,exposure:f32) -> vec3<f32> {
    // 0.6 대신 1.0 ~ 1.8 사이의 값을 시도해 보세요.
    // 값이 클수록 전체적인 화면이 밝아집니다.
    let x = color * exposure;

    let a = 2.51;
    let b = 0.03;
    let c = 2.43;
    let d = 0.59;
    let e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), vec3<f32>(0.0), vec3<f32>(1.0));
}
// 🎨 선형 RGB → sRGB 감마 보정
fn linearToSRGB(linearValue: f32) -> f32 {
    if (linearValue <= 0.0031308) {
        return 12.92 * linearValue;
    } else {
        return 1.055 * pow(linearValue, 1.0 / 2.4) - 0.055;
    }
}

// 🎨 명암 조절
fn applyContrast(color: f32, contrast: f32) -> f32 {
    return 0.5 + contrast * (color - 0.5);
}
fn linear_to_srgb(linearColor: vec4<f32>) -> vec4<f32> {
 let cutoff = vec4<f32>(0.0031308);
 let higher = vec4<f32>(1.055) * pow(linearColor, vec4<f32>(1.0/2.4)) - vec4<f32>(0.055);
 let lower = linearColor * vec4<f32>(12.92);

 return vec4<f32>(
   mix(higher.r, lower.r, step(linearColor.r, cutoff.r)),
   mix(higher.g, lower.g, step(linearColor.g, cutoff.g)),
   mix(higher.b, lower.b, step(linearColor.b, cutoff.b)),
   linearColor.a // 알파는 보통 그대로 둡니다
 );
}
