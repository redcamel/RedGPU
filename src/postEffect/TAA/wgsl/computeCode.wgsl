{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 1. 현재 프레임 정보 및 주변 통계(Min/Max) 계산
    let stats = calculate_neighborhood_stats(pixelCoord, screenSizeU);
    let currentYCoCg = stats.currentYCoCg;

    // 2. 재투영 (Velocity 사용)
    let velocity = textureLoad(motionVectorTexture, pixelCoord, 0).xy;
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;
    let historyUV = currentUV - velocity;

    var finalYCoCg: vec4<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalYCoCg = currentYCoCg;
    } else {
        // 3. 과거 프레임 샘플링 및 YCoCg 변환
        let historyRGB = textureSampleLevel(historyTexture, taaTextureSampler, historyUV, 0.0);
        let historyYCoCg = rgb_to_ycocg(historyRGB);

        // 4. [핵심] Color Clipping 적용
        // 과거 색상을 현재 주변 픽셀 범위(stats.minColor ~ stats.maxColor)로 제한합니다.
        let clippedHistory = clip_history_to_neighborhood(historyYCoCg, currentYCoCg, stats);

        // 5. 블렌딩 (0.05 유지)
        let alpha = 0.05;
        finalYCoCg = mix(clippedHistory, currentYCoCg, alpha);
    }

    // 6. RGB 변환 후 저장
    let finalRGB = ycocg_to_rgb(finalYCoCg);
    textureStore(outputTexture, pixelCoord, finalRGB);
}