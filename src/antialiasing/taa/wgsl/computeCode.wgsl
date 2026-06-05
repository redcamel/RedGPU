{
    // [KO] 1. 인덱스 및 기초 데이터 로드
    // [EN] 1. Index and basic data loading
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let yFlipVec2 = vec2<f32>(1.0, -1.0);

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // [KO] 2. 지터링(Jittering)이 보정된 현재 UV 및 주변 통계 산출
    // [EN] 2. Calculate current UV with jittering correction and neighborhood stats
    let currentUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset * yFlipVec2) / screenSize;
    let stats = calculate_neighborhood_stats_ycocg(pixelCoord, screenSizeU);

    // [KO] 하드웨어 샘플러를 통한 현재 프레임 컬러 로드
    // [EN] Load current frame color via hardware sampler
    let currentRGBA = textureSampleLevel(sourceTexture, basicSampler, currentUV, 0.0);
    let currentRGB = currentRGBA.rgb;
    let currentAlpha = currentRGBA.a;
    let currentYCoCg = rgbToYCoCg(currentRGB);
    
    // [KO] 3. 모션 벡터(Motion Vector) 산출 (가장 가까운 깊이 픽셀 기준)
    // [EN] 3. Calculate Motion Vector (Based on closest depth pixel)
    // [KO] 물체의 테두리에서 정확한 추적을 위해 주변 3x3 영역 중 카메라와 가장 가까운 모션 정보를 사용합니다.
    // [EN] Uses motion info from the pixel closest to the camera within 3x3 region for accurate edge tracking.
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);
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
    
    let motionData = textureLoad(gBufferMotionVector, closestCoord, 0);
    let velocity = motionData.xy;

    // 모션 벡터가 명시적으로 지터링 제외 상태인 경우 처리
    let jitterDisabled = motionData.z > 0.5;
    if (jitterDisabled) {
        textureStore(outputTexture, pixelCoord, vec4<f32>(currentRGB, currentAlpha));
        return;
    }

    // [KO] 4. 히스토리(History) 좌표 계산 및 데이터 로드
    // [EN] 4. Calculate History coordinates and load data
    let historyUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset * yFlipVec2 + uniforms.prevJitterOffset * yFlipVec2) / screenSize - velocity;

    var finalRGB: vec3<f32>;
    var finalAlpha: f32;

    // 화면 경계 밖인 경우 누적 제외
    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalRGB = currentRGB;
        finalAlpha = currentAlpha;
    } else {
        // [KO] 고정밀 필터링(Catmull-Rom)을 통한 히스토리 샘플링
        // [EN] History sampling via high-precision filtering (Catmull-Rom)
        let prevDepth = fetch_depth_bilinear(historyUV, screenSize);
        let historyData = sample_texture_catmull_rom_antiflicker(historyTexture, basicSampler, historyUV, screenSize);

        let motionLen = length(velocity * screenSize);
        let motionSoft = smoothstep(0.0, 1.0, motionLen);

        // [KO] 5. 히스토리 클램핑(Clipping/Clamping) 및 가중치 조절
        // [EN] 5. History Clipping/Clamping and weight adjustment
        // [KO] 잔상(Ghosting) 방지를 위해 히스토리 컬러를 현재 픽셀 주변의 통계 범위 내로 강제 제한합니다.
        // [EN] Forces the history color within the statistical range of the current neighborhood to prevent ghosting.
        let clippedYCoCg = clip_history_ycocg(historyData.ycocg, stats, motionSoft);
        let clippedAlpha = clamp(historyData.alpha, stats.minAlpha, stats.maxAlpha);

        let clippedHistoryRGB = YCoCgToRgb(clippedYCoCg);
        let lumaWeight = get_color_discrepancy_weight(stats, clippedHistoryRGB);

        // [KO] 6. 최종 블렌딩 및 결과 저장
        // [EN] 6. Final blending and store result
        var blendFactor = mix(0.08, 0.4, motionSoft);
        let depthConfidence = get_depth_confidence(currentDepth, prevDepth);

        // 깊이 차이가 크면 히스토리 신뢰도를 낮춤 (Rejection)
        blendFactor = max(blendFactor, 1.0 - depthConfidence * depthConfidence);
        blendFactor = max(blendFactor, lumaWeight * 0.5);

        let currentRGBA_final = vec4<f32>(currentRGB, currentAlpha);
        let clippedHistoryRGBA = vec4<f32>(clippedHistoryRGB, clippedAlpha);

        let finalRGBA = mix(clippedHistoryRGBA, currentRGBA_final, blendFactor);

        finalRGB = finalRGBA.rgb;
        finalAlpha = finalRGBA.a;
    }

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, finalAlpha));
}