{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) {
        return;
    }

    // 1. 현재 프레임 샘플링 위치 계산 (지터 보정)
    let currentUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset) / screenSize;

    // 2. YCoCg 기반 주변 통계 계산
    let stats = calculate_neighborhood_stats_ycocg(pixelCoord, screenSizeU);

    // 3. 현재 프레임 데이터 로드 및 YCoCg 변환
    let currentRGBA = textureSampleLevel(sourceTexture, taaTextureSampler, currentUV, 0.0);
    let currentRGB = currentRGBA.rgb;
    let currentYCoCg = rgb_to_ycocg(currentRGB);

    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);

    // 4. Velocity Dilation
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

    // 5. 히스토리 좌표 계산
    let historyUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.prevJitterOffset) / screenSize - velocity;

    var finalRGB: vec3<f32>;

    // 6. 히스토리 샘플링 및 색공간 기반 처리
    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalRGB = currentRGB;
    } else {
        // Catmull-Rom으로 히스토리 RGB 샘플링
        let historyRGB = sample_texture_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize).rgb;
        let prevDepth = fetch_depth_bilinear(historyDepthTexture, historyUV, screenSize);

        // 클리핑을 위해 YCoCg로 변환
        let historyYCoCg = rgb_to_ycocg(historyRGB);

        let motionLen = length(velocity * screenSize);
        let motionSoft = smoothstep(0.0, 0.5, motionLen);

        // YCoCg 공간에서 클리핑 수행
        let clippedYCoCg = clip_history_ycocg(historyYCoCg, stats, motionSoft);

        // ★ 클리핑 후 다시 RGB로 복원 ★
        let clippedHistoryRGB = ycocg_to_rgb(clippedYCoCg);

        // 7. 블렌딩 (RGB 공간)
        var alpha = mix(0.08, 0.4, motionSoft);
        let depthConfidence = get_depth_confidence(currentDepth, prevDepth);
        alpha = max(alpha, 1.0 - depthConfidence);

        finalRGB = mix(clippedHistoryRGB, currentRGB, alpha);
    }

    // 8. 결과 저장
    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, 1.0));
}