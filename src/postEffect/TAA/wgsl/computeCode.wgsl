{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    // 경계 검사 (Early exit)
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // --- 1. 좌표 및 현재 컬러 설정 ---
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;
    let unjitteredUV = currentUV - uniforms.jitterOffset;
    let currentColor = textureSampleLevel(sourceTexture, taaTextureSampler, unjitteredUV, 0.0);

    // 첫 프레임 처리 (단순화)
    if (uniforms.frameIndex < 2.0) {
        textureStore(outputTexture, vec2<u32>(pixelCoord), currentColor);
        return;
    }

    // --- 2. Velocity Dilation (가장 가까운 Depth 탐색) ---
    var bestOffset = vec2<i32>(0, 0);
    var minDepth = 1.0;
    for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
            let neighbor = pixelCoord + vec2<i32>(x, y);
            let d = textureLoad(depthTexture, neighbor, 0);
            if (d < minDepth) {
                minDepth = d;
                bestOffset = vec2<i32>(x, y);
            }
        }
    }
    let dilatedUV = (vec2<f32>(pixelCoord + bestOffset) + 0.5) * invScreenSize;
    let motionVector = textureSampleLevel(motionVectorTexture, taaTextureSampler, dilatedUV, 0.0).xy;

    let motionPixel = motionVector * screenSize;
    let motionMag = length(motionPixel);

    let maxMotionPixel: f32 = 4.0;

//    if (motionMag > maxMotionPixel) {
//        textureStore(outputTexture, vec2<u32>(pixelCoord), currentColor);
//        return;
//    }

    // --- 3. 히스토리 재투영 및 유효성 검사 ---
    // 이전 프레임의 jitter를 고려한 히스토리 UV 계산
    let historyUV = unjitteredUV - motionVector + uniforms.prevJitterOffset;

    // 화면 밖 샘플링 방지
    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        textureStore(outputTexture, vec2<u32>(pixelCoord), currentColor);
        return;
    }

    // --- 4. 히스토리 샘플링 및 클리핑 ---
    var historyColor = sampleTextureCatmullRom(previousFrameTexture, taaTextureSampler, historyUV);

    // Variance Clipping (주변 픽셀 통계에 맞춰 히스토리 색상 제한)
    historyColor = varianceClipping(currentUV, historyColor, sourceTexture, taaTextureSampler);

    // --- 5. 최종 혼합 (Luma Weighting 및 안정화된 Alpha) ---

    let currentYCoCg = rgb_to_ycocg(currentColor.rgb);
    let historyYCoCg = rgb_to_ycocg(historyColor.rgb);

    // velocity 기반 alpha 계산
    let velocity = length(motionVector);

    // 정지 상태일수록 alpha를 더 낮게 (히스토리 비중 ↑)
    // 움직임이 클수록 alpha를 높여 현재 프레임 반영 ↑
    var alpha: f32 = mix(0.02, 0.2, clamp(velocity * 50.0, 0.0, 1.0));

    // 휘도 기반 가중치 (Luma Weighting)
    let w_c = 1.0 / (1.0 + currentYCoCg.x);
    let w_h = 1.0 / (1.0 + historyYCoCg.x);

    let blend_h = (1.0 - alpha) * w_h;
    let blend_c = alpha * w_c;

    // 가중 합산 후 결과 도출
    let finalYCoCgX = (historyYCoCg.x * blend_h + currentYCoCg.x * blend_c) / (blend_h + blend_c);
    let finalYCoCg = vec3<f32>(
        finalYCoCgX,
        mix(historyYCoCg.yz, currentYCoCg.yz, alpha)
    );

    let finalRGB = clamp(ycocg_to_rgb(finalYCoCg), vec3<f32>(0.0), vec3<f32>(1.0));
    textureStore(outputTexture, vec2<u32>(pixelCoord), vec4<f32>(finalRGB, currentColor.a));
}