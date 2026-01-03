{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 1. 데이터 로드
    let currentRGBA = textureLoad(sourceTexture, pixelCoord, 0);
    let currentYCbCr = rgb_to_ycbcr(currentRGBA.rgb);
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);
    let statsYCbCr = calculate_neighborhood_stats_ycbcr(pixelCoord, screenSizeU);

    // 2. 정밀 모션 벡터 선택 (Velocity Dilation)
    var closestDepth = 1.0;
    var closestCoord = pixelCoord;
    for(var y: i32 = -1; y <= 1; y++) {
        for(var x: i32 = -1; x <= 1; x++) {
            let sc = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let d = textureLoad(depthTexture, sc, 0);
            if(d < closestDepth) { closestDepth = d; closestCoord = sc; }
        }
    }
    // 모션 벡터가 UV 단위라고 가정할 경우 픽셀 단위로 변환하여 계산
    let velocityUV = textureLoad(motionVectorTexture, closestCoord, 0).xy;
    let velocityPixels = velocityUV * screenSize;

    // 3. 픽셀 단위 히스토리 좌표 계산 (안정성 강화)
    // 모든 좌표 이동을 픽셀(Pixel) 공간에서 먼저 수행합니다.
    let currentPos = vec2<f32>(pixelCoord) + 0.5; // 픽셀 중심

    // (현재 위치 - 현재 지터) = 언지터링된 실제 픽셀 위치
    // (실제 위치 - 모션 벡터) = 이전 프레임의 실제 위치
    // (이전 실제 위치 + 이전 지터) = 히스토리 버퍼 내 샘플링 위치
    let historyPos = currentPos - uniforms.currJitterOffset - velocityPixels + uniforms.prevJitterOffset;

    // 최종적으로 한 번만 스크린 사이즈로 나누어 UV 변환
    let historyUV = historyPos / screenSize;

    var finalYCbCr: vec3<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalYCbCr = currentYCbCr;
    } else {
        // 4. 히스토리 샘플링 및 검증
        let historyRGB = sample_texture_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize).rgb;
        let historyYCbCr = rgb_to_ycbcr(historyRGB);
        let prevDepth = fetch_depth_bilinear(historyDepthTexture, historyUV, screenSize);

        // 5. 클리핑 및 혼합
        let motionLen = length(velocityPixels);
        let motionFactor = smoothstep(0.0, 2.0, motionLen);

        let gamma = mix(0.75, 1.25, motionFactor);
        let v_min = min(statsYCbCr.minColor, statsYCbCr.mean - statsYCbCr.stdDev * gamma);
        let v_max = max(statsYCbCr.maxColor, statsYCbCr.mean + statsYCbCr.stdDev * gamma);

        let clippedHistoryYCbCr = clamp(historyYCbCr, v_min, v_max);

        var alpha = mix(0.05, 0.15, motionFactor);
        let depthConfidence = get_depth_confidence(currentDepth, prevDepth);
        alpha = mix(1.0, alpha, depthConfidence);

        finalYCbCr = mix(clippedHistoryYCbCr, currentYCbCr, alpha);
    }

    let finalRGB = ycbcr_to_rgb(finalYCbCr);
    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, currentRGBA.a));
}