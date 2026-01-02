{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 1. 현재 데이터 로드
    let stats = calculate_neighborhood_stats(pixelCoord, screenSizeU);
    let currentRGB = textureLoad(sourceTexture, pixelCoord, 0);
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);

    // 2. Velocity Dilation
    var closestDepth = 1.0; var closestCoord = pixelCoord;
    for(var y: i32 = -1; y <= 1; y++) {
        for(var x: i32 = -1; x <= 1; x++) {
            let sc = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let d = textureLoad(depthTexture, sc, 0);
            if(d < closestDepth) { closestDepth = d; closestCoord = sc; }
        }
    }
    let velocity = textureLoad(motionVectorTexture, closestCoord, 0).xy;
    let historyUV = (vec2<f32>(pixelCoord) + 0.5) / screenSize - velocity;

    var finalRGB: vec3<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalRGB = currentRGB.rgb;
    } else {
        // 3. 히스토리 샘플링
        let historyRGB = sample_texture_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize).rgb;
        let prevDepth = fetch_depth_bilinear(historyDepthTexture, historyUV, screenSize);

        // 4. 깊이 기반 신뢰도 계산
        var depthConfidence = get_depth_confidence(currentDepth, prevDepth);
        
        // [추가] 정지 상태 보정: 움직임이 매우 작으면 깊이 거부를 무시하여 외곽선 떨림 방지
        let velocityPixels = velocity * screenSize;
        let isMoving = smoothstep(0.01, 0.1, length(velocityPixels));
        depthConfidence = mix(1.0, depthConfidence, isMoving);

        // 5. 클리핑 및 가중치 혼합
        let historyYCoCg = rgb_to_ycocg(vec4<f32>(historyRGB, 1.0));
        let clippedHistoryYCoCg = clip_history_to_neighborhood(historyYCoCg, stats.currentYCoCg, stats);
        let clippedHistoryRGB = ycocg_to_rgb(clippedHistoryYCoCg).rgb;

        let w_curr = get_tone_mapped_weight(currentRGB.rgb);
        let w_hist = get_tone_mapped_weight(clippedHistoryRGB);

        // 6. 동적 Alpha (0.05 ~ 0.15 정도로 누적량 조절)
        var alpha = clamp(0.05 + length(velocityPixels) * 0.01, 0.05, 0.15);
        
        // 오클루전 발생 시 현재 프레임 비중 증가
        alpha = mix(1.0, alpha, depthConfidence);

        let finalWeight = (alpha * w_curr) / (alpha * w_curr + (1.0 - alpha) * w_hist);
        finalRGB = mix(clippedHistoryRGB, currentRGB.rgb, finalWeight);
    }

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, currentRGB.a));
}