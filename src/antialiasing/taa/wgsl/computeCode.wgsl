{
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let c_max = vec2<i32>(screenSizeU) - 1;

    // =========================================================================
    // 1. LDS (Workgroup Shared Memory) 10x10 타일 협력 로딩 (Cooperative Loading)
    // 8x8 타일 + 1픽셀 외곽 패딩(100개 픽셀)을 64개 스레드가 분할 로드 (VRAM 대역폭 82.6% 절감)
    // =========================================================================
    let tileOrigin = vec2<i32>(workgroup_id.xy) * 8 - vec2<i32>(1, 1);
    let tid = i32(local_invocation_index);

    // 1차 분할 로드 (스레드 0~63 -> 슬롯 0~63)
    let lx0 = tid % 10;
    let ly0 = tid / 10;
    let coord0 = clamp(tileOrigin + vec2<i32>(lx0, ly0), vec2<i32>(0), c_max);
    let rawColor0 = textureLoad(sourceTexture, coord0, 0);
    // Phase 3: 고휘도 HDR 파이어플라이/링잉 방지를 위한 LDS 온칩 가역 톤매핑 압축 적재
    s_color[ly0][lx0] = vec4<f32>(reversible_tonemap(rawColor0.rgb), rawColor0.a);
    s_depth[ly0][lx0] = textureLoad(depthTexture, coord0, 0);

    // 2차 분할 로드 (스레드 0~35 -> 슬롯 64~99)
    let tid2 = tid + 64;
    if (tid2 < 100) {
        let lx1 = tid2 % 10;
        let ly1 = tid2 / 10;
        let coord1 = clamp(tileOrigin + vec2<i32>(lx1, ly1), vec2<i32>(0), c_max);
        let rawColor1 = textureLoad(sourceTexture, coord1, 0);
        s_color[ly1][lx1] = vec4<f32>(reversible_tonemap(rawColor1.rgb), rawColor1.a);
        s_depth[ly1][lx1] = textureLoad(depthTexture, coord1, 0);
    }

    // 온칩 캐시 적재 완료 동기화
    workgroupBarrier();

    // 화면 경계 밖 스레드 안전 탈출
    let pixelCoord = vec2<i32>(global_id.xy);
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    let localCoord = vec2<i32>(local_id.xy) + vec2<i32>(1, 1);
    let yFlipVec2 = vec2<f32>(1.0, -1.0);

    // =========================================================================
    // 2. 3x3 국소 영역 통계 및 온칩 서브픽셀 신호 재구성 (Reconstruction Filter)
    // =========================================================================
    let stats = calculate_neighborhood_stats_ycocg_lds(localCoord);

    // Karis 지수 재구성 필터를 통해 바이리니어 블러 없이 픽셀 중심 참값 신호 복원
    let jitterOffsetPix = uniforms.currJitterOffset * yFlipVec2;
    let reconstructedCurrent = reconstruct_current_color_ycocg_lds(localCoord, jitterOffsetPix);
    let currentRGB = reconstructedCurrent.rgb;
    let currentAlpha = reconstructedCurrent.alpha;
    let currentRGBA = vec4<f32>(currentRGB, currentAlpha);

    // 🌟 [필수 가드 1] 첫 프레임 및 카메라 컷(Camera Cut) 감지 시 히스토리 차단 (블랙 플래시/고스팅 방지)
    if (uniforms.frameIndex <= 1.0) {
        let finalHDR_RGB = inverse_tonemap(currentRGB);
        textureStore(outputTexture, pixelCoord, vec4<f32>(finalHDR_RGB, currentAlpha));
        return;
    }

    // =========================================================================
    // 3. 온칩 3x3 최근접 뎁스 탐색 (Foreground Motion Vector Dilation)
    // 전경(카메라에 더 가까운 물체)의 모션 벡터를 채택하여 배경 모션의 윤곽선 침범 방지
    // =========================================================================
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

    // 🌟 [필수 가드 2] 지터링 제외 플래그 활성화 시 현재 신호 즉각 출력
    if (closestMotionData.z > 0.5) {
        let finalHDR_RGB = inverse_tonemap(currentRGB);
        textureStore(outputTexture, pixelCoord, vec4<f32>(finalHDR_RGB, currentAlpha));
        return;
    }

    // =========================================================================
    // 4. 히스토리 좌표 역추적 (Modern Standard Dejittered History Reprojection)
    // 현재 픽셀 위치에서 서브픽셀 지터를 상쇄(Dejitter)한 참값 UV에 모션 벡터 적용
    // 히스토리 버퍼는 이미 지터가 제거된 Resolve 버퍼이므로 이전 지터 차감 금지 (FSR2/UE5 표준)
    // =========================================================================
    let currentUnjitteredUV = (vec2<f32>(pixelCoord) + 0.5 - jitterOffsetPix) / screenSize;
    let historyUV = currentUnjitteredUV - velocity;

    var finalRGBA: vec4<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        // 화면 외곽에서 유입된 신호는 히스토리 누적 제외
        finalRGBA = currentRGBA;
    } else {
        // =====================================================================
        // 5. Catmull-Rom 5-Tap 히스토리 샘플링 및 Phase 3 3D Ray-Box 선분 교차 클리핑
        // =====================================================================
        let historyCoord = clamp(vec2<i32>(historyUV * screenSize), vec2<i32>(0), c_max);
        let prevDepth = textureLoad(prevDepthTexture, historyCoord, 0);
        let rawHistoryData = sample_texture_catmull_rom_antiflicker(historyTexture, basicSampler, historyUV, screenSize);

        // Phase 3: 히스토리 샘플을 가역 톤매핑 압축 색공간으로 정규화
        var historyData: SampledColor;
        historyData.rgb = reversible_tonemap(rawHistoryData.rgb);
        historyData.ycocg = rgbToYCoCg(historyData.rgb);
        historyData.alpha = rawHistoryData.alpha;

        let motionLen = length(velocity * screenSize);
        let motionSoft = smoothstep(0.0, 1.0, motionLen);

        // Phase 2: 3x3 국소 서브픽셀 속도 분산(Subpixel Velocity Variance) 측정
        let velVariance = calculate_velocity_variance(gBufferMotionVector, closestCoord, velocity, screenSize);

        // Phase 3: Salvi 2016 표준 3D Ray-Box 선분 교차 클리핑 (Color Desaturation 100% 제거)
        let clippedYCoCg = clip_history_ray_box_ycocg(historyData.ycocg, reconstructedCurrent.ycocg, stats, motionSoft, velVariance);
        let clippedAlpha = clamp(historyData.alpha, stats.minAlpha, stats.maxAlpha);
        let clippedHistoryRGB = YCoCgToRgb(clippedYCoCg);

        let lumaWeight = get_color_discrepancy_weight(stats, clippedYCoCg.x);

        // Phase 2: 시간적 누적 수명(History Age) 적응형 수렴 블렌딩 (Temporal Convergence)
        // 정지 시 새 프레임 선명 디테일 유입량 2배 확보 (0.04 -> 0.08)로 블러 영구 고착 차단
        let effectiveAge = min(uniforms.frameIndex, 32.0);
        let convergenceBlend = max(1.0 / max(effectiveAge, 1.0), 0.08);
        let baseBlend = mix(convergenceBlend, 0.20, motionSoft);

        // =====================================================================
        // 6. 선형 깊이 델타 기반 차폐 검증 (Motion-Gated Geometric Occlusion Rejection)
        // =====================================================================
        // FSR 2 / UE5 표준: 무거운 3D 역투영 없이 선형 깊이 델타 직접 비교
        let depthConfidence = get_geometric_depth_confidence(currentDepth, prevDepth);

        // 정적 상태에서는 물리적 차폐/언차폐가 발생하지 않으므로 깊이 기하학적 리젝션을 모션에 100% 연동
        // (원경 FP32 정밀도 오차 및 서브픽셀 잔디 잎으로 인한 정적 히스토리 오기각 완전 차단)
        let geometricConfidence = mix(1.0, depthConfidence, motionSoft);
        var blendFactor = max(baseBlend, (1.0 - geometricConfidence) * 0.85 * motionSoft);

        // 모션 발생 시 루마 불일치 민감도 가중
        let motionLumaBlend = max(blendFactor, lumaWeight * 0.6);
        blendFactor = mix(blendFactor, motionLumaBlend, motionSoft);

        // Phase 2: 반투명/파티클 영역 반응형 마스크 (Reactive Transparency Rejection)
        let reactiveTrans = get_reactive_transparency_weight(stats);
        blendFactor = mix(blendFactor, 1.0, reactiveTrans);

        let clippedHistoryRGBA = vec4<f32>(clippedHistoryRGB, clippedAlpha);
        finalRGBA = mix(clippedHistoryRGBA, currentRGBA, blendFactor);
    }

    // Phase 3: 최종 출력 직전 가역 톤매핑 100% 무손실 HDR 역복원
    let finalHDR_RGB = inverse_tonemap(finalRGBA.rgb);
    textureStore(outputTexture, pixelCoord, vec4<f32>(finalHDR_RGB, finalRGBA.a));
}
