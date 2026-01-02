 {
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // [Step 1] 통계 및 현재 픽셀 정보 로드
    let stats = calculate_neighborhood_stats(pixelCoord, screenSizeU);
    let currentYCoCg = stats.currentYCoCg;

    // [Step 2] Velocity Dilation (가장 가까운 깊이의 속도 사용)
    let closestCoord = find_closest_depth_coord(pixelCoord, screenSizeU);
    let velocity = textureLoad(motionVectorTexture, closestCoord, 0).xy;

    // [Step 3] 재투영 UV 계산
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;
    let historyUV = currentUV - velocity;

    var finalYCoCg: vec4<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalYCoCg = currentYCoCg;
    } else {
        // [Step 4] Catmull-Rom 샘플링으로 고화질 히스토리 로드
        let historyRGB = sample_texture_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize);
        let historyYCoCg = rgb_to_ycocg(historyRGB);

        // [Step 5] Variance Clipping 적용
        let clippedHistory = clip_history_to_neighborhood(historyYCoCg, currentYCoCg, stats);

        // [Step 6] 동적 블렌딩 계수 결정
        let velocityLength = length(velocity * screenSize);
        let alpha = clamp(0.05 + velocityLength * 0.01, 0.05, 0.5);

        finalYCoCg = mix(clippedHistory, currentYCoCg, alpha);
    }

    // [Step 7] 결과 저장
    textureStore(outputTexture, pixelCoord, ycocg_to_rgb(finalYCoCg));
}