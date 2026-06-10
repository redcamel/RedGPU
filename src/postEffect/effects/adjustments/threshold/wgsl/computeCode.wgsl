// [KO] 1. 인덱스 및 컬러 로드
// [EN] 1. Load index and color
let index = global_id.xy;
var color: vec4<f32> = textureLoad(sourceTexture, index, 0);

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
