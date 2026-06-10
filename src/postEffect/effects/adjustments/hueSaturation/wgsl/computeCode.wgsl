// [KO] 1. 인덱스 및 컬러 로드
// [EN] 1. Load index and color
let index = global_id.xy;
var color: vec4<f32> = textureLoad(sourceTexture, index, 0);

// [KO] 2. 색상 회전(Hue Rotation) 계산
// [EN] 2. Calculate Hue Rotation
// [KO] 지정된 각도만큼 RGB 공간에서 색상을 회전시키기 위한 가중치 행렬을 생성합니다.
// [EN] Generates a weight matrix to rotate colors in RGB space by the specified angle.
let hue_value: f32 = uniforms.hue / 180.0;
let angle: f32 = hue_value * PI;
let s: f32 = sin(angle);
let c: f32 = cos(angle);

// [KO] RGB 회전 매트릭스 가중치 산출
// [EN] RGB rotation matrix weight calculation
var weights: vec3<f32> = (vec3<f32>(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;

color = vec4<f32>(
    vec3<f32>(
        dot(color.rgb, weights.xyz),
        dot(color.rgb, weights.zxy),
        dot(color.rgb, weights.yzx)
    ),
    color.a
);

// [KO] 3. 채도(Saturation) 보정 수행
// [EN] 3. Perform Saturation correction
// [KO] 휘도(Luminance) 정보를 기준으로 원본 색상과의 차이를 조절하여 채도를 변화시킵니다.
// [EN] Adjusts the difference from the original color based on luminance information to change saturation.
let saturation_value: f32 = uniforms.saturation / 100.0;
let luminance = getLuminance(color.rgb);

if (saturation_value > 0.0) {
    // [KO] 채도 증가: 휘도로부터 멀어지게 계산
    // [EN] Increase saturation: Calculate to move further away from luminance
    color = vec4<f32>(
        color.rgb + (luminance - color.rgb) * (1.0 - 1.0 / (1.001 - saturation_value)),
        color.a
    );
} else {
    // [KO] 채도 감소: 휘도에 가까워지게 계산
    // [EN] Decrease saturation: Calculate to move closer to luminance
    color = vec4<f32>(
        color.rgb + (luminance - color.rgb) * (-saturation_value),
        color.a
    );
}

// [KO] 4. 결과 저장
// [EN] 4. Store result
textureStore(outputTexture, index, color);
