{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let yFlipVec2 = vec2<f32>(1.0,-1.0);

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) {
        return;
    }

    // 1. 현재 프레임 샘플링 위치 계산 (지터 보정)
    let currentUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset * yFlipVec2 ) / screenSize;

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
    let historyUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset * yFlipVec2  + uniforms.prevJitterOffset * yFlipVec2) / screenSize - velocity;

    var finalRGB: vec3<f32>;

    // 6. 히스토리 샘플링 및 색공간 기반 처리
    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalRGB = currentRGB;
    } else {
        let prevDepth = fetch_depth_bilinear(historyDepthTexture, historyUV, screenSize);

        // Catmull-Rom으로 히스토리 RGB 샘플링
        let historyData = sample_texture_catmull_rom_antiflicker(historyTexture, taaTextureSampler, historyUV, screenSize);
        let historyRGB = historyData.rgb;
        let historyYCoCg = historyData.ycocg;

        let motionLen = length(velocity * screenSize);
        let motionSoft = smoothstep(0.0, 1.0, motionLen);

        // YCoCg 공간에서 클리핑 수행
        let clippedYCoCg = clip_history_ycocg(historyYCoCg, stats, motionSoft);

        // ★ 클리핑 후 다시 RGB로 복원 ★
        let clippedHistoryRGB = ycocg_to_rgb(clippedYCoCg);

        // ★ 루마 차이 기반 alpha 보정 ★
        // 현재 픽셀 대신 주변 평균 루마(stats.mean.x)를 사용하여 떨림(Jitter) 억제
        let lumaWeight = get_color_discrepancy_weight(stats, clippedYCoCg);

        // 7. 블렌딩 (RGB 공간)
        // 기본 모션 기반 alpha
        var alpha = mix(0.08, 0.4, motionSoft);

        // 깊이 차이가 크면 히스토리를 버림
        let depthConfidence = get_depth_confidence(currentDepth, prevDepth);
        alpha = max(alpha, 1.0 - depthConfidence);

        // ★ 추가: 루마 차이가 크면(고스트 위험) 현재 프레임 비중을 높임
        // 떨림 방지를 위해 lumaWeight의 최대 영향력을 0.5 정도로 제한하는 것이 좋습니다.
        alpha = max(alpha, lumaWeight * 0.5);

        finalRGB = mix(clippedHistoryRGB, currentRGB, alpha);
    }

    // 8. 결과 저장
    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, 1.0));
}