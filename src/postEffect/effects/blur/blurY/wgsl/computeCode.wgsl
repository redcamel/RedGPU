// [KO] 1. 인덱스 및 기초 데이터 계산
// [EN] 1. Index and basic data calculation
let index = global_id.xy;
let dimensions = vec2<f32>(textureDimensions(sourceTexture));
if (f32(index.x) >= dimensions.x || f32(index.y) >= dimensions.y) { return; }

let invSize = 1.0 / dimensions;
let centerUV = (vec2<f32>(index) + 0.5) * invSize;
// [KO] DPR을 반영하여 물리적 해상도에 맞는 블러 크기 계산
// [EN] Scale blur size by DPR to match physical resolution
let blurSize = uniforms.size * systemUniforms.devicePixelRatio;

var sum: vec4<f32> = vec4<f32>(0.0);
var totalWeight: f32 = 0.0;

// [KO] 2. 최적화된 가우시안 블러 수행 (Y축)
// [EN] 2. Optimized Gaussian Blur execution (Y-axis)
// [KO] 하드웨어 선형 샘플링(Bilinear)을 활용하여 적은 샘플 수로도 매끄러운 품질을 확보합니다.
// [EN] Utilizes hardware linear sampling (Bilinear) to ensure smooth quality even with few samples.
let steps = uniforms.sampleCount; 
for (var i = -steps; i <= steps; i += 1.0) {
    let offsetPixels = (i / steps) * blurSize;

    // 가우시안 곡선 가중치 계산 (Gaussian weight distribution)
    let weight = exp(-0.5 * pow(i / (steps * 0.6), 2.0)); 
    
    let sampleUV = centerUV + vec2<f32>(0.0, offsetPixels * invSize.y);
    sum += textureSampleLevel(sourceTexture, basicSampler, sampleUV, 0.0) * weight;
    totalWeight += weight;
}

// [KO] 3. 가중치 정규화 및 결과 저장
// [EN] 3. Weight normalization and store result
textureStore(outputTexture, index, sum / totalWeight);
