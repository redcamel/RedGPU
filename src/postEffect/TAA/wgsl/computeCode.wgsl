{
    // ---------- Initialize Basic Parameters ----------
    let pixelCoord = vec2<u32>(global_id.xy);
    let screenSize = vec2<f32>(textureDimensions(sourceTexture));

    if (any(pixelCoord >= vec2<u32>(screenSize))) {
        return;
    }

    let currentPixelColor = textureLoad(sourceTexture, pixelCoord).rgb;
    let motionData = textureLoad(motionVectorTexture, pixelCoord, 0);
    let velocity = motionData.xy;

    // ---------- Early Exit Conditions ----------
    let jitterDisabled = motionData.z > 0.5;
    if (jitterDisabled) {
        textureStore(outputTexture, pixelCoord, vec4<f32>(currentPixelColor, 1.0));
        return;
    }

    if (uniforms.frameIndex < 3.0) {
        textureStore(outputTexture, pixelCoord, vec4<f32>(currentPixelColor, 1.0));
        return;
    }

    if (uniforms.useMotionVectors < 0.5) {
        let historyColor = textureLoad(previousFrameTexture, pixelCoord).rgb;
        let blendWeight = clamp(uniforms.temporalBlendFactor, 0.05, 0.8);
        let blendedResult = mix(historyColor, currentPixelColor, blendWeight);
        textureStore(outputTexture, pixelCoord, vec4<f32>(blendedResult, 1.0));
        return;
    }

    // ---------- Motion Analysis ----------
    let velocityMagnitude = length(velocity);
    let staticThreshold = 0.5;
    let isStaticPixel = velocityMagnitude < staticThreshold;

    let currentLuma = dot(currentPixelColor, vec3<f32>(0.2126, 0.7152, 0.0722));
    let isLowLuma = currentLuma < 0.1;
    let isThinDetail = isLowLuma || currentLuma > 0.9;

    // ---------- History Sampling ----------
    let currentWorldPos = vec2<f32>(pixelCoord) + vec2<f32>(0.5);
    let historyWorldPos = currentWorldPos - velocity;

    if (any(historyWorldPos < vec2<f32>(0.5)) || any(historyWorldPos >= screenSize - vec2<f32>(0.5))) {
        textureStore(outputTexture, pixelCoord, vec4<f32>(currentPixelColor, 1.0));
        return;
    }

    let motionBlurWeight = smoothstep(0.5, 8.0, velocityMagnitude) * uniforms.motionBlurReduction;

    let samplePos = historyWorldPos - vec2<f32>(0.5);
    let floorPos = floor(samplePos);
    let fracPos = samplePos - floorPos;
    let baseCoord = vec2<u32>(floorPos);

    let sample_TL = textureLoad(previousFrameTexture, baseCoord).rgb;
    let sample_TR = textureLoad(previousFrameTexture, baseCoord + vec2<u32>(1, 0)).rgb;
    let sample_BL = textureLoad(previousFrameTexture, baseCoord + vec2<u32>(0, 1)).rgb;
    let sample_BR = textureLoad(previousFrameTexture, baseCoord + vec2<u32>(1, 1)).rgb;

    let interpolated_Top = mix(sample_TL, sample_TR, fracPos.x);
    let interpolated_Bottom = mix(sample_BL, sample_BR, fracPos.x);
    let historySample = mix(interpolated_Top, interpolated_Bottom, fracPos.y);

    // ---------- Neighborhood Analysis (Optimized) ----------
    var neighborColorMin = currentPixelColor;
    var neighborColorMax = currentPixelColor;
    var neighborColorSum = vec3<f32>(0.0);
    var neighborColorSumSquared = vec3<f32>(0.0);
    var totalWeight = 0.0;

    let optimizedOffsets = array<vec2<i32>, 8>(
        vec2<i32>(0, -1),   // 위
        vec2<i32>(-1, 0),   // 왼쪽
        vec2<i32>(1, 0),    // 오른쪽
        vec2<i32>(0, 1),    // 아래
        vec2<i32>(-1, -1),  // 왼쪽 위
        vec2<i32>(1, -1),   // 오른쪽 위
        vec2<i32>(-1, 1),   // 왼쪽 아래
        vec2<i32>(1, 1)     // 오른쪽 아래
    );

    // 중앙 픽셀 가중치 (이미 샘플링된 currentPixelColor 사용)
    let centerSampleWeight = select(0.2, 0.4, isThinDetail);
    let neighborWeight = 0.1;

    // 8개 이웃 픽셀 가중치
    let neighborWeights = array<f32, 8>(
        neighborWeight, neighborWeight, neighborWeight, neighborWeight,
        neighborWeight, neighborWeight, neighborWeight, neighborWeight
    );

    // 중앙 픽셀을 먼저 처리
    neighborColorMin = min(neighborColorMin, currentPixelColor);
    neighborColorMax = max(neighborColorMax, currentPixelColor);

    let centerWeightedColor = currentPixelColor * centerSampleWeight;
    neighborColorSum += centerWeightedColor;
    neighborColorSumSquared += currentPixelColor * currentPixelColor * centerSampleWeight;
    totalWeight += centerSampleWeight;

    let lumaCoeffs = vec3<f32>(0.2126, 0.7152, 0.0722);

    // 8개 이웃 픽셀만 루프 처리
    for (var idx = 0; idx < 8; idx++) {
        let sampleCoord = vec2<i32>(pixelCoord) + optimizedOffsets[idx];
        let clampedCoord = clamp(
            sampleCoord,
            vec2<i32>(0),
            vec2<i32>(screenSize) - vec2<i32>(1)
        );

        let neighborPos = vec2<u32>(clampedCoord);
        let neighborColor = textureLoad(sourceTexture, neighborPos).rgb;
        let sampleWeight = neighborWeights[idx];

        neighborColorMin = min(neighborColorMin, neighborColor);
        neighborColorMax = max(neighborColorMax, neighborColor);

        let weightedSample = neighborColor * sampleWeight;
        neighborColorSum += weightedSample;
        neighborColorSumSquared += neighborColor * neighborColor * sampleWeight;
        totalWeight += sampleWeight;
    }

    // ---------- Statistical Analysis ----------
    neighborColorSum = neighborColorSum / totalWeight;
    neighborColorSumSquared = neighborColorSumSquared / totalWeight;

    let basicClampedHistory = clamp(historySample, neighborColorMin, neighborColorMax);

    let neighborMean = neighborColorSum;
    let neighborVariance = neighborColorSumSquared - (neighborMean * neighborMean);
    let neighborStdDev = sqrt(max(neighborVariance, vec3<f32>(0.0001)));

    let baseVarianceScale = select(1.5, 5.0, isThinDetail);
    let staticVarianceScale = select(baseVarianceScale, baseVarianceScale * 1.5, isStaticPixel);
    let adaptiveScale = mix(staticVarianceScale, staticVarianceScale * 0.3, min(velocityMagnitude / 20.0, 1.0));

    let varianceClampMin = neighborMean - neighborStdDev * adaptiveScale;
    let varianceClampMax = neighborMean + neighborStdDev * adaptiveScale;
    let finalClampedHistory = clamp(basicClampedHistory, varianceClampMin, varianceClampMax);

    // ---------- Rejection Analysis ----------
    let historyLuma = dot(finalClampedHistory, lumaCoeffs);
    let lumaDifference = abs(historyLuma - currentLuma);
    let colorDistance = length(currentPixelColor - finalClampedHistory);

    let baseRejectionThresh = select(0.05, 0.15, isThinDetail);
    let motionScale = clamp(velocityMagnitude / 2.0, 0.1, 1.0);
    let dynamicRejectionScale = mix(10.0, 1.0, motionScale);

    let finalRejectionThresh = select(baseRejectionThresh, baseRejectionThresh * dynamicRejectionScale, isStaticPixel);
    let historyRejection = smoothstep(finalRejectionThresh * 0.2, finalRejectionThresh, max(lumaDifference, colorDistance));
    let motionRejection = smoothstep(0.5, 4.0, velocityMagnitude);

    // ---------- Blend Factor Calculation ----------
    let baseBlend = uniforms.temporalBlendFactor;
    let thinDetailBlend = select(baseBlend, 0.03, isThinDetail);
    let staticBlend = select(thinDetailBlend, 0.01, isStaticPixel);

    let motionAdjustedBlend = mix(
        staticBlend,
        min(staticBlend + motionBlurWeight * 0.3, 0.8),
        motionBlurWeight
    );

    let maxRejection = max(historyRejection, motionRejection);
    let finalBlendFactor = mix(
        motionAdjustedBlend,
        0.6,
        maxRejection
    );

    // ---------- Final Color Output ----------
    let finalOutputColor = mix(finalClampedHistory, currentPixelColor, finalBlendFactor);

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalOutputColor, 1.0));
}
