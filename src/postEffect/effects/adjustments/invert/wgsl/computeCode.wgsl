// [KO] 1. 인덱스 및 컬러 로드
// [EN] 1. Load index and color
let index = vec2<u32>(global_id.xy);
var color: vec4<f32> = textureLoad(sourceTexture, index, 0);

// [KO] 2. 보색 반전 및 강도 적용
// [EN] 2. Complementary inversion and apply intensity
let invertedRGB = 1.0 - color.rgb;
let finalColor = vec4<f32>(mix(color.rgb, invertedRGB, uniforms.amount), color.a);

// [KO] 3. 결과 저장
// [EN] 3. Store result
textureStore(outputTexture, index, finalColor);

