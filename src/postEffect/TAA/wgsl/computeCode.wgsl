let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // [Step 1] YCoCg 공간에서 통계 수집
    let stats = get_neighborhood_stats_ycocg(pixelCoord, screenSizeU);

    // [Step 2] 현재 픽셀 샘플링 및 YCoCg 변환
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;
    let jUV = uniforms.currJitterOffset * invScreenSize;
    let pureUV = currentUV - vec2<f32>(jUV.x, -jUV.y);
    let currentRGB = textureSampleLevel(sourceTexture, taaTextureSampler, pureUV, 0.0);
    let currentYCoCg = rgb_to_ycocg(currentRGB);

    // [Step 3] Velocity Dilation (가장 가까운 픽셀의 속도 찾기)
    var bestOffset = vec2<i32>(0, 0);
    var closestDepth = 1.1; // Reverse-Z가 아닐 경우 1.0이 최대 거리

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let d = textureLoad(depthTexture, sampleCoord, 0); 
            
            // 더 가까운(작은) 깊이 값을 가진 픽셀의 오프셋 저장
            if (d < closestDepth) {
                closestDepth = d;
                bestOffset = vec2<i32>(x, y);
            }
        }
    }

    // 가장 가까운 위치의 속도 벡터를 사용 (Dilation 처리됨)
    let dilatedCoord = clamp(pixelCoord + bestOffset, vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
    let velocity = textureLoad(motionVectorTexture, dilatedCoord, 0).xy;

    // [Step 3.1] 재투영 (Reprojection)
    let jitterDelta = (uniforms.currJitterOffset - uniforms.prevJitterOffset) * invScreenSize;
    let historyUV = currentUV - velocity - jitterDelta;

    var finalYCoCg: vec4<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalYCoCg = currentYCoCg;
    } else {
        // [Step 4] Catmull-Rom 히스토리 샘플링
        let rawHistoryRGB = sample_texture_catmull_rom(
           historyTexture,
           taaTextureSampler,
           historyUV,
           screenSize
        );
        var historyYCoCg = rgb_to_ycocg(rawHistoryRGB);

        // [Step 5] Clip AABB 적용
        let gamma = 1.25;
        let vMin = stats.mean - (stats.stdDev * gamma);
        let vMax = stats.mean + (stats.stdDev * gamma);
        var tightStats = stats;
        tightStats.minColor = max(stats.minColor, vMin);
        tightStats.maxColor = min(stats.maxColor, vMax);

        let clippedHistory = clip_history(historyYCoCg, currentYCoCg, tightStats);

        // [Step 6] Luma Weighting 및 가변 블렌딩
        // 1. Depth Rejection (기존 로직 유지)
        let prevPixelCoord = vec2<i32>(historyUV * screenSize);
        let prevDepth = textureLoad(historyDepthTexture, prevPixelCoord, 0);
        let depthDiff = abs(closestDepth - prevDepth);

        let velMag = length(velocity);
        var blendAlpha = mix(0.05, 0.15, clamp(velMag * 100.0, 0.0, 1.0));

        if (depthDiff > 0.01) {
           blendAlpha = 1.0;
        }

        // 2. Luma Weighting 적용 (핵심 수정 부분)
        // YCoCg에서 x성분이 Luminance(밝기)입니다.
        let lumaCurrent = currentYCoCg.x;
        let lumaHistory = clippedHistory.x;

        // 고대비 영역의 노이즈를 억제하기 위한 가중치 계산 (Reversed Luma Weighting)
        let wCurrent = blendAlpha * (1.0 / (1.0 + max(lumaCurrent, 0.001)));
        let wHistory = (1.0 - blendAlpha) * (1.0 / (1.0 + max(lumaHistory, 0.001)));

        // 가중 평균을 통해 최종 색상 산출
        finalYCoCg = (clippedHistory * wHistory + currentYCoCg * wCurrent) / (wHistory + wCurrent);
    }

    // [Step 7] 결과 출력
    let finalRGB = ycocg_to_rgb(finalYCoCg);
    textureStore(outputTexture, pixelCoord, max(finalRGB, vec4<f32>(0.0)));