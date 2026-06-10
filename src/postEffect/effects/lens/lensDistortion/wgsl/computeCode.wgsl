// [KO] 1. 인덱스 및 기초 데이터 계산
// [EN] 1. Index and basic data calculation
let index = global_id.xy;
let dimensions = textureDimensions(sourceTexture);
let dimF = vec2<f32>(dimensions);
let invSize = 1.0 / dimF;

let uv = vec2<f32>(index) / dimF;

// [KO] 화면 중앙(0.5)을 기준으로 픽셀 오프셋(DPR 반영)을 더해 최종 왜곡 중심점 계산
// [EN] Calculate final distortion center point by adding pixel offset (DPR reflected) to screen center (0.5)
let uvCenter = vec2<f32>(0.5) + vec2<f32>(uniforms.centerX, uniforms.centerY) * systemUniforms.devicePixelRatio * invSize;

// [KO] 2. 중심 기반 왜곡 계수 산출 (배럴/핀쿠션 시뮬레이션)
// [EN] 2. Calculate center-based distortion factor (Barrel/Pincushion simulation)
let offset = uv - uvCenter;
let distance = length(offset);

// 왜곡 곡률 적용
let distortionFactor = 1.0 + uniforms.distortion * distance * distance;
let distortedUV = uvCenter + offset * distortionFactor;

// [KO] 3. 화면 경계 검사 및 결과 출력
// [EN] 3. Screen boundary check and result output
if (distortedUV.x < 0.0 || distortedUV.x > 1.0 ||
    distortedUV.y < 0.0 || distortedUV.y > 1.0) {
    // 경계를 벗어난 영역은 검은색 처리 (Out of bounds area set to black)
    textureStore(outputTexture, index, vec4<f32>(0.0, 0.0, 0.0, 1.0));
} else {
    // [KO] 하드웨어 선형 샘플링을 통해 왜곡 에지 계단 현상 방지
    // [EN] Prevent aliasing at distortion edges via hardware linear sampling
    let sampledColor = textureSampleLevel(sourceTexture, basicSampler, distortedUV, 0.0);
    textureStore(outputTexture, index, sampledColor);
}
