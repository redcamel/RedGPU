{
    // ---------- Initialize Parameters ----------
    let pixelCoord = vec2<u32>(global_id.xy);
    let screenSize = vec2<f32>(textureDimensions(sourceTexture));

    if (any(pixelCoord >= vec2<u32>(screenSize))) {
        return;
    }

    let currentColor = textureLoad(sourceTexture, pixelCoord).rgb;
    let motionData = textureLoad(motionVectorTexture, pixelCoord, 0);
    let motionVector = motionData.xy;

    // ---------- Early Exit Conditions ----------
    let jitterDisabled = motionData.z > 0.5;
    if (jitterDisabled) {
        textureStore(outputTexture, pixelCoord, vec4<f32>(currentColor, 1.0));
        return;
    }

    if (uniforms.frameIndex < 3.0) {
        textureStore(outputTexture, pixelCoord, vec4<f32>(currentColor, 1.0));
        return;
    }

    if (uniforms.useMotionVectors < 0.5) {
        let historyColor = textureLoad(previousFrameTexture, pixelCoord).rgb;
        let blendWeight = clamp(uniforms.temporalBlendFactor, 0.05, 0.8);
        let blendedResult = mix(historyColor, currentColor, blendWeight);
        textureStore(outputTexture, pixelCoord, vec4<f32>(blendedResult, 1.0));
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
        textureStore(outputTexture, pixelCoord, vec4<f32>(currentColor, 1.0));
        return;
    }

    let motionBlurWeight = smoothstep(0.5, 8.0, motionMagnitude) * uniforms.motionBlurReduction;

    let samplePos = historyWorldPos - vec2<f32>(0.5);
    let floorPos = floor(samplePos);
    let fracPos = samplePos - floorPos;
    let baseCoord = vec2<u32>(floorPos);

    let historyTL = textureLoad(previousFrameTexture, baseCoord).rgb;
    let historyTR = textureLoad(previousFrameTexture, baseCoord + vec2<u32>(1, 0)).rgb;
    let historyBL = textureLoad(previousFrameTexture, baseCoord + vec2<u32>(0, 1)).rgb;
    let historyBR = textureLoad(previousFrameTexture, baseCoord + vec2<u32>(1, 1)).rgb;

    let historyTop = mix(historyTL, historyTR, fracPos.x);
    let historyBottom = mix(historyBL, historyBR, fracPos.x);
    let historySample = mix(historyTop, historyBottom, fracPos.y);

    // ---------- Neighborhood Sampling ----------
    let neighborN = textureLoad(sourceTexture, clamp(pixelCoord + vec2<u32>(0, 1), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1))).rgb;
    let neighborS = textureLoad(sourceTexture, clamp(pixelCoord - vec2<u32>(0, 1), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1))).rgb;
    let neighborE = textureLoad(sourceTexture, clamp(pixelCoord + vec2<u32>(1, 0), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1))).rgb;
    let neighborW = textureLoad(sourceTexture, clamp(pixelCoord - vec2<u32>(1, 0), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1))).rgb;

    let coordX = i32(pixelCoord.x);
    let coordY = i32(pixelCoord.y);
    let screenX = i32(screenSize.x);
    let screenY = i32(screenSize.y);

    let neighborNE = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coordX + 1, 0, screenX - 1)), u32(clamp(coordY + 1, 0, screenY - 1)))).rgb;
    let neighborNW = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coordX - 1, 0, screenX - 1)), u32(clamp(coordY + 1, 0, screenY - 1)))).rgb;
    let neighborSE = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coordX + 1, 0, screenX - 1)), u32(clamp(coordY - 1, 0, screenY - 1)))).rgb;
    let neighborSW = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coordX - 1, 0, screenX - 1)), u32(clamp(coordY - 1, 0, screenY - 1)))).rgb;

    // ---------- Neighborhood Clamping ----------
    var neighborMin = min(min(min(currentColor, neighborN), min(neighborS, neighborE)),
                         min(neighborW, min(min(neighborNE, neighborNW), min(neighborSE, neighborSW))));
    var neighborMax = max(max(max(currentColor, neighborN), max(neighborS, neighborE)),
                         max(neighborW, max(max(neighborNE, neighborNW), max(neighborSE, neighborSW))));

    let basicClampedHistory = clamp(historySample, neighborMin, neighborMax);

    // ---------- Adaptive Range Expansion ----------
    let colorRange = neighborMax - neighborMin;
    let baseExpansion = select(0.1, 0.3, isThinDetail);
    let motionExpansion = clamp(motionMagnitude / 10.0, 0.0, 0.2);
    let staticExpansion = select(baseExpansion + motionExpansion, baseExpansion * 0.5, isStaticPixel);

    let expandedMin = neighborMin - colorRange * staticExpansion;
    let expandedMax = neighborMax + colorRange * staticExpansion;
    let finalClampedHistory = clamp(basicClampedHistory, expandedMin, expandedMax);

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
    let primaryBlend = mix(finalClampedHistory, currentColor, finalBlendFactor);
    let fallbackBlend = mix(basicClampedHistory, currentColor, 0.04);
    let finalOutputColor = mix(
        mix(primaryBlend, fallbackBlend, pow(1.0 - motionTransition, 2.0) * 0.5),
        mix(
                finalClampedHistory,
                fallbackBlend,
                0.01
        ),
        pow(thinDetailContrastBlend,2) + pow(generalContrastBlend,2) + thinDetailContrastBlend
//        pow(1 - finalBlendFactor,2)
    );

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalOutputColor, 1.0));
}
