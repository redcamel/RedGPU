{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // --- 1. 좌표 설정 ---
    // 현재 픽셀의 중심 UV
    // --- 1. 좌표 설정 ---
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;

    // NDC 지터(-1 ~ 1)를 UV 오프셋(-0.5 ~ 0.5)으로 변환
    // NDC의 전체 폭이 2이므로, 2로 나누어주어야(즉, 0.5를 곱해야) UV 단위와 일치합니다.
    let jUV = uniforms.jitterOffset * 0.5;
    let pjUV = uniforms.prevJitterOffset * 0.5;

    // WebGPU 등 Y축이 반대인 환경이라면 부호 확인이 필요할 수 있습니다.
    // let jUV = uniforms.jitterOffset * vec2<f32>(0.5, -0.5);

    let pureUV = currentUV - jUV;

    // --- 2. 현재 컬러 샘플링 및 범위 계산 ---
    // 중요: sourceTexture는 이미 렌더링 시 지터가 적용된 상태이므로
    // 추가 오프셋 없이 currentUV로 읽어야 '지터링된 현재 컬러'를 정확히 가져옵니다.
    let currentColor = textureLoad(sourceTexture, pixelCoord, 0);

    // 3x3 영역의 Min/Max 계산 (Color Clipping용)
    var minColor = currentColor;
    var maxColor = currentColor;

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let samplePos = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let neighbor = textureLoad(sourceTexture, samplePos, 0);
            minColor = min(minColor, neighbor);
            maxColor = max(maxColor, neighbor);
        }
    }

    // --- 3. 모션 벡터 및 히스토리 샘플링 ---
    let motionVector = textureSampleLevel(motionVectorTexture, taaTextureSampler, pureUV, 0.0).xy;

    // 히스토리 좌표 공식 (가장 중요)
    // 1. currentUV - jUV: 현재 프레임의 지터를 제거하여 '정지 상태의 UV'로 복원
    // 2. - motionVector: 이전 프레임에서의 위치로 추적
    // 3. + pjUV: 이전 프레임 렌더링 시 적용됐던 지터를 다시 더해 정확한 샘플 지점 일치
    let historyUV = pureUV - motionVector + pjUV;

    var historyColor = currentColor;
    // 경계 검사 후 히스토리 샘플링
    if (all(historyUV >= vec2<f32>(0.0)) && all(historyUV <= vec2<f32>(1.0))) {
        historyColor = textureSampleLevel(historyTexture, taaTextureSampler, historyUV, 0.0);
    }

    // --- 4. Color Clamping (고스팅 제거) ---
    // 이전 프레임의 색상이 현재 주변 색상 범위를 벗어나면 강제로 제한
    let clampedHistory = clamp(historyColor, minColor, maxColor);

    // --- 5. 최종 블렌딩 (EMA) ---
    let alpha = 0.05;
    let resolvedColor = mix(clampedHistory, currentColor, alpha);

    // --- 6. 결과 저장 ---
    textureStore(outputTexture, pixelCoord, resolvedColor);
}