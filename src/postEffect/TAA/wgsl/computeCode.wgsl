let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);

if (index.x >= dimensions.x || index.y >= dimensions.y) {
    return;
}

let currentColor = textureLoad(sourceTexture, index);

// 직접 계산으로 변경
let currentFrameSliceIndex = i32(uniforms.frameIndex) % 16;
var accumulatedColor = vec3<f32>(0.0);
var validFrameCount = 0.0;

// 8개 프레임 단순 평균
for (var i = 0; i < 16; i++) {
    let frameIndex = (currentFrameSliceIndex - i - 1 + 16) % 16;
    let previousColor = textureLoad(frameBufferArray, vec2<i32>(index), frameIndex, 0).rgb;

    let colorSum = previousColor.r + previousColor.g + previousColor.b;
    if (colorSum > 0.001) {
        accumulatedColor += previousColor;
        validFrameCount += 1.0;
    }
}

var finalColor: vec3<f32>;

// 정상 TAA 처리
if (validFrameCount >= 2.0) {
    let historyColor = accumulatedColor / validFrameCount;

    // 간단한 3x3 neighbor 분석
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

    let clampedHistory = clamp(historyColor, neighborMin, neighborMax);
    let blendFactor = uniforms.temporalBlendFactor;
    finalColor = mix(currentColor.rgb, clampedHistory, blendFactor);
} else {
    finalColor = currentColor.rgb;
}

textureStore(outputTexture, index, vec4<f32>(finalColor, currentColor.a));
