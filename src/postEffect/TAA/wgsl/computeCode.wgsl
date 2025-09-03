{
    // ---------- Initialize Parameters ----------
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
    let staticTransition = smoothstep(0.2, 1.0, velocityMagnitude);
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

    // ---------- Neighborhood Sampling ----------
    let neighbor_N = textureLoad(sourceTexture, clamp(pixelCoord + vec2<u32>(0, 1), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1))).rgb;
    let neighbor_S = textureLoad(sourceTexture, clamp(pixelCoord - vec2<u32>(0, 1), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1))).rgb;
    let neighbor_E = textureLoad(sourceTexture, clamp(pixelCoord + vec2<u32>(1, 0), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1))).rgb;
    let neighbor_W = textureLoad(sourceTexture, clamp(pixelCoord - vec2<u32>(1, 0), vec2<u32>(0), vec2<u32>(screenSize) - vec2<u32>(1))).rgb;

    let coord_x = i32(pixelCoord.x);
    let coord_y = i32(pixelCoord.y);
    let screen_x = i32(screenSize.x);
    let screen_y = i32(screenSize.y);

    let neighbor_NE = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coord_x + 1, 0, screen_x - 1)), u32(clamp(coord_y + 1, 0, screen_y - 1)))).rgb;
    let neighbor_NW = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coord_x - 1, 0, screen_x - 1)), u32(clamp(coord_y + 1, 0, screen_y - 1)))).rgb;
    let neighbor_SE = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coord_x + 1, 0, screen_x - 1)), u32(clamp(coord_y - 1, 0, screen_y - 1)))).rgb;
    let neighbor_SW = textureLoad(sourceTexture, vec2<u32>(u32(clamp(coord_x - 1, 0, screen_x - 1)), u32(clamp(coord_y - 1, 0, screen_y - 1)))).rgb;

    // ---------- Neighborhood Clamping ----------
    var neighborColorMin = min(min(min(currentPixelColor, neighbor_N), min(neighbor_S, neighbor_E)), min(neighbor_W, min(min(neighbor_NE, neighbor_NW), min(neighbor_SE, neighbor_SW))));
    var neighborColorMax = max(max(max(currentPixelColor, neighbor_N), max(neighbor_S, neighbor_E)), max(neighbor_W, max(max(neighbor_NE, neighbor_NW), max(neighbor_SE, neighbor_SW))));

    let basicClampedHistory = clamp(historySample, neighborColorMin, neighborColorMax);

    // ---------- Adaptive Range Expansion ----------
    let colorRange = neighborColorMax - neighborColorMin;
    let baseExpansion = select(0.1, 0.3, isThinDetail);
    let motionExpansion = clamp(velocityMagnitude / 10.0, 0.0, 0.2);
    let staticExpansion = select(baseExpansion + motionExpansion, baseExpansion * 0.5, isStaticPixel);

    let expandedMin = neighborColorMin - colorRange * staticExpansion;
    let expandedMax = neighborColorMax + colorRange * staticExpansion;
    let finalClampedHistory = clamp(basicClampedHistory, expandedMin, expandedMax);

    // ---------- Contrast Analysis ----------
    let lumaCoeffs = vec3<f32>(0.2126, 0.7152, 0.0722);
    let historyLuma = dot(finalClampedHistory, lumaCoeffs);
    let lumaDifference = abs(historyLuma - currentLuma);
    let colorDistance = length(currentPixelColor - finalClampedHistory);

    let neighborLuma_N = dot(neighbor_N, lumaCoeffs);
    let neighborLuma_S = dot(neighbor_S, lumaCoeffs);
    let neighborLuma_E = dot(neighbor_E, lumaCoeffs);
    let neighborLuma_W = dot(neighbor_W, lumaCoeffs);
    let neighborLuma_NE = dot(neighbor_NE, lumaCoeffs);
    let neighborLuma_NW = dot(neighbor_NW, lumaCoeffs);
    let neighborLuma_SE = dot(neighbor_SE, lumaCoeffs);
    let neighborLuma_SW = dot(neighbor_SW, lumaCoeffs);

    let maxNeighborLumaDiff = max(
        max(max(abs(currentLuma - neighborLuma_N), abs(currentLuma - neighborLuma_S)),
            max(abs(currentLuma - neighborLuma_E), abs(currentLuma - neighborLuma_W))),
        max(max(abs(currentLuma - neighborLuma_NE), abs(currentLuma - neighborLuma_NW)),
            max(abs(currentLuma - neighborLuma_SE), abs(currentLuma - neighborLuma_SW)))
    );

    let maxNeighborColorDist = max(
        max(max(length(currentPixelColor - neighbor_N), length(currentPixelColor - neighbor_S)),
            max(length(currentPixelColor - neighbor_E), length(currentPixelColor - neighbor_W))),
        max(max(length(currentPixelColor - neighbor_NE), length(currentPixelColor - neighbor_NW)),
            max(length(currentPixelColor - neighbor_SE), length(currentPixelColor - neighbor_SW)))
    );

    let highLumaContrast = smoothstep(0.1, 0.4, max(lumaDifference, maxNeighborLumaDiff * 0.6));
    let highColorContrast = smoothstep(0.15, 0.6, max(colorDistance, maxNeighborColorDist * 0.6));
    let overallContrast = max(highLumaContrast, highColorContrast * 0.8);

    // ---------- Rejection Analysis ----------
    let thinDetailWithHighContrast = isThinDetail && (overallContrast > 0.3);
    let baseRejectionThresh = select(0.05, 0.15, isThinDetail);
    let motionScale = clamp(velocityMagnitude / 2.0, 0.1, 1.0);
    let smoothRejectionScale = select(
        mix(2.5, 1.0, staticTransition),
        select(1.0, 10.0, isStaticPixel),
        isThinDetail
    );

    let finalRejectionThresh = baseRejectionThresh * smoothRejectionScale;
    let historyRejection = smoothstep(finalRejectionThresh * 0.2, finalRejectionThresh, max(lumaDifference, colorDistance));
    let motionRejection = smoothstep(0.5, 4.0, velocityMagnitude);

    // ---------- Blend Factor Calculation ----------
    let baseBlend = uniforms.temporalBlendFactor;
    let thinDetailBlend = select(baseBlend, 0.05, isThinDetail);

    let generalContrastBlend = mix(baseBlend, 0.35, overallContrast * 0.7);
    let thinDetailContrastBlend = select(
        thinDetailBlend,
        mix(thinDetailBlend, 0.25, overallContrast),
        thinDetailWithHighContrast
    );

    let contrastBlend = select(generalContrastBlend, thinDetailContrastBlend, isThinDetail);

    let smoothStaticBlend = select(
        mix(0.08, contrastBlend, staticTransition),
        select(contrastBlend, 0.01, isStaticPixel),
        isThinDetail
    );

    let motionAdjustedBlend = mix(
        smoothStaticBlend,
        min(smoothStaticBlend + motionBlurWeight * 0.2, 0.8),
        motionBlurWeight
    );

    let maxRejection = max(historyRejection, motionRejection);
    let finalBlendFactor = mix(
        motionAdjustedBlend,
        0.75 ,
        maxRejection
    );

    // ---------- Final Color Output ----------
    let finalOutputColor = mix(
        mix(finalClampedHistory, currentPixelColor, finalBlendFactor),
        mix(basicClampedHistory, currentPixelColor, 0.04),
         pow(1 - staticTransition,2) * 0.5,
    );
    textureStore(outputTexture, pixelCoord, vec4<f32>(finalOutputColor, 1.0));
}
