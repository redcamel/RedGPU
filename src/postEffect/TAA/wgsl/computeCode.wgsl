{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // [Step 1] 통계 및 현재 픽셀 정보 계산
    // calculate_neighborhood_stats 내부에서 currentYCoCg를 이미 계산함
    let stats = calculate_neighborhood_stats(pixelCoord, screenSizeU);
    let currentYCoCg = stats.currentYCoCg;

    // 알파 값 보존을 위해 원본 RGB 로드는 유지
    let currentRGB = textureLoad(sourceTexture, pixelCoord, 0);

    // [Step 2] Velocity Dilation (가장 가까운 오브젝트 정보 활용)
    // [최적화] 뎁스 값을 함수 내부에서 이미 가져옴
    let closest = find_closest_depth_info(pixelCoord, screenSizeU);
    let velocity = textureLoad(motionVectorTexture, closest.coord, 0).xy;
    let closestDepth = closest.depth;

    // [Step 3] 재투영 UV 계산
    let currentUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset) * invScreenSize;
    let historyUV = currentUV - velocity;

    var finalYCoCg: vec4<f32>;

    // 화면 밖 재투영 예외 처리
    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalYCoCg = currentYCoCg;
    } else {
        // [Step 4] 히스토리 샘플링 및 클리핑
        // [최적화] invScreenSize를 전달하여 내부 나눗셈 제거
        let historyRGB = sample_history_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize, invScreenSize);
        let historyYCoCg = rgb_to_ycocg(historyRGB);

        let velocityMagnitude = length(velocity);
        let dynamicGamma = mix(1.0, 2.0, clamp(velocityMagnitude * 100.0, 0.0, 1.0));

        var adjustedStats = stats;
        adjustedStats.minColor = min(stats.minColor, stats.mean - (stats.stdDev * dynamicGamma));
        adjustedStats.maxColor = max(stats.maxColor, stats.mean + (stats.stdDev * dynamicGamma));

        let clippedHistory = clip_history_to_neighborhood(historyYCoCg, currentYCoCg, adjustedStats);

        // [Step 5] 오클루전 및 신뢰도 계산
        let prevDepth = sample_history_depth_bilinear(historyUV, screenSize);
        let depthDiff = abs(closestDepth - prevDepth);
        let depthConfidence = 1.0 - clamp((depthDiff - 0.01) / 0.05, 0.0, 1.0);

        // [Step 6] 가변 블렌딩
        var blendAlpha = mix(0.02, 0.15, clamp(velocityMagnitude * 100.0, 0.0, 1.0));
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