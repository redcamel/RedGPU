// [KO] 1. 인덱스 및 기초 데이터 계산
// [EN] 1. Index and basic data calculation
let index = global_id.xy;
let dimensions = vec2<f32>(textureDimensions(sourceTexture));
if (f32(index.x) >= dimensions.x || f32(index.y) >= dimensions.y) { return; }

let invSize = 1.0 / dimensions;
let centerUV = (vec2<f32>(index) + 0.5) * invSize;
let center = vec2<f32>(0.5) + vec2<f32>(uniforms.centerX, uniforms.centerY) * 0.5;

// [KO] 2. 중심점을 향하는 벡터 산출 및 샘플링 루프
// [EN] 2. Calculate vector towards center and sampling loop
let dir = (center - centerUV) * (uniforms.amount * 0.01);

var sum = vec4<f32>(0.0);
var totalWeight = 0.0;
let steps = uniforms.sampleCount;

for (var i = -steps; i <= steps; i += 1.0) {
    let t = i / steps;
    
    // 선형 감쇠 가중치 (Linear falloff weight)
    let weight = 1.0 - abs(t);
    
    let sampleUV = centerUV + dir * t;
    sum += textureSampleLevel(sourceTexture, basicSampler, sampleUV, 0.0) * weight;
    totalWeight += weight;
}

// [KO] 3. 가중치 정규화 및 결과 저장
// [EN] 3. Weight normalization and store result
textureStore(outputTexture, index, sum / totalWeight);
