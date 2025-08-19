let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);

if (index.x >= dimensions.x || index.y >= dimensions.y) {
    return;
}

// 🎯 현재 프레임은 지터 없이 그대로 샘플링 (지터는 복사 단계에서 적용됨)
let currentColor = textureLoad(sourceTexture, index);

// 🎯 이전 프레임들 누적 (이미 지터 적용되어 저장된 데이터 사용)
let currentFrameSliceIndex = i32(uniforms.currentFrameSliceIndex);
var accumulatedColor = vec3<f32>(0.0);
var totalWeight = 0.0;

for (var i = 0; i < 8; i++) {
    let frameIndex = (currentFrameSliceIndex - i - 1 + 8) % 8;

    // 🎯 이전 프레임들은 이미 지터가 적용되어 저장되어 있으므로 그대로 로드
    let previousColor = textureLoad(frameBufferArray, vec2<i32>(index), frameIndex, 0).rgb;

    // 🔧 MSAA급 품질을 위한 개선된 가중치 계산
    let frameDistance = f32(i + 1);
    let baseWeight = exp(-frameDistance * 0.1); // 더 완만한 감쇄

    // 초기 프레임에서 더 강한 누적 효과
    let frameBoost = select(1.0, 2.5, uniforms.frameIndex < 16.0);
    let weight = baseWeight * frameBoost;

    accumulatedColor += previousColor * weight;
    totalWeight += weight;
}

// 3x3 neighborhood clamping
var neighborMin = currentColor.rgb;
var neighborMax = currentColor.rgb;

for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
        let sampleCoord = vec2<i32>(i32(index.x) + dx, i32(index.y) + dy);
        if (sampleCoord.x >= 0 && sampleCoord.y >= 0 &&
            sampleCoord.x < i32(dimensions.x) && sampleCoord.y < i32(dimensions.y)) {
            let neighborColor = textureLoad(sourceTexture, vec2<u32>(sampleCoord)).rgb;
            neighborMin = min(neighborMin, neighborColor);
            neighborMax = max(neighborMax, neighborColor);
        }
    }
}

// 🔧 MSAA급 품질을 위한 최종 TAA 처리
var finalColor: vec3<f32>;
if (totalWeight > 0.0) {
    let temporalResult = accumulatedColor / totalWeight;

    // 🔧 더 관대한 Variance Clipping
    var clampedTemporal: vec3<f32>;
    if (uniforms.varianceClipping > 0.5) {
        // 클램핑 범위를 약간 확장
        let expandedMin = neighborMin - vec3<f32>(0.05);
        let expandedMax = neighborMax + vec3<f32>(0.05);
        clampedTemporal = clamp(temporalResult, expandedMin, expandedMax);
    } else {
        clampedTemporal = temporalResult;
    }

    // 🔧 적응형 블렌딩 강도
    let adaptiveBlend = select(uniforms.temporalBlendFactor, uniforms.temporalBlendFactor * 1.2, uniforms.frameIndex < 24.0);
    finalColor = mix(currentColor.rgb, clampedTemporal, adaptiveBlend);
} else {
    finalColor = currentColor.rgb;
}

textureStore(outputTexture, index, vec4<f32>(finalColor, currentColor.a));
