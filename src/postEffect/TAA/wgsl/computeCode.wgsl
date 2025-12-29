{
    let pixelCoord = global_id.xy;
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);

    if (any(pixelCoord >= screenSizeU)) { return; }

    let fragCoord = vec2<f32>(pixelCoord);
    let currentUV = fragCoord / screenSize;

    let currentColor = textureSampleLevel(sourceTexture, motionVectorSampler, currentUV, 0.0);

    // 첫 프레임은 히스토리 없이 처리
    if (uniforms.frameIndex < 2.0) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // 모션 벡터 텍스처에서 읽기 (RG 채널에 저장된 UV 공간 모션 벡터)
    let motionVectorData = textureSampleLevel(motionVectorTexture, motionVectorSampler, currentUV, 0.0);
    let motionVector = motionVectorData.xy; // RG 채널에서 모션 벡터 추출

    let motionMagnitude = length(motionVector * screenSize); // 픽셀 단위 움직임

    let MAX_MOTION_PIXELS = 20.0;
    if (motionMagnitude > MAX_MOTION_PIXELS) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // 히스토리 UV (모션 벡터 적용)
    let historyUV = currentUV - motionVector;

    // 화면 밖 체크
    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // 히스토리 샘플링
    let historyColor = textureSampleLevel(previousFrameTexture, motionVectorSampler, historyUV, 0.0);

    // Variance clipping
    let clampedHistory = varianceClipping(currentUV, historyColor, sourceTexture, motionVectorSampler);

    // 모션 기반 블렌딩
    let motionBlend = smoothstep(0.3, 2.0, motionMagnitude);

    // 최종 블렌드 팩터 (반대로!)
    // motionBlend = 0 (정적) → 0.95 (현재 프레임 95%, 선명)
    // motionBlend = 1 (동적) → 0.2 (현재 프레임 20%, 부드러운 모션)
    let dynamicBlend = mix(0.95, 0.2, motionBlend);

    let finalColor = mix(clampedHistory, currentColor, dynamicBlend);

    textureStore(outputTexture, pixelCoord, finalColor);
}
