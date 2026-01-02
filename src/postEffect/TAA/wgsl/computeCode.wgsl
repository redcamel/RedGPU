{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 1. 현재 픽셀 통계 계산
    let stats = calculate_neighborhood_stats(pixelCoord, screenSizeU);
    let currentYCoCg = stats.currentYCoCg;

    // 2. 재투영 UV 계산
    let velocity = textureLoad(motionVectorTexture, pixelCoord, 0).xy;
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;
    let historyUV = currentUV - velocity;

    var finalYCoCg: vec4<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalYCoCg = currentYCoCg;
    } else {
        // 3. [개선] 선명한 샘플링 (Catmull-Rom 대용 5-tap 필터링 등 가능하지만 여기선 고품질 샘플링 적용)
        // textureSampleLevel을 사용하되, 고품질 필터링 로직이 있다면 여기에 적용합니다.
        let historyRGB = textureSampleLevel(historyTexture, taaTextureSampler, historyUV, 0.0);
        let historyYCoCg = rgb_to_ycocg(historyRGB);

        // 4. [핵심] Variance Clipping 적용
        let clippedHistory = clip_history_to_neighborhood(historyYCoCg, currentYCoCg, stats);

        // 5. 동적 블렌딩 계수 (정지 상태일수록 과거를 더 많이 사용)
        // 지금은 기본 0.05를 유지하지만, 나중에 velocity 크기에 따라 조절 가능합니다.
        let alpha = 0.05;
        finalYCoCg = mix(clippedHistory, currentYCoCg, alpha);
    }

    // 6. 최종 출력
    textureStore(outputTexture, pixelCoord, ycocg_to_rgb(finalYCoCg));
}