{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) {
        return;
    }

    // 1. 현재 프레임 샘플링 위치 계산 (지터 보정)
    // 픽셀 정수 좌표에 0.5를 더해 중심을 잡고 지터만큼 역이동 시킵니다.
    let currentUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset) / screenSize;

    // 2. 주변 통계 계산 (수정된 함수 호출)
    let stats = calculate_neighborhood_stats(pixelCoord, screenSizeU);

    // 3. 현재 프레임 데이터 로드 (textureSampleLevel 사용)
    // 보간된 샘플링을 통해 지터로 인한 미세한 떨림을 억제합니다.
    let currentRGBA = textureSampleLevel(sourceTexture, taaTextureSampler, currentUV, 0.0);
    let currentRGB = currentRGBA.rgb;

    // Depth는 경계면 정밀도를 위해 기존처럼 정수 좌표로 로드합니다.
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);

    // 4. Velocity Dilation (가장 가까운 오브젝트의 속도 찾기)
    var closestDepth = 1.0;
    var closestCoord = pixelCoord;
    for(var y: i32 = -1; y <= 1; y++) {
        for(var x: i32 = -1; x <= 1; x++) {
            let sc = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let d = textureLoad(depthTexture, sc, 0);
            if(d < closestDepth) {
                closestDepth = d;
                closestCoord = sc;
            }
        }
    }
    let motionData = textureLoad(motionVectorTexture, closestCoord, 0);
    let velocity = motionData.xy;

    // 5. 히스토리 좌표 계산
    let historyUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset) / screenSize - velocity;

    var finalRGB: vec3<f32>;

    // 6. 히스토리 샘플링 및 블렌딩
    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalRGB = currentRGB;
    } else {
        let historyRGB = sample_texture_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize).rgb;
        let prevDepth = fetch_depth_bilinear(historyDepthTexture, historyUV, screenSize);

        let motionLen = length(velocity * screenSize);
        let motionSoft = smoothstep(0.0, 0.5, motionLen);

        let clippedHistoryRGB = clip_history_rgb_smart(historyRGB, currentRGB, stats, motionSoft);

        var alpha = mix(0.1, 0.4, motionSoft);
        let depthConfidence = get_depth_confidence(currentDepth, prevDepth);
        alpha = max(alpha, 1.0 - depthConfidence);

        finalRGB = mix(clippedHistoryRGB, currentRGB, alpha);
    }

    // 7. 결과 저장
    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, 1.0));
}