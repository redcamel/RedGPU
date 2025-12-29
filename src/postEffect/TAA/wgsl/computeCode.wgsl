{
    let pixelCoord = global_id.xy;
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= screenSizeU)) { return; }

    let fragCoord = vec2<f32>(pixelCoord);
    let currentUV = fragCoord / screenSize;
    let currentColor = textureSampleLevel(sourceTexture, motionVectorSampler, currentUV, 0.0);

    if (uniforms.frameIndex < 2.0) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // --- Velocity Dilation ---
    var bestOffset = vec2<i32>(0, 0);
    var minDepth = 1.0;

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let neighborCoord = vec2<i32>(pixelCoord) + vec2<i32>(x, y);
            let clampedCoord = clamp(neighborCoord, vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let neighborDepth = textureLoad(depthTexture, vec2<u32>(clampedCoord), 0);

            if (neighborDepth < minDepth) {
                minDepth = neighborDepth;
                bestOffset = vec2<i32>(x, y);
            }
        }
    }

    let dilatedUV = (vec2<f32>(vec2<i32>(pixelCoord) + bestOffset) + 0.5) / screenSize;
    let motionVector = textureSampleLevel(motionVectorTexture, motionVectorSampler, dilatedUV, 0.0).xy;

    // --- Reprojection ---
    let unjitteredUV = currentUV - (uniforms.jitterOffset * invScreenSize);
    let historyUV = unjitteredUV - motionVector;

    let isOffScreen = any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0));
    let motionPixels = motionVector * screenSize;
    let motionMagnitude = length(motionPixels);

    if (isOffScreen || motionMagnitude > 20.0) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // --- Resolve Color ---
    let historyColor = sampleTextureCatmullRom(previousFrameTexture, motionVectorSampler, historyUV);
    let clampedHistory = varianceClipping(currentUV, historyColor, sourceTexture, motionVectorSampler);

    let currentYCoCg = rgb_to_ycocg(currentColor.rgb);
    let historyYCoCg = rgb_to_ycocg(clampedHistory.rgb);

    // --- Dynamic Alpha Weighting ---
    let currentLum = currentYCoCg.x;
    let historyLum = historyYCoCg.x;
    let lumDiff = abs(currentLum - historyLum);

    let edgeDetection = smoothstep(0.01, 0.04, lumDiff);
    let relativeLumDiff = lumDiff / (max(currentLum, historyLum) + 0.01);

    let lumWeight = smoothstep(0.1, 0.4, relativeLumDiff);
    let motionWeight = smoothstep(0.2, 1.5, motionMagnitude);
    let depthWeight = smoothstep(0.5, 0.9, textureLoad(depthTexture, pixelCoord, 0));

    var alpha = 0.05;
    alpha = max(alpha, edgeDetection );
    alpha = max(alpha, motionWeight * 0.4);
    alpha = max(alpha, lumWeight);
    alpha = max(alpha, depthWeight);

    // --- Final Composition ---
    let finalYCoCg = mix(historyYCoCg, currentYCoCg, alpha);
    let finalColorRGB = ycocg_to_rgb(finalYCoCg);

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalColorRGB, currentColor.a));
}
