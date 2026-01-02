{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 1. 현재 픽셀 통계 계산
    let stats = calculate_neighborhood_stats(pixelCoord, screenSizeU);
    let currentYCoCg = stats.currentYCoCg;

    // 2. [개선] Velocity Dilation 적용
    // 주변에서 가장 가까운 물체의 속도를 사용하여 경계선 고스팅 방지
    let closestCoord = find_closest_depth_coord(pixelCoord, screenSizeU);
    let velocity = textureLoad(motionVectorTexture, closestCoord, 0).xy;

    // 3. 재투영 UV 계산
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;
    let historyUV = currentUV - velocity;

    var finalYCoCg: vec4<f32>;

    // 화면 밖 샘플링 방지
    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalYCoCg = currentYCoCg;
    } else {
        // 4. 히스토리 샘플링
        let historyRGB = textureSampleLevel(historyTexture, taaTextureSampler, historyUV, 0.0);
        let historyYCoCg = rgb_to_ycocg(historyRGB);

        // 5. Variance Clipping 적용
        let clippedHistory = clip_history_to_neighborhood(historyYCoCg, currentYCoCg, stats);

        // 6. 동적 블렌딩 계수
        // 정지 상태에서는 0.05, 움직임이 빠를수록 현재 프레임 비중을 높여 잔상 억제
        let velocityLength = length(velocity * screenSize);
        let alpha = clamp(0.05 + velocityLength * 0.01, 0.05, 0.5);

        finalYCoCg = mix(clippedHistory, currentYCoCg, alpha);
    }

    // 7. 결과 저장
    textureStore(outputTexture, pixelCoord, ycocg_to_rgb(finalYCoCg));
}