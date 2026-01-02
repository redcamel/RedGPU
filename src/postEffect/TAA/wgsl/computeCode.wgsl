{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 1. 데이터 로드
    let stats = calculate_neighborhood_stats(pixelCoord, screenSizeU);
    let currentRGBA = textureLoad(sourceTexture, pixelCoord, 0);
    let currentRGB = currentRGBA.rgb;
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);

    // 2. Velocity Dilation
    var closestDepth = 1.0;
    var closestCoord = pixelCoord;
    for(var y: i32 = -1; y <= 1; y++) {
        for(var x: i32 = -1; x <= 1; x++) {
            let sc = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let d = textureLoad(depthTexture, sc, 0);
            if(d < closestDepth) { closestDepth = d; closestCoord = sc; }
        }
    }
    let motionData = textureLoad(motionVectorTexture, closestCoord, 0);
    let velocity = motionData.xy;

    // 3. 히스토리 좌표 계산 (지터 보정 포함)
    let historyUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset) / screenSize - velocity;

    var finalRGB: vec3<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalRGB = currentRGB;
    } else {
        // 4. 히스토리 샘플링
        let historyRGB = sample_texture_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize).rgb;
        let prevDepth = fetch_depth_bilinear(historyDepthTexture, historyUV, screenSize);

        // 5. 움직임 세기 분석 (흐릿함 방지를 위해 더 민감하게 설정)
        let motionLen = length(velocity * screenSize);
        let motionSoft = smoothstep(0.0, 0.5, motionLen);

        // 6. [수정] 스마트 히스토리 클리핑
        // 정지 시 gamma를 낮게 가져가서 히스토리가 현재 프레임을 덮어쓰지 못하게 함
        let clippedHistoryRGB = clip_history_rgb_smart(historyRGB, currentRGB, stats, motionSoft);

        // 7. 동적 알파(Alpha) 결정
        // 정지 상태 기본 알파를 0.1로 높여서 흐릿함을 줄임 (값이 클수록 현재 프레임 선명도 상승)
        var alpha = mix(0.1, 0.4, motionSoft);

        let depthConfidence = get_depth_confidence(currentDepth, prevDepth);
        alpha = mix(1.0, alpha, depthConfidence);

        // 8. 대비 기반 보호 (글씨/경계선 선명도 유지)
        let colorDist = distance(currentRGB, clippedHistoryRGB);
        // 색상 차이가 조금만 나도 alpha를 높여서 뭉개짐 방지
        let contrastBoost = smoothstep(0.05, 0.4, colorDist);
        alpha = max(alpha, contrastBoost * 0.7);

        // 9. 최종 혼합
        finalRGB = mix(clippedHistoryRGB, currentRGB, alpha);
    }

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, currentRGBA.a));
}