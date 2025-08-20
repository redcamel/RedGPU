let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);

if (index.x >= dimensions.x || index.y >= dimensions.y) {
    return;
}

// 현재 프레임 샘플링
let currentColor = textureLoad(sourceTexture, index);

// 이전 프레임들 누적
let currentFrameSliceIndex = i32(uniforms.currentFrameSliceIndex);
var accumulatedColor = vec3<f32>(0.0);
var totalWeight = 0.0;
var validFrameCount = 0.0;

// 🎯 더 강력한 8프레임 누적
for (var i = 0; i < 8; i++) {
    let frameIndex = (currentFrameSliceIndex - i - 1 + 8) % 8;
    let previousColor = textureLoad(frameBufferArray, vec2<i32>(index), frameIndex, 0).rgb;

    // 🔧 유효한 프레임인지 체크 (알파값이나 색상 합으로 판단)
    let colorSum = previousColor.r + previousColor.g + previousColor.b;
    if (colorSum > 0.001) { // 유효한 데이터가 있는지 확인
        let frameDistance = f32(i + 1);
        let baseWeight = pow(0.92, frameDistance); // 더 강한 가중치

        // 초기 프레임에서 더 적극적인 누적
        let frameBoost = select(1.0, 2.5, uniforms.frameIndex < 30.0);
        let weight = baseWeight * frameBoost;

        accumulatedColor += previousColor * weight;
        totalWeight += weight;
        validFrameCount += 1.0;
    }
}

// 🔧 더 넓은 5x5 neighborhood (알리아싱 감지를 위해)
var neighborMin = currentColor.rgb;
var neighborMax = currentColor.rgb;
var neighborAvg = currentColor.rgb;
var neighborSamples = 1.0;

for (var dy = -2; dy <= 2; dy++) {
    for (var dx = -2; dx <= 2; dx++) {
        if (dx == 0 && dy == 0) { continue; }

        let sampleCoord = vec2<i32>(i32(index.x) + dx, i32(index.y) + dy);
        if (sampleCoord.x >= 0 && sampleCoord.y >= 0 &&
            sampleCoord.x < i32(dimensions.x) && sampleCoord.y < i32(dimensions.y)) {
            let neighborColor = textureLoad(sourceTexture, vec2<u32>(sampleCoord)).rgb;
            neighborMin = min(neighborMin, neighborColor);
            neighborMax = max(neighborMax, neighborColor);
            neighborAvg += neighborColor;
            neighborSamples += 1.0;
        }
    }
}
neighborAvg = neighborAvg / neighborSamples;

// 🔧 알리아싱 감지 (고주파 변화량 측정)
let colorVariance = length(neighborMax - neighborMin);
let isHighFrequency = colorVariance > 0.1; // 알리아싱 가능성 높음

// 🔧 강화된 TAA 처리
var finalColor: vec3<f32>;
if (totalWeight > 0.0 && validFrameCount >= 2.0) {
    let temporalResult = accumulatedColor / totalWeight;

    // 🔧 적응적 클램핑 - 고주파 영역에서 더 관대하게
    var clampedTemporal: vec3<f32>;
    if (uniforms.varianceClipping > 0.5) {
        let colorRange = neighborMax - neighborMin;
        let clampingFactor = select(0.4, 0.8, isHighFrequency); // 알리아싱 영역에서 더 관대
        let expandedMin = neighborMin - colorRange * clampingFactor;
        let expandedMax = neighborMax + colorRange * clampingFactor;
        clampedTemporal = clamp(temporalResult, expandedMin, expandedMax);
    } else {
        clampedTemporal = temporalResult;
    }

    // 🔧 적응적 블렌딩 - 알리아싱 영역에서 더 강하게
    let baseBlend = uniforms.temporalBlendFactor;
    let highFreqBoost = select(1.0, 1.8, isHighFrequency); // 알리아싱 영역 부스트
    let earlyFrameBoost = select(1.0, 1.5, uniforms.frameIndex < 50.0);
    let adaptiveBlend = baseBlend * highFreqBoost * earlyFrameBoost;

    // 최대 0.9까지 허용 (강한 TAA)
    let finalBlend = min(adaptiveBlend, 0.9);

    finalColor = mix(currentColor.rgb, clampedTemporal, finalBlend);

    // 🔧 디버깅: 중앙 픽셀에 TAA 강도 표시 (개발용)
     if (index.x == dimensions.x / 2u && index.y == dimensions.y / 2u) {
         finalColor = vec3<f32>(finalBlend, validFrameCount / 8.0, colorVariance);
     }
} else {
    // 🔧 유효한 이전 프레임이 없으면 현재 프레임 사용
    finalColor = currentColor.rgb;
}

textureStore(outputTexture, index, vec4<f32>(finalColor, currentColor.a));
