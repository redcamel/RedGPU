{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 1. 현재 데이터 로드
    let stats = calculate_neighborhood_stats(pixelCoord, screenSizeU);
    let currentRGB = textureLoad(sourceTexture, pixelCoord, 0);
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);

    // 2. Velocity Dilation & 재투영 UV
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
        // 3. 히스토리 샘플링 (Catmull-Rom 및 커스텀 Bilinear Depth)
        let historyRGB = sample_texture_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize).rgb;
        let prevDepth = fetch_depth_bilinear(historyDepthTexture, historyUV, screenSize);

        // 4. 깊이 기반 신뢰도 및 정지 상태 보정
        var depthConfidence = get_depth_confidence(currentDepth, prevDepth);

        // [디더링 해결 핵심] 움직임이 거의 없는 정지 영역은 신뢰도를 강제로 높여 떨림 방지
        let isMoving = smoothstep(0.001, 0.01, length(velocity * screenSize));
        depthConfidence = mix(1.0, depthConfidence, isMoving);

        // 5. 클리핑 및 가중치 혼합
        let clippedHistoryYCoCg = clip_history_to_neighborhood(rgb_to_ycocg(vec4<f32>(historyRGB, 1.0)), stats.currentYCoCg, stats);
        let clippedHistoryRGB = ycocg_to_rgb(clippedHistoryYCoCg).rgb;

        // 6. 동적 Alpha (안정적인 누적을 위해 0.05 ~ 0.1 범위 권장)
        var alpha = clamp(0.05 + length(velocity * screenSize) * 0.01, 0.05, 0.1);
        alpha = mix(1.0, alpha, depthConfidence);

        finalRGB = mix(clippedHistoryRGB, currentRGB.rgb, alpha);
    }

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, currentRGB.a));
}