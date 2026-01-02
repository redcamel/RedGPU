{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // [Step 1] 통계 계산
    let stats = calculate_neighborhood_stats(pixelCoord, screenSizeU);
    let currentYCoCg = stats.currentYCoCg;
    let currentRGB = textureLoad(sourceTexture, pixelCoord, 0);

    // [Step 2] Velocity Dilation
    let closest = find_closest_depth_info(pixelCoord, screenSizeU);
    let velocity = textureLoad(motionVectorTexture, closest.coord, 0).xy;
    let closestDepth = closest.depth;

    // [Step 3] 재투영 UV
    let currentUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset) * invScreenSize;
    let historyUV = currentUV - velocity;

    var finalYCoCg: vec4<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalYCoCg = currentYCoCg;
    } else {
        // [Step 4] 히스토리 샘플링
        let historyRGB = sample_history_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize, invScreenSize);
        let historyYCoCg = rgb_to_ycocg(historyRGB);

        // [핵심 수정] 모션 강도 계산
        let velocityMagnitude = length(velocity);
        let isMoving = clamp(velocityMagnitude * 200.0, 0.0, 1.0);

        // [핵심 수정] 정지 상태일수록 Clipping 범위를 넓혀 AA 품질 향상 (Variance Clipping 완화)
        // 정지 시 gamma를 높게(예: 2.5), 움직일 때 낮게(예: 1.0) 설정하여 Ghosting 방지
        let gamma = mix(2.5, 1.2, isMoving);

        var adjustedStats = stats;
        adjustedStats.minColor = stats.mean - (stats.stdDev * gamma);
        adjustedStats.maxColor = stats.mean + (stats.stdDev * gamma);

        // 정지 상태에서의 지터링 범위를 수용하기 위해 절대적 Min/Max와 결합
        adjustedStats.minColor = min(adjustedStats.minColor, stats.minColor);
        adjustedStats.maxColor = max(adjustedStats.maxColor, stats.maxColor);

        let clippedHistory = clip_history_to_neighborhood(historyYCoCg, currentYCoCg, adjustedStats);

        // [Step 5] 오클루전 체크
        let prevDepth = sample_history_depth_bilinear(historyUV, screenSize);
        let depthDiff = abs(closestDepth - prevDepth);
        let depthConfidence = 1.0 - clamp((depthDiff - 0.005) / 0.02, 0.0, 1.0);

        // [Step 6] 가변 블렌딩 (수정됨)
        // 정지 상태일 때 blendAlpha를 더 낮춤 (0.01 = 100프레임 누적)
        var blendAlpha = mix(0.01, 0.1, isMoving);
        blendAlpha = mix(1.0, blendAlpha, depthConfidence);

        // Luma Weighting (플리커링 억제)
        let wCurrent = blendAlpha * get_luma_weight(currentYCoCg);
        let wHistory = (1.0 - blendAlpha) * get_luma_weight(clippedHistory);

        finalYCoCg = (clippedHistory * wHistory + currentYCoCg * wCurrent) / (wHistory + wCurrent);
    }

    // [Step 7] 최종 출력
    let finalRGB = ycocg_to_rgb(finalYCoCg);
    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB.rgb, currentRGB.a));
}