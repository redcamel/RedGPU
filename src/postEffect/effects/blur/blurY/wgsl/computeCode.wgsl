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
if (blurSize <= 0.0) {
    textureStore(outputTexture, index, textureSampleLevel(sourceTexture, basicSampler, centerUV, 0.0));
    return;
}

// [KO] 2. 업계 표준 1D 분리형 가우시안 블러 수행 (Y축)
// [EN] 2. Industry standard 1D Separable Gaussian Blur execution (Y-axis)
// [KO] 3 * sigma = blurSize 기준으로 가우시안 표준편차 산출
// [EN] Calculate standard deviation based on 3 * sigma = blurSize
let sigma = max(blurSize / 3.0, 0.5);
let twoSigmaSq = 2.0 * sigma * sigma;

// 중심 픽셀 샘플링 (weight = 1.0)
let centerColor = textureSampleLevel(sourceTexture, basicSampler, centerUV, 0.0);
var sum: vec4<f32> = centerColor;
var totalWeight: f32 = 1.0;

// [KO] 반경에 맞추어 2픽셀 페어링 탭 수 자동 계산 (1픽셀 빈틈 없는 완전 연속 적분)
// [EN] Automatically calculate 2-pixel paired tap count according to radius (Seamless continuous integration)
let steps = min(ceil(blurSize * 0.5), 64.0);

for (var i = 1.0; i <= steps; i += 1.0) {
    let y1 = 2.0 * i - 1.0;
    let y2 = 2.0 * i;

    let w1 = exp(-(y1 * y1) / twoSigmaSq);
    let w2 = exp(-(y2 * y2) / twoSigmaSq);
    let w = w1 + w2;

    if (w < 0.0001) { break; }

    let offsetPixels = (y1 * w1 + y2 * w2) / w;
    let offsetUV = vec2<f32>(0.0, offsetPixels * invSize.y);

    let samplePositive = textureSampleLevel(sourceTexture, basicSampler, centerUV + offsetUV, 0.0);
    let sampleNegative = textureSampleLevel(sourceTexture, basicSampler, centerUV - offsetUV, 0.0);

    sum += (samplePositive + sampleNegative) * w;
    totalWeight += 2.0 * w;
}

// [KO] 3. 가중치 정규화 및 결과 저장
// [EN] 3. Weight normalization and store result
textureStore(outputTexture, index, sum / totalWeight);
