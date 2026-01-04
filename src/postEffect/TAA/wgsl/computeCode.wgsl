
{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let yFlipVec2 = vec2<f32>(1.0, -1.0);

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) {
        return;
    }

    // 1. 현재 프레임 샘플링 (지터 보정)
    let currentUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset * yFlipVec2) / screenSize;
    let stats = calculate_neighborhood_stats_ycocg(pixelCoord, screenSizeU);

    let currentRGBA = textureSampleLevel(sourceTexture, taaTextureSampler, currentUV, 0.0);
    let currentRGB = currentRGBA.rgb;
    let currentAlpha = currentRGBA.a; // ★ 알파 확보
    let currentYCoCg = rgb_to_ycocg(currentRGB);
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);

    // 2. Velocity Dilation (가장 가까운 깊이의 모션 벡터 사용)
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
    let velocity = textureLoad(motionVectorTexture, closestCoord, 0).xy;

    // 3. 히스토리 좌표 및 샘플링
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

        // 4. 클리핑 (Color & Alpha)
        let clippedYCoCg = clip_history_ycocg(historyData.ycocg, stats, motionSoft);
        let clippedAlpha = clamp(historyData.alpha, stats.minAlpha, stats.maxAlpha); // ★ 알파 클램핑

        let clippedHistoryRGB = ycocg_to_rgb(clippedYCoCg);
        let lumaWeight = get_color_discrepancy_weight(stats, clippedYCoCg);

        // 5. 블렌딩 계수 계산
        var blendFactor = mix(0.08, 0.4, motionSoft);
        let depthConfidence = get_depth_confidence(currentDepth, prevDepth);

        blendFactor = max(blendFactor, 1.0 - depthConfidence);
        blendFactor = max(blendFactor, lumaWeight * 0.5);

        // 6. 최종 블렌딩 (RGB + Alpha를 vec4로 통합하여 일관성 유지)
        let currentRGBA = vec4<f32>(currentRGB, currentAlpha);
        let clippedHistoryRGBA = vec4<f32>(clippedHistoryRGB, clippedAlpha);

        // 단 한 번의 mix 호출로 모든 채널을 동일한 비중으로 블렌딩
        let finalRGBA = mix(clippedHistoryRGBA, currentRGBA, blendFactor);

        finalRGB = finalRGBA.rgb;
        finalAlpha = finalRGBA.a;
    }

    // 7. 결과 저장 (Alpha 포함)
    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, finalAlpha));
}
