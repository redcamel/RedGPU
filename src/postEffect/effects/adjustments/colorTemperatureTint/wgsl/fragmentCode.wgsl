let amount = uniforms.amount;
let temp = uniforms.temperature;
var tempRGB: vec3<f32>;

// [KO] 1. 캘빈(Kelvin) 온도에 따른 RGB 색상 보정치 근사 계산 (Mitchell Charity 알고리즘)
// [EN] 1. Approximate RGB color correction values based on Kelvin temperature (Mitchell Charity's algorithm)

// RED 채널 계산
if (temp <= 6600.0) {
    tempRGB.r = 1.0;
} else {
    let t = temp - 6600.0;
    tempRGB.r = clamp(1.292936 * pow(t, -0.1332047), 0.0, 1.0);
}

// GREEN 채널 계산
if (temp <= 6600.0) {
    let t = temp;
    tempRGB.g = clamp(0.39008157 * log(t) - 0.63184144, 0.0, 1.0);
} else {
    let t = temp - 6600.0;
    tempRGB.g = clamp(1.292936 * pow(t, -0.1332047), 0.0, 1.0);
}

// BLUE 채널 계산
if (temp >= 6600.0) {
    tempRGB.b = 1.0;
} else if (temp <= 1900.0) {
    tempRGB.b = 0.0;
} else {
    let t = temp - 1000.0;
    tempRGB.b = clamp(0.543206789 * log(t) - 1.19625408, 0.0, 1.0);
}

// [KO] 2. 틴트(Tint) 적용
// [EN] 2. Tint application
let tintValue = uniforms.tint * 0.01;
var tintRGB: vec3<f32>;
if (tintValue >= 0.0) {
    // [KO] 플러스 틴트: 그린 계열 강화 (마젠타 억제)
    // [EN] Positive Tint: Enhance green tones (suppress magenta)
    tintRGB = vec3<f32>(1.0 - tintValue * 0.2, 1.0, 1.0 - tintValue * 0.2);
} else {
    // [KO] 마이너스 틴트: 마젠타 계열 강화 (그린 억제)
    // [EN] Negative Tint: Enhance magenta tones (suppress green)
    let mag = -tintValue;
    tintRGB = vec3<f32>(1.0, 1.0 - mag * 0.2, 1.0);
}

// [KO] 3. 최종 보정치 합성 및 강도(Amount) 적용 (ROP Multiplicative Blend: dst.rgb * finalAdjust)
// [EN] 3. Combine final correction and apply Amount (ROP Multiplicative Blend: dst.rgb * finalAdjust)
let colorAdjust = tempRGB * tintRGB;
let finalAdjust = clamp(mix(vec3<f32>(1.0), colorAdjust, amount), vec3<f32>(0.0), vec3<f32>(1.0));

if (all(finalAdjust >= vec3<f32>(0.9999))) {
    discard;
    return vec4<f32>(1.0);
}

return vec4<f32>(finalAdjust, 1.0);
