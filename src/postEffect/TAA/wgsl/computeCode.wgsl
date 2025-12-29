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

    // --- Subpixel Correction (RESTORED) ---
    let unjitteredUV = currentUV - uniforms.jitterOffset * invScreenSize;
    let historyUV = unjitteredUV - motionVector;

    let isOffScreen = any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0));
    let motionPixels = motionVector * screenSize;
    let motionMagnitude = length(motionPixels);

    if (isOffScreen) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // --- Depth Disocclusion Check ---
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);
    let historyPixelCoord = vec2<u32>(clamp(historyUV * screenSize, vec2<f32>(0.0), screenSize - 1.0));
    let historyDepth = textureLoad(historyDepthTexture, historyPixelCoord, 0);

    let depthDiff = abs(currentDepth - historyDepth);
    let relativeDepthDiff = depthDiff / (min(currentDepth, historyDepth) + 0.0001);
    let disocclusionWeight = smoothstep(0.01, 0.05, relativeDepthDiff);

    // --- Resolve Color with Catmull-Rom ---
    let historyColor = sampleTextureCatmullRom(previousFrameTexture, motionVectorSampler, historyUV);
    let clampedHistory = varianceClipping(currentUV, historyColor, sourceTexture, motionVectorSampler);

    let currentYCoCg = rgb_to_ycocg(currentColor.rgb);
    let historyYCoCg = rgb_to_ycocg(clampedHistory.rgb);

    // --- Dynamic Alpha (SIMPLIFIED) ---
    var alpha = 0.05;

    // 1순위: Disocclusion (깊이 기반)
    alpha = max(alpha, disocclusionWeight * 0.95);

    // 2순위: 극단적 모션만 체크
    let extremeMotionWeight = smoothstep(15.0, 25.0, motionMagnitude);
    alpha = max(alpha, extremeMotionWeight * 0.7);

    // --- Final Composition ---
    let finalYCoCg = mix(historyYCoCg, currentYCoCg, alpha);
    let finalColorRGB = ycocg_to_rgb(finalYCoCg);

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalColorRGB, currentColor.a));
}
