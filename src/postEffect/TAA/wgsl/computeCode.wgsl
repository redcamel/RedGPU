{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // [Step 1] YCoCg 공간에서 주변 3x3 통계 수집
    // 이 함수는 정수 좌표(pixelCoord)를 기반으로 작동합니다.
    let stats = get_neighborhood_stats_ycocg(pixelCoord, screenSizeU);

    // [Step 2] 현재 픽셀 샘플링
    // 중요: stats와 일치시키기 위해 Jitter가 포함된 현재 위치를 그대로 읽습니다.
    let currentRGB = textureLoad(sourceTexture, pixelCoord, 0);
    let currentYCoCg = rgb_to_ycocg(currentRGB);

    // [Step 3] Velocity Dilation
    var bestOffset = vec2<i32>(0, 0);
    var closestDepth = 1.1; // Reverse-Z가 아닐 경우 (0.0=근거리, 1.0=원거리)

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let sampleCoord = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let d = textureLoad(depthTexture, sampleCoord, 0);

            // Reverse-Z 환경이라면 d > closestDepth로 수정하세요.
            if (d < closestDepth) {
                closestDepth = d;
                bestOffset = vec2<i32>(x, y);
            }
        }
    }

    let dilatedCoord = clamp(pixelCoord + bestOffset, vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
    let velocity = textureLoad(motionVectorTexture, dilatedCoord, 0).xy;

    // [Step 3.1] 정교한 재투영 (Reprojection)
    // 1. 현재 픽셀의 중앙 위치에서 Jitter를 제거하여 '순수 UV'를 구합니다.
    let pureCurrentUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset) * invScreenSize;
    // 2. 순수 UV에서 속도만큼 뺍니다. (이전 프레임의 Jitter 보정은 샘플러 레벨에서 처리됨)
    let historyUV = pureCurrentUV - velocity;

    var finalYCoCg: vec4<f32>;

    // 화면 밖으로 나간 경우 체크
    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalYCoCg = currentYCoCg;
    } else {
        // [Step 4] Catmull-Rom 히스토리 샘플링 (9-tap 최적화 버전 사용)
        let rawHistoryRGB = sample_texture_catmull_rom(
           historyTexture,
           taaTextureSampler,
           historyUV,
           screenSize
        );
        var historyYCoCg = rgb_to_ycocg(rawHistoryRGB);

        // [Step 5] Variance Clipping (AABB)
        let gamma = 1.25;
        let vMin = stats.mean - (stats.stdDev * gamma);
        let vMax = stats.mean + (stats.stdDev * gamma);

        var tightStats = stats;
        tightStats.minColor = max(stats.minColor, vMin);
        tightStats.maxColor = min(stats.maxColor, vMax);

        let clippedHistory = clip_history(historyYCoCg, currentYCoCg, tightStats);

        // [Step 6] 가변 블렌딩 및 Luma Weighting
        // 1. Depth Rejection: 이전 프레임의 깊이도 선형 샘플링하여 부드럽게 비교합니다.
        // 수정 후
        let historyPixelCoord = vec2<i32>(historyUV * screenSize);
        let prevDepth: f32 = textureLoad(historyDepthTexture, historyPixelCoord, 0);
        //TODO textureSampleLevel 로 변경해야함

        let depthDiff = abs(closestDepth - prevDepth);

        // 움직임에 따른 기본 블렌딩 계수 설정
        let velMag = length(velocity);
        var blendAlpha = mix(0.05, 0.15, clamp(velMag * 1000.0, 0.0, 1.0));

        // 깊이 차이가 크면(오클루전 등) 현재 프레임 비중을 높임
        if (depthDiff > 0.005) {
           blendAlpha = 1.0;
        }

        // 2. Luma Weighting 적용
        let lumaCurrent = currentYCoCg.x;
        let lumaHistory = clippedHistory.x;

        let wCurrent = blendAlpha * (1.0 / (1.0 + max(lumaCurrent, 0.001)));
        let wHistory = (1.0 - blendAlpha) * (1.0 / (1.0 + max(lumaHistory, 0.001)));

        finalYCoCg = (clippedHistory * wHistory + currentYCoCg * wCurrent) / (wHistory + wCurrent);
    }

    // [Step 7] 최종 출력
    let finalRGB = ycocg_to_rgb(finalYCoCg);
    // 음수 값 및 NaN 방지
    textureStore(outputTexture, pixelCoord, max(finalRGB, vec4<f32>(0.0)));
}