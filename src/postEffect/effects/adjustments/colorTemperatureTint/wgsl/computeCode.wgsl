// [KO] 1. 인덱스 및 컬러 로드
// [EN] 1. Load index and color
let index = global_id.xy;
var color: vec4<f32> = textureLoad(sourceTexture, index, 0);

let temp = uniforms.temperature;
var tempRGB: vec3<f32>;

// [KO] 2. 캘빈(Kelvin) 온도에 따른 RGB 색상 보정치 근사 계산
// [EN] 2. Approximate RGB color correction values based on Kelvin temperature
// [KO] 미첼 채리티(Mitchell Charity)의 알고리즘을 기반으로 구현되었습니다.
// [EN] Implemented based on Mitchell Charity's algorithm.

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

// [KO] 3. 색온도 중립화 및 틴트(Tint) 적용
// [EN] 3. Color temperature neutralization and Tint application
let neutralTemp: vec3<f32> = vec3<f32>(1.0, 1.0, 1.0);
let tempAdjust: vec3<f32> = tempRGB / neutralTemp;

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

// [KO] 4. 최종 보정치 합성 및 강도(Amount) 적용
// [EN] 4. Combine final correction and apply Amount
let colorAdjust = tempAdjust * tintRGB;
let finalAdjust = mix(vec3<f32>(1.0), colorAdjust, uniforms.amount);

color = vec4<f32>(color.rgb * finalAdjust, color.a);

// [KO] 5. 결과 저장 (안전한 LDR 범위 클램핑)
// [EN] 5. Store result (Safe LDR range clamping)
color = vec4<f32>(clamp(color.rgb, vec3<f32>(0.0), vec3<f32>(1.0)), color.a);
textureStore(outputTexture, index, color);
