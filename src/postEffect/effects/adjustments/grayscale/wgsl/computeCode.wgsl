// [KO] 1. 인덱스 및 컬러 로드
// [EN] 1. Load index and color
let index = vec2<u32>(global_id.xy);
var color: vec4<f32> = textureLoad(sourceTexture, index, 0);

// [KO] 2. 휘도(Luminance) 계산
// [EN] 2. Calculate Luminance
// [KO] 공용 라이브러리의 getLuminance 함수를 사용하여 일관된 흑백 변환을 제공합니다.
// [EN] Provides consistent grayscale conversion using the getLuminance function from the shared library.
let gray = getLuminance(color.rgb);

// [KO] 3. 원본과 흑백 이미지 합성 및 저장
// [EN] 3. Blend original and grayscale image and store
let finalColor = mix(color, vec4<f32>(gray, gray, gray, color.a), uniforms.amount);
textureStore(outputTexture, index, finalColor);
