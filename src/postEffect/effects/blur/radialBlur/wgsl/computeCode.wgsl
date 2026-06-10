// [KO] 1. 인덱스 및 극좌표 데이터 계산
// [EN] 1. Index and polar coordinate calculation
let index = global_id.xy;
let dimensions = vec2<f32>(textureDimensions(sourceTexture));
if (f32(index.x) >= dimensions.x || f32(index.y) >= dimensions.y) { return; }

let invSize = 1.0 / dimensions;
let centerUV = (vec2<f32>(index) + 0.5) * invSize;

// [KO] 화면 중앙(0.5)을 기준으로 픽셀 오프셋(DPR 반영)을 더해 최종 중심점 계산
// [EN] Calculate final center point by adding pixel offset (DPR reflected) to screen center (0.5)
let center = vec2<f32>(0.5) + vec2<f32>(uniforms.centerX, uniforms.centerY) * systemUniforms.devicePixelRatio * invSize;

let toPixel = centerUV - center;
let distance = length(toPixel);
let angle = atan2(toPixel.y, toPixel.x);

// [KO] 2. 회전각 가중치 및 샘플링 루프
// [EN] 2. Rotation angle weighting and sampling loop
let rotationAngle = uniforms.amount * distance * 0.005;
let sampleCount = i32(uniforms.sampleCount);

var sum = vec4<f32>(0.0);
var totalWeight = 0.0;

for (var i = 0; i < sampleCount; i = i + 1) {
    let t = f32(i) / f32(sampleCount - 1);
    let sampleAngle = angle + (t - 0.5) * rotationAngle;

    // 회전된 좌표를 다시 UV로 변환 (Convert rotated coords back to UV)
    let sampleUV = center + vec2<f32>(
        cos(sampleAngle) * distance,
        sin(sampleAngle) * distance
    );

    // 텐트형 가중치 적용 (Tent-shaped weighting)
    let weight = 1.0 - abs(t - 0.5) * 1.5;
    sum += textureSampleLevel(sourceTexture, basicSampler, sampleUV, 0.0) * max(weight, 0.1);
    totalWeight += weight;
}

// [KO] 3. 중심부 감쇠 및 최종 합성
// [EN] 3. Central falloff and final composition
// [KO] 중심점이 너무 급격하게 뭉개지지 않도록 부드럽게 보정합니다.
// [EN] Smoothly correct so that the center point is not too abruptly blurred.
let centerFalloff = smoothstep(0.0, 0.1, distance);
let originalColor = textureSampleLevel(sourceTexture, basicSampler, centerUV, 0.0);
let blurredColor = sum / totalWeight;

textureStore(outputTexture, index, mix(originalColor, blurredColor, centerFalloff));
