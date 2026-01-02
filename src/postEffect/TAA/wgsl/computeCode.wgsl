{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 1. 현재 프레임 정보
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
        // 3. 히스토리 샘플링 (색상 및 깊이)
        let historyRGB = sample_texture_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize).rgb;
        let historyPos = historyUV * screenSize;
        let historyCoord = vec2<i32>(historyPos); // floor와 동일하게 동작

        // [수정] historyDepthTexture를 textureLoad로 샘플링
        let prevDepth = textureLoad(historyDepthTexture, historyCoord, 0);

        // 현재 픽셀의 깊이 (이미 1번 단계에서 가져온 값 사용)
        let currentDepth = currentDepth;

        // [Step 4] 깊이 기반 오클루전 신뢰도 계산
        let depthConfidence = get_depth_confidence(currentDepth, prevDepth);

        // 5. 클리핑 및 기본 블렌딩 계수
        let clippedHistoryYCoCg = clip_history_to_neighborhood(rgb_to_ycocg(vec4<f32>(historyRGB, 1.0)), stats.currentYCoCg, stats);
        let clippedHistoryRGB = ycocg_to_rgb(clippedHistoryYCoCg).rgb;

        let velocityLength = length(velocity * screenSize);
        var alpha = clamp(0.05 + velocityLength * 0.02, 0.05, 0.5);

        // [중요] 깊이 차이가 크면(Occlusion) alpha를 1.0으로 만들어 현재 프레임만 사용
        alpha = mix(1.0, alpha, depthConfidence);

        finalRGB = mix(clippedHistoryRGB, currentRGB.rgb, alpha);
    }

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, currentRGB.a));
}