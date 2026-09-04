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
    
    // 🚀 [최적화 2: 3x3 뎁스 탐색 언롤링 (Unrolled Closest Depth Search)]
    // 이중 for 루프, 분기문, 인덱스 클램핑 오버헤드를 100% 제거하고 하드웨어 버스트 페치 가속
    let c_min = vec2<i32>(0);
    let c_max = vec2<i32>(screenSizeU) - 1;

    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);
    var closestDepth = currentDepth;
    var closestCoord = pixelCoord;

    let p_l  = clamp(pixelCoord + vec2<i32>(-1,  0), c_min, c_max);
    let p_r  = clamp(pixelCoord + vec2<i32>( 1,  0), c_min, c_max);
    let p_t  = clamp(pixelCoord + vec2<i32>( 0, -1), c_min, c_max);
    let p_b  = clamp(pixelCoord + vec2<i32>( 0,  1), c_min, c_max);
    let p_tl = clamp(pixelCoord + vec2<i32>(-1, -1), c_min, c_max);
    let p_tr = clamp(pixelCoord + vec2<i32>( 1, -1), c_min, c_max);
    let p_bl = clamp(pixelCoord + vec2<i32>(-1,  1), c_min, c_max);
    let p_br = clamp(pixelCoord + vec2<i32>( 1,  1), c_min, c_max);

    let d_l  = textureLoad(depthTexture, p_l,  0);
    let d_r  = textureLoad(depthTexture, p_r,  0);
    let d_t  = textureLoad(depthTexture, p_t,  0);
    let d_b  = textureLoad(depthTexture, p_b,  0);
    let d_tl = textureLoad(depthTexture, p_tl, 0);
    let d_tr = textureLoad(depthTexture, p_tr, 0);
    let d_bl = textureLoad(depthTexture, p_bl, 0);
    let d_br = textureLoad(depthTexture, p_br, 0);

    if (d_l  < closestDepth) { closestDepth = d_l;  closestCoord = p_l;  }
    if (d_r  < closestDepth) { closestDepth = d_r;  closestCoord = p_r;  }
    if (d_t  < closestDepth) { closestDepth = d_t;  closestCoord = p_t;  }
    if (d_b  < closestDepth) { closestDepth = d_b;  closestCoord = p_b;  }
    if (d_tl < closestDepth) { closestDepth = d_tl; closestCoord = p_tl; }
    if (d_tr < closestDepth) { closestDepth = d_tr; closestCoord = p_tr; }
    if (d_bl < closestDepth) { closestDepth = d_bl; closestCoord = p_bl; }
    if (d_br < closestDepth) { closestDepth = d_br; closestCoord = p_br; }
    
    let closestMotionData = textureLoad(gBufferMotionVector, closestCoord, 0);
    let velocity = closestMotionData.xy;

    // 모션 벡터가 명시적으로 지터링 제외 상태인 경우 처리
    let jitterDisabled = closestMotionData.z > 0.5;
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
        // 정지 상태에서는 0.05(95% 히스토리 누적)로 수렴하여 완벽한 화면 안정성을 유지하고, 모션 발생 시에만 0.25로 전환
        let baseBlend = mix(0.05, 0.25, motionSoft);
        let depthConfidence = get_depth_confidence(currentDepth, prevDepth);

        // 깊이 차이가 크면 히스토리 신뢰도를 낮춤 (Rejection)
        var blendFactor = max(baseBlend, (1.0 - depthConfidence) * 0.5);

        // 🚀 [정지 화면 떨림 방어] 루마 불일치 가중치는 모션이 있을 때만 블렌딩을 증가시키도록 격리
        blendFactor = mix(blendFactor, max(blendFactor, lumaWeight * 0.35), motionSoft);

        let currentRGBA_final = vec4<f32>(currentRGB, currentAlpha);
        let clippedHistoryRGBA = vec4<f32>(clippedHistoryRGB, clippedAlpha);

        let finalRGBA = mix(clippedHistoryRGBA, currentRGBA_final, blendFactor);

        finalRGB = finalRGBA.rgb;
        finalAlpha = finalRGBA.a;
    }

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, finalAlpha));
}