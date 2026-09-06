{
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let c_max = vec2<i32>(screenSizeU) - 1;

    // 🚀 [무손실 3: LDS 협력 로딩 (Cooperative LDS Loading)]
    // 8x8 타일 + 1픽셀 외곽 패딩 = 10x10 (100개 픽셀)을 64개 스레드가 협동 로드
    // VRAM 텍스처 접근을 1,152회 ➡️ 200회로 82.6% 급감
    let tileOrigin = vec2<i32>(workgroup_id.xy) * 8 - vec2<i32>(1, 1);
    let tid = i32(local_invocation_index);

    // 1차 로드 (스레드 0~63 ➡️ 슬롯 0~63)
    let lx0 = tid % 10;
    let ly0 = tid / 10;
    let coord0 = clamp(tileOrigin + vec2<i32>(lx0, ly0), vec2<i32>(0), c_max);
    s_color[ly0][lx0] = textureLoad(sourceTexture, coord0, 0);
    s_depth[ly0][lx0] = textureLoad(depthTexture, coord0, 0);

    // 2차 로드 (스레드 0~35 ➡️ 슬롯 64~99)
    let tid2 = tid + 64;
    if (tid2 < 100) {
        let lx1 = tid2 % 10;
        let ly1 = tid2 / 10;
        let coord1 = clamp(tileOrigin + vec2<i32>(lx1, ly1), vec2<i32>(0), c_max);
        s_color[ly1][lx1] = textureLoad(sourceTexture, coord1, 0);
        s_depth[ly1][lx1] = textureLoad(depthTexture, coord1, 0);
    }

    // 워크그룹 전체 100개 픽셀 로딩 완료 동기화
    workgroupBarrier();

    // 화면 경계 밖 스레드는 동기화 이후 안전하게 종료
    let pixelCoord = vec2<i32>(global_id.xy);
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    let localCoord = vec2<i32>(local_id.xy) + vec2<i32>(1, 1);
    let yFlipVec2 = vec2<f32>(1.0, -1.0);

    // [KO] 2. 지터링(Jittering)이 보정된 현재 UV 및 온칩 LDS 주변 통계 산출
    // [EN] 2. Calculate current UV with jittering correction and on-chip LDS neighborhood stats
    let currentUV = (vec2<f32>(pixelCoord) + 0.5 - uniforms.currJitterOffset * yFlipVec2) / screenSize;
    let stats = calculate_neighborhood_stats_ycocg_lds(localCoord);

    // [KO] 하드웨어 샘플러를 통한 현재 프레임 컬러 로드
    // [EN] Load current frame color via hardware sampler
    let currentRGBA = textureSampleLevel(sourceTexture, basicSampler, currentUV, 0.0);
    let currentRGB = currentRGBA.rgb;
    let currentAlpha = currentRGBA.a;
    let currentYCoCg = rgbToYCoCg(currentRGB);
    
    // 🚀 [무손실 3: LDS 온칩 3x3 뎁스 탐색 (On-Chip 3x3 Closest Depth Search)]
    // VRAM 텍스처 접근 0회! 온칩 초고속 SRAM에서 9개 뎁스 비교
    let currentDepth = s_depth[localCoord.y][localCoord.x];
    var closestDepth = currentDepth;
    var closestCoord = pixelCoord;

    let d_l  = s_depth[localCoord.y][localCoord.x - 1];
    let d_r  = s_depth[localCoord.y][localCoord.x + 1];
    let d_t  = s_depth[localCoord.y - 1][localCoord.x];
    let d_b  = s_depth[localCoord.y + 1][localCoord.x];
    let d_tl = s_depth[localCoord.y - 1][localCoord.x - 1];
    let d_tr = s_depth[localCoord.y - 1][localCoord.x + 1];
    let d_bl = s_depth[localCoord.y + 1][localCoord.x - 1];
    let d_br = s_depth[localCoord.y + 1][localCoord.x + 1];

    if (d_l  < closestDepth) { closestDepth = d_l;  closestCoord = clamp(pixelCoord + vec2<i32>(-1,  0), vec2<i32>(0), c_max); }
    if (d_r  < closestDepth) { closestDepth = d_r;  closestCoord = clamp(pixelCoord + vec2<i32>( 1,  0), vec2<i32>(0), c_max); }
    if (d_t  < closestDepth) { closestDepth = d_t;  closestCoord = clamp(pixelCoord + vec2<i32>( 0, -1), vec2<i32>(0), c_max); }
    if (d_b  < closestDepth) { closestDepth = d_b;  closestCoord = clamp(pixelCoord + vec2<i32>( 0,  1), vec2<i32>(0), c_max); }
    if (d_tl < closestDepth) { closestDepth = d_tl; closestCoord = clamp(pixelCoord + vec2<i32>(-1, -1), vec2<i32>(0), c_max); }
    if (d_tr < closestDepth) { closestDepth = d_tr; closestCoord = clamp(pixelCoord + vec2<i32>( 1, -1), vec2<i32>(0), c_max); }
    if (d_bl < closestDepth) { closestDepth = d_bl; closestCoord = clamp(pixelCoord + vec2<i32>(-1,  1), vec2<i32>(0), c_max); }
    if (d_br < closestDepth) { closestDepth = d_br; closestCoord = clamp(pixelCoord + vec2<i32>( 1,  1), vec2<i32>(0), c_max); }
    
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