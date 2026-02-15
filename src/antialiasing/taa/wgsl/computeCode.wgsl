{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let yFlipVec2 = vec2<f32>(1.0, -1.0);

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) {
        return;
    }

    let currentUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset * yFlipVec2) / screenSize;
    let stats = calculate_neighborhood_stats_ycocg(pixelCoord, screenSizeU);

    let currentRGBA = textureSampleLevel(sourceTexture, taaTextureSampler, currentUV, 0.0);
    let currentRGB = currentRGBA.rgb;
    let currentAlpha = currentRGBA.a;
    let currentYCoCg = rgb_to_ycocg(currentRGB);
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);

    var closestDepth = 1.0;
    var closestCoord = pixelCoord;
    for(var y: i32 = -1; y <= 1; y++) {
        for(var x: i32 = -1; x <= 1; x++) {
            let sc = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let d = textureLoad(depthTexture, sc, 0);
            if(d < closestDepth) {
                closestDepth = d;
                closestCoord = sc;
            }
        }
    }
    let motionData = textureLoad(motionVectorTexture, closestCoord, 0);
    let velocity = motionData.xy;

    let jitterDisabled = motionData.z > 0.5;
    if (jitterDisabled) {
        textureStore(outputTexture, pixelCoord, vec4<f32>(currentRGB, currentAlpha));
        return;
    }

    let historyUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset * yFlipVec2 + uniforms.prevJitterOffset * yFlipVec2) / screenSize - velocity;

    var finalRGB: vec3<f32>;
    var finalAlpha: f32;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalRGB = currentRGB;
        finalAlpha = currentAlpha;
    } else {
        let prevDepth = fetch_depth_bilinear(historyDepthTexture, historyUV, screenSize);
        let historyData = sample_texture_catmull_rom_antiflicker(historyTexture, taaTextureSampler, historyUV, screenSize);

        let motionLen = length(velocity * screenSize);
        let motionSoft = smoothstep(0.0, 1.0, motionLen);

        let clippedYCoCg = clip_history_ycocg(historyData.ycocg, stats, motionSoft);
        let clippedAlpha = clamp(historyData.alpha, stats.minAlpha, stats.maxAlpha);

        let clippedHistoryRGB = ycocg_to_rgb(clippedYCoCg);
        let lumaWeight = get_color_discrepancy_weight(stats, clippedHistoryRGB);

        var blendFactor = mix(0.08, 0.4, motionSoft);
        let depthConfidence = get_depth_confidence(currentDepth, prevDepth);

        blendFactor = max(blendFactor, 1.0 - depthConfidence * depthConfidence);
        blendFactor = max(blendFactor, lumaWeight * 0.5);

        let currentRGBA = vec4<f32>(currentRGB, currentAlpha);
        let clippedHistoryRGBA = vec4<f32>(clippedHistoryRGB, clippedAlpha);

        let finalRGBA = mix(clippedHistoryRGBA, currentRGBA, blendFactor);

        finalRGB = finalRGBA.rgb;
        finalAlpha = finalRGBA.a;
    }

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, finalAlpha));
}