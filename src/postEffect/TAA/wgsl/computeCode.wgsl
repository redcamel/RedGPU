{
    // ---------- Initialize Parameters ----------
    let pixelCoord = vec2<u32>(global_id.xy);
    let screenSize = vec2<f32>(textureDimensions(sourceTexture));

    if (any(pixelCoord >= vec2<u32>(screenSize))) {
        return;
    }

    let currentColorWithAlpha = textureLoad(sourceTexture, pixelCoord);
    let currentColor = currentColorWithAlpha.rgb;
    let currentAlpha = currentColorWithAlpha.a;
    let motionData = textureLoad(motionVectorTexture, pixelCoord, 0);
    let motionVector = motionData.xy;


    let jitterDisabled = motionData.z > 0.5;
    if (jitterDisabled) {
        textureStore(outputTexture, pixelCoord, vec4<f32>(currentColor, currentAlpha));
        return;
    }

    if (uniforms.frameIndex < 3.0) {
        textureStore(outputTexture, pixelCoord, vec4<f32>(currentColor, currentAlpha));
        return;
    }

    if (uniforms.useMotionVectors < 0.5) {
        let historyColorWithAlpha = textureLoad(previousFrameTexture, pixelCoord);
        let historyColor = historyColorWithAlpha.rgb;
        let historyAlpha = historyColorWithAlpha.a;
        let blendWeight = clamp(uniforms.temporalBlendFactor, 0.05, 0.8);
        let blendedResult = mix(historyColor, currentColor, blendWeight);
        let blendedAlpha = mix(historyAlpha, currentAlpha, blendWeight);
        textureStore(outputTexture, pixelCoord, vec4<f32>(blendedResult, blendedAlpha));
        return;
    }

    // ---------- Motion Analysis ----------
    let motionMagnitude = length(motionVector);
    let staticThreshold = 0.5;
    let motionTransition = smoothstep(0.2, 1.0, motionMagnitude);
    let isStaticPixel = motionMagnitude < staticThreshold;

    let currentLuma = dot(currentColor, vec3<f32>(0.2126, 0.7152, 0.0722));
    let isLowLuma = currentLuma < 0.1;
    let isHighLuma = currentLuma > 0.9;
    let isThinDetail = isLowLuma || isHighLuma;

    // ---------- History Sampling ----------
    let currentWorldPos = vec2<f32>(pixelCoord) + vec2<f32>(0.5);
    let historyWorldPos = currentWorldPos - motionVector;

    if (any(historyWorldPos < vec2<f32>(0.5)) || any(historyWorldPos >= screenSize - vec2<f32>(0.5))) {
        textureStore(outputTexture, pixelCoord, vec4<f32>(currentColor, currentAlpha));
        return;
    }

    let motionBlurWeight = smoothstep(0.5, 8.0, motionMagnitude) * uniforms.motionBlurReduction;

    let samplePos = historyWorldPos - vec2<f32>(0.5);
    let floorPos = floor(samplePos);
    let fracPos = samplePos - floorPos;
    let baseCoord = vec2<u32>(floorPos);

    let historyTLWithAlpha = textureLoad(previousFrameTexture, baseCoord);
    let historyTRWithAlpha = textureLoad(previousFrameTexture, baseCoord + vec2<u32>(1, 0));
    let historyBLWithAlpha = textureLoad(previousFrameTexture, baseCoord + vec2<u32>(0, 1));
    let historyBRWithAlpha = textureLoad(previousFrameTexture, baseCoord + vec2<u32>(1, 1));

    let historyTL = historyTLWithAlpha.rgb;
    let historyTR = historyTRWithAlpha.rgb;
    let historyBL = historyBLWithAlpha.rgb;
    let historyBR = historyBRWithAlpha.rgb;

    let historyAlphaTL = historyTLWithAlpha.a;
    let historyAlphaTR = historyTRWithAlpha.a;
    let historyAlphaBL = historyBLWithAlpha.a;
    let historyAlphaBR = historyBRWithAlpha.a;

    let historyTop = mix(historyTL, historyTR, fracPos.x);
    let historyBottom = mix(historyBL, historyBR, fracPos.x);
    let historySample = mix(historyTop, historyBottom, fracPos.y);

    let historyAlphaTop = mix(historyAlphaTL, historyAlphaTR, fracPos.x);
    let historyAlphaBottom = mix(historyAlphaBL, historyAlphaBR, fracPos.x);
    let historySampleAlpha = mix(historyAlphaTop, historyAlphaBottom, fracPos.y);

    // ---------- Neighborhood Sampling ----------
    let neighborNWithAlpha = textureLoad(sourceTexture, clamp(pixelCoord + vec2<u32>(0, 1), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1)));
    let neighborSWithAlpha = textureLoad(sourceTexture, clamp(pixelCoord - vec2<u32>(0, 1), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1)));
    let neighborEWithAlpha = textureLoad(sourceTexture, clamp(pixelCoord + vec2<u32>(1, 0), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1)));
    let neighborWWithAlpha = textureLoad(sourceTexture, clamp(pixelCoord - vec2<u32>(1, 0), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1)));

    let neighborN = neighborNWithAlpha.rgb;
    let neighborS = neighborSWithAlpha.rgb;
    let neighborE = neighborEWithAlpha.rgb;
    let neighborW = neighborWWithAlpha.rgb;

    let neighborAlphaN = neighborNWithAlpha.a;
    let neighborAlphaS = neighborSWithAlpha.a;
    let neighborAlphaE = neighborEWithAlpha.a;
    let neighborAlphaW = neighborWWithAlpha.a;

    let coordX = i32(pixelCoord.x);
    let coordY = i32(pixelCoord.y);
    let screenX = i32(screenSize.x);
    let screenY = i32(screenSize.y);

    let neighborNEWithAlpha = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coordX + 1, 0, screenX - 1)), u32(clamp(coordY + 1, 0, screenY - 1))));
    let neighborNWWithAlpha = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coordX - 1, 0, screenX - 1)), u32(clamp(coordY + 1, 0, screenY - 1))));
    let neighborSEWithAlpha = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coordX + 1, 0, screenX - 1)), u32(clamp(coordY - 1, 0, screenY - 1))));
    let neighborSWWithAlpha = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coordX - 1, 0, screenX - 1)), u32(clamp(coordY - 1, 0, screenY - 1))));

    let neighborNE = neighborNEWithAlpha.rgb;
    let neighborNW = neighborNWWithAlpha.rgb;
    let neighborSE = neighborSEWithAlpha.rgb;
    let neighborSW = neighborSWWithAlpha.rgb;

    let neighborAlphaNE = neighborNEWithAlpha.a;
    let neighborAlphaNW = neighborNWWithAlpha.a;
    let neighborAlphaSE = neighborSEWithAlpha.a;
    let neighborAlphaSW = neighborSWWithAlpha.a;

    // ---------- Neighborhood Clamping ----------
    var neighborMin = min(min(min(currentColor, neighborN), min(neighborS, neighborE)),
                         min(neighborW, min(min(neighborNE, neighborNW), min(neighborSE, neighborSW))));
    var neighborMax = max(max(max(currentColor, neighborN), max(neighborS, neighborE)),
                         max(neighborW, max(max(neighborNE, neighborNW), max(neighborSE, neighborSW))));

    var neighborMinAlpha = min(min(min(currentAlpha, neighborAlphaN), min(neighborAlphaS, neighborAlphaE)),
                              min(neighborAlphaW, min(min(neighborAlphaNE, neighborAlphaNW), min(neighborAlphaSE, neighborAlphaSW))));
    var neighborMaxAlpha = max(max(max(currentAlpha, neighborAlphaN), max(neighborAlphaS, neighborAlphaE)),
                              max(neighborAlphaW, max(max(neighborAlphaNE, neighborAlphaNW), max(neighborAlphaSE, neighborAlphaSW))));

    let basicClampedHistory = clamp(historySample, neighborMin, neighborMax);
    let basicClampedHistoryAlpha = clamp(historySampleAlpha, neighborMinAlpha, neighborMaxAlpha);

    // ---------- Adaptive Range Expansion ----------
    let colorRange = neighborMax - neighborMin;
    let alphaRange = neighborMaxAlpha - neighborMinAlpha;
    let baseExpansion = select(0.1, 0.3, isThinDetail);
    let motionExpansion = clamp(motionMagnitude / 10.0, 0.0, 0.2);
    let staticExpansion = select(baseExpansion + motionExpansion, baseExpansion * 0.5, isStaticPixel);

    let expandedMin = neighborMin - colorRange * staticExpansion;
    let expandedMax = neighborMax + colorRange * staticExpansion;
    let finalClampedHistory = clamp(basicClampedHistory, expandedMin, expandedMax);

    let expandedMinAlpha = neighborMinAlpha - alphaRange * staticExpansion;
    let expandedMaxAlpha = neighborMaxAlpha + alphaRange * staticExpansion;
    let finalClampedHistoryAlpha = clamp(basicClampedHistoryAlpha, expandedMinAlpha, expandedMaxAlpha);

    // ---------- Contrast Analysis ----------
    let lumaCoeffs = vec3<f32>(0.2126, 0.7152, 0.0722);
    let historyLuma = dot(finalClampedHistory, lumaCoeffs);
    let lumaDifference = abs(historyLuma - currentLuma);
    let colorDistance = length(currentColor - finalClampedHistory);

    let neighborLumaN = dot(neighborN, lumaCoeffs);
    let neighborLumaS = dot(neighborS, lumaCoeffs);
    let neighborLumaE = dot(neighborE, lumaCoeffs);
    let neighborLumaW = dot(neighborW, lumaCoeffs);
    let neighborLumaNE = dot(neighborNE, lumaCoeffs);
    let neighborLumaNW = dot(neighborNW, lumaCoeffs);
    let neighborLumaSE = dot(neighborSE, lumaCoeffs);
    let neighborLumaSW = dot(neighborSW, lumaCoeffs);

    let maxNeighborLumaDiff = max(
        max(max(abs(currentLuma - neighborLumaN), abs(currentLuma - neighborLumaS)),
            max(abs(currentLuma - neighborLumaE), abs(currentLuma - neighborLumaW))),
        max(max(abs(currentLuma - neighborLumaNE), abs(currentLuma - neighborLumaNW)),
            max(abs(currentLuma - neighborLumaSE), abs(currentLuma - neighborLumaSW)))
    );

    let maxNeighborColorDist = max(
        max(max(length(currentColor - neighborN), length(currentColor - neighborS)),
            max(length(currentColor - neighborE), length(currentColor - neighborW))),
        max(max(length(currentColor - neighborNE), length(currentColor - neighborNW)),
            max(length(currentColor - neighborSE), length(currentColor - neighborSW)))
    );

    let highLumaContrast = smoothstep(0.1, 0.4, max(lumaDifference, maxNeighborLumaDiff * 0.6));
    let highColorContrast = smoothstep(0.15, 0.6, max(colorDistance, maxNeighborColorDist * 0.6));
    let overallContrast = max(highLumaContrast, highColorContrast * 0.8);

    // ---------- Rejection Analysis ----------
    let thinDetailWithHighContrast = isThinDetail && (overallContrast > 0.3);
    let baseRejectionThresh = select(0.05, 0.15, isThinDetail);
    let motionScale = clamp(motionMagnitude / 2.0, 0.1, 1.0);
    let smoothRejectionScale = select(
        mix(2.5, 1.0, motionTransition),
        select(1.0, 10.0, isStaticPixel),
        isThinDetail
    );

    let finalRejectionThresh = baseRejectionThresh * smoothRejectionScale;
    let historyRejection = smoothstep(finalRejectionThresh * 0.2, finalRejectionThresh, max(lumaDifference, colorDistance));
    let motionRejection = smoothstep(0.5, 4.0, motionMagnitude);

    // ---------- Blend Factor Calculation ----------
    let baseBlendFactor = uniforms.temporalBlendFactor;
    let thinDetailBlendFactor = select(baseBlendFactor, 0.05, isThinDetail);

    let generalContrastBlend = mix(baseBlendFactor, 0.35, overallContrast * 0.7);
    let thinDetailContrastBlend = select(
        thinDetailBlendFactor,
        mix(thinDetailBlendFactor, 0.25, overallContrast),
        thinDetailWithHighContrast
    );

    let contrastBlendFactor = select(generalContrastBlend, thinDetailContrastBlend, isThinDetail);

    let smoothStaticBlend = select(
        mix(0.08, contrastBlendFactor, motionTransition),
        select(contrastBlendFactor, 0.01, isStaticPixel),
        isThinDetail
    );

    let motionAdjustedBlend = mix(
        smoothStaticBlend,
        min(smoothStaticBlend + motionBlurWeight * 0.2, 0.8),
        motionBlurWeight
    );

    let maxRejection = max(historyRejection, motionRejection);
    let finalBlendFactor = mix(motionAdjustedBlend, 0.75, maxRejection);

    // ---------- Final Color Output ----------
    let primaryBlend = mix(vec4<f32>(finalClampedHistory, finalClampedHistoryAlpha), vec4<f32>(currentColor, currentAlpha), finalBlendFactor);
    let fallbackBlend = mix(vec4<f32>(basicClampedHistory, basicClampedHistoryAlpha), vec4<f32>(currentColor, currentAlpha), 0.04);

    // 폴백 가중치 계산 개선
    let fallbackWeight = clamp(pow(1.0 - motionTransition, 2.0) * 0.5, 0.0, 1.0);
    let contrastWeight = clamp(pow(thinDetailContrastBlend, 2.0) + pow(generalContrastBlend, 2.0) * 0.5, 0.0, 1.0);

    // 최종 블렌드 단계별로 계산
    let motionBasedBlend = mix(primaryBlend, fallbackBlend, fallbackWeight);
    let contrastBasedBlend = mix(vec4<f32>(finalClampedHistory, finalClampedHistoryAlpha), fallbackBlend, 0.01);

    let finalOutputColor = mix(motionBasedBlend, contrastBasedBlend, contrastWeight);

    textureStore(outputTexture, pixelCoord, finalOutputColor);

}
