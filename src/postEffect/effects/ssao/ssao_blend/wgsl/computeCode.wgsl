// [KO] 1. 인덱스 계산
// [EN] 1. Index calculation
let index = global_id.xy;

// [KO] 2. 원본 디퓨즈 컬러와 계산된 AO 데이터 로드
// [EN] 2. Load original diffuse color and calculated AO data
var diffuse: vec4<f32> = textureLoad(sourceTexture0, index, 0);
var blur: vec4<f32> = textureLoad(sourceTexture1, index, 0);

// [KO] 3. 최종 컬러 합성 (AO 값을 곱하여 음영 적용)
// [EN] 3. Final color composition (Apply shading by multiplying AO value)
let finalColor = vec4<f32>(diffuse.rgb * blur.rgb, diffuse.a);

// [KO] 4. 결과 저장
// [EN] 4. Store result
textureStore(outputTexture, index, finalColor);
