// [KO] 1. 인덱스 및 컬러 로드
// [EN] 1. Load index and color
let index = global_id.xy;
var color: vec4<f32> = textureLoad(sourceTexture, index, 0);

// [KO] 2. 밝기 및 대비 보정값 계산 (8비트 기준 정규화)
// [EN] 2. Calculate brightness and contrast correction values (Normalized based on 8-bit)
let brightness_value: f32 = uniforms.brightness / 255.0;
let contrast_value: f32 = uniforms.contrast / 255.0;

// [KO] 3. 대비(Contrast) 보정 수행
// [EN] 3. Perform Contrast correction
// [KO] 중간 회색(0.5)을 기준으로 색상 범위를 확장하거나 축소합니다.
// [EN] Expands or contracts the color range based on middle gray (0.5).
var tempColor: vec3<f32>;
if (contrast_value > 0.0) {
    // [KO] 대비 증가: 0.5로부터 더 멀어지게 계산
    // [EN] Increase contrast: Calculate to move further away from 0.5
    tempColor = (color.rgb - 0.5) / (1.0 - contrast_value) + 0.5;
} else {
    // [KO] 대비 감소: 0.5에 더 가까워지게 계산
    // [EN] Decrease contrast: Calculate to move closer to 0.5
    tempColor = (color.rgb - 0.5) * (1.0 + contrast_value) + 0.5;
}

// [KO] 4. 밝기(Brightness) 적용 및 알파 채널 유지
// [EN] 4. Apply Brightness and maintain alpha channel
color = vec4<f32>(tempColor + brightness_value, color.a);

// [KO] 5. 결과 저장
// [EN] 5. Store result
textureStore(outputTexture, index, color);
