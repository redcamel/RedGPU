// [KO] 1. 인덱스 및 화면 크기 기반 UV 계산
// [EN] 1. Index and screen size based UV calculation
let index = global_id.xy;
let dimensions = vec2<f32>(postEffectOutputDimensions);
let uv = (vec2<f32>(index) + 0.5) / dimensions;

// [KO] basicSampler를 통한 Bilinear 샘플링으로 1/2 다운샘플 시 2x2 안티앨리어싱 평균 자동 수행
// [EN] Automatically perform 2x2 anti-aliased averaging during 1/2 downsampling via Bilinear sampling with basicSampler
var color: vec4<f32> = textureSampleLevel(sourceTexture, basicSampler, uv, 0.0);

// [KO] 2. 휘도 기반 이진화(Binarization) 수행
// [EN] 2. Perform Luminance-based Binarization
// [KO] 임계값과 휘도를 비교하여 0.0 또는 1.0으로 분류합니다.
// [EN] Compares the threshold with luminance and classifies it as 0.0 or 1.0.
let threshold_value: f32 = uniforms.threshold / 255.0;
var v = 0.0;
if (getLuminance(color.rgb) >= threshold_value) {
    v = 1.0;
}

// [KO] 3. 결과 대입 및 저장 (알파 채널 유지)
// [EN] 3. Assign and store result (Maintain alpha channel)
color = vec4<f32>(v, v, v, color.a);
textureStore(outputTexture, index, color);
