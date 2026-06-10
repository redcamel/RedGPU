// [KO] 1. 인덱스 및 컬러 데이터 로드
// [EN] 1. Load index and color data
let index = global_id.xy;
var color: vec4<f32> = textureLoad(sourceTexture, index, 0);

let originalColor = color;
let luminance = getLuminance(color.rgb);

// [KO] 2. 표준 채도(Saturation) 보정
// [EN] 2. Standard Saturation adjustment
if (uniforms.saturation != 0.0) {
    let saturationFactor = 1.0 + uniforms.saturation * 0.01;
    color = vec4<f32>(
        mix(luminance, color.r, saturationFactor),
        mix(luminance, color.g, saturationFactor),
        mix(luminance, color.b, saturationFactor),
        color.a
    );
}

// [KO] 3. 지능형 바이브런스(Vibrance) 보정
// [EN] 3. Intelligent Vibrance adjustment
if (uniforms.vibrance != 0.0) {
    // [KO] 현재 픽셀의 채도 측정 (최대값 - 최소값)
    // [EN] Measure current pixel saturation (Max - Min)
    let maxComponent = max(max(color.r, color.g), color.b);
    let minComponent = min(min(color.r, color.g), color.b);
    let currentSaturation = maxComponent - minComponent;

    // [KO] 채도 보호: 이미 채도가 높은 영역은 강화를 억제 (Banding 및 과포화 방지)
    // [EN] Saturation Protection: Suppress enhancement in already highly saturated areas
    let protectionFactor = 1.0 / (1.0 + exp(6.0 * (currentSaturation - 0.6)));

    // [KO] 피부톤 보호: 붉은색 계열 영역을 감지하여 자연스러운 발색 유지
    // [EN] Skin Tone Protection: Detect red-tinted areas to maintain natural appearance
    var skinToneProtection = 1.0;
    if (color.r > color.g && color.g > color.b) {
        let skinToneAmount = (color.r - color.b) / max(color.r, 0.001);
        skinToneProtection = 1.0 - smoothstep(0.3, 0.8, skinToneAmount) * 0.7;
    }

    // [KO] 최종 보호 계수 결합 및 바이브런스 적용
    // [EN] Combine final protection factors and apply vibrance
    let finalProtection = protectionFactor * skinToneProtection;
    let vibranceStrength = uniforms.vibrance * 0.01 * finalProtection;
    let vibranceFactor = 1.0 + vibranceStrength;

    color = vec4<f32>(
        mix(luminance, color.r, vibranceFactor),
        mix(luminance, color.g, vibranceFactor),
        mix(luminance, color.b, vibranceFactor),
        color.a
    );
}

// [KO] 4. 결과 저장 (안전한 색상 범위 유지)
// [EN] 4. Store result (Maintain safe color range)
color = clamp(color, vec4<f32>(0.0), vec4<f32>(1.0));
textureStore(outputTexture, index, color);
