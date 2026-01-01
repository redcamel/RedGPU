{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    // 경계 검사
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // --- 1. 좌표 설정 ---
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;

    // Jitter 단위를 UV로 변환 (CPU에서 픽셀 단위로 보낸다고 가정)
    let jUV = uniforms.jitterOffset * invScreenSize;
    let pjUV = uniforms.prevJitterOffset * invScreenSize;

    // --- 2. 현재 컬러 샘플링 및 주변 색상 범위 계산 ---
    // 현재 Jitter가 적용된 위치를 샘플링
    let jitteredUV = currentUV + jUV;
    let currentColor = textureSampleLevel(sourceTexture, taaTextureSampler, jitteredUV, 0.0);

    // 고스팅 방지를 위한 3x3 영역의 Min/Max 계산
    var minColor = currentColor;
    var maxColor = currentColor;

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let samplePos = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            // 주의: 주변 샘플은 Jitter가 포함된 sourceTexture에서 직접 읽습니다.
            let neighbor = textureLoad(sourceTexture, samplePos, 0);
            minColor = min(minColor, neighbor);
            maxColor = max(maxColor, neighbor);
        }
    }

    // --- 3. 모션 벡터 및 히스토리 샘플링 ---
    let motionVector = textureSampleLevel(motionVectorTexture, taaTextureSampler, currentUV, 0.0).xy;

    // 히스토리 UV 계산: (현재Jitter 제거) -> (모션 역추적) -> (이전Jitter 복구)
    let historyUV = jitteredUV - jUV - motionVector + pjUV;

    // 히스토리 샘플링
    var historyColor = currentColor;
    if (all(historyUV >= vec2<f32>(0.0)) && all(historyUV <= vec2<f32>(1.0))) {
        historyColor = textureSampleLevel(historyTexture, taaTextureSampler, historyUV, 0.0);
    }

    // --- 4. Color Clamping (고스팅 제거의 핵심) ---
    // 히스토리 색상이 현재 주변 9픽셀의 색상 범위를 벗어나면 강제로 가둡니다.
    let clampedHistory = clamp(historyColor, minColor, maxColor);

    // --- 5. 최종 블렌딩 (EMA) ---
    // alpha가 작을수록(0.05) 부드러워지지만 반응이 느리고, 클수록(0.1) 선명하지만 안티 효과가 줄어듭니다.
    let alpha = 0.05;
    let resolvedColor = mix(clampedHistory, currentColor, alpha);

    // --- 6. 결과 저장 ---
    textureStore(outputTexture, pixelCoord, resolvedColor);
}