let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);

if (index.x >= dimensions.x || index.y >= dimensions.y) {
    return;
}

// 현재 프레임 색상
let currentColor = textureLoad(sourceTexture, index);

// 🎯 단순한 이전 프레임 평균 (표준 TAA 방식)
let currentFrameSliceIndex = i32(uniforms.currentFrameSliceIndex);
var accumulatedColor = vec3<f32>(0.0);
var validFrameCount = 0.0;

// 8개 프레임 단순 평균
for (var i = 0; i < 8; i++) {
    let frameIndex = (currentFrameSliceIndex - i - 1 + 8) % 8;
    let previousColor = textureLoad(frameBufferArray, vec2<i32>(index), frameIndex, 0).rgb;

    // 유효성 체크
    let colorSum = previousColor.r + previousColor.g + previousColor.b;
    if (colorSum > 0.001) {
        accumulatedColor += previousColor;
        validFrameCount += 1.0;
    }
}

// 🎯 표준 TAA 블렌딩
var finalColor: vec3<f32>;
if (validFrameCount >= 2.0) {
    let historyColor = accumulatedColor / validFrameCount;

    // 🔧 간단한 3x3 neighbor 분석 (표준)
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

    // 🔧 히스토리 클램핑 (표준 방식)
    let clampedHistory = clamp(historyColor, neighborMin, neighborMax);

    // 🔧 고정 블렌딩 비율 (표준)
    let blendFactor = uniforms.temporalBlendFactor; // 0.95
    finalColor = mix(currentColor.rgb, clampedHistory, blendFactor);

} else {
    finalColor = currentColor.rgb;
}

textureStore(outputTexture, index, vec4<f32>(finalColor, currentColor.a));
