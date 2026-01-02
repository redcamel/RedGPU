{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // [Step 1] 통계 및 현재 컬러 로드
    let stats = calculate_neighborhood_stats(pixelCoord, screenSizeU);
    let currentRGB = textureLoad(sourceTexture, pixelCoord, 0);

    // [Step 2] Velocity Dilation & 재투영
    let closestCoord = find_closest_depth_coord(pixelCoord, screenSizeU);
    let velocity = textureLoad(motionVectorTexture, closestCoord, 0).xy;
    let historyUV = (vec2<f32>(pixelCoord) + 0.5) / screenSize - velocity;

    var finalRGB: vec3<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalRGB = currentRGB.rgb;
    } else {
        // [Step 3] 고화질 히스토리 샘플링 및 클리핑
        let historyRGB = sample_texture_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize).rgb;
        let clippedHistoryYCoCg = clip_history_to_neighborhood(rgb_to_ycocg(vec4<f32>(historyRGB, 1.0)), stats.currentYCoCg, stats);
        let clippedHistoryRGB = ycocg_to_rgb(clippedHistoryYCoCg).rgb;

        // [Step 4] 휘도 기반 가중치 블렌딩 (Anti-Flicker)
        let w_curr = get_luminance_weight(currentRGB.rgb);
        let w_hist = get_luminance_weight(clippedHistoryRGB);

        let velocityLength = length(velocity * screenSize);
        let alpha = clamp(0.05 + velocityLength * 0.01, 0.05, 0.5);

        // 가중치 결합 블렌딩 공식
        let finalWeight = (alpha * w_curr) / (alpha * w_curr + (1.0 - alpha) * w_hist);
        finalRGB = mix(clippedHistoryRGB, currentRGB.rgb, finalWeight);
    }

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, currentRGB.a));
}