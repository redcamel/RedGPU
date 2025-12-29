{
    let pixelCoord = global_id.xy;
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);

    if (any(pixelCoord >= screenSizeU)) { return; }

    let fragCoord = vec2<f32>(pixelCoord);
    let currentUV = fragCoord / screenSize;

    // texture_2d로 변경되었으므로 textureSampleLevel 사용
    let currentColor = textureSampleLevel(sourceTexture, motionVectorSampler, currentUV, 0.0);

    // 첫 프레임은 히스토리 없이 처리
    if (uniforms.frameIndex < 2.0) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // Depth 값 읽기
    let depth = textureLoad(depthTexture, pixelCoord, 0);

    // Skybox (depth = 1.0)는 모션 벡터 없이 처리
    if (depth >= 0.9999) {
        let historyColor = textureSampleLevel(previousFrameTexture, motionVectorSampler, currentUV, 0.0);
        let clampedHistory = varianceClipping(currentUV, historyColor, sourceTexture, motionVectorSampler);
        let finalColor = mix(clampedHistory, currentColor, 0.05);
        textureStore(outputTexture, pixelCoord, finalColor);
        return;
    }

    // NDC 복원
    let clipSpaceX = currentUV.x * 2.0 - 1.0;
    let clipSpaceY = 1.0 - currentUV.y * 2.0;
    let clipSpaceZ = depth;
    let currentNDC = vec4<f32>(clipSpaceX, clipSpaceY, clipSpaceZ, 1.0);

    // 월드 좌표 복원
    let worldPos4 = uniforms.invViewProj * currentNDC;
    if (abs(worldPos4.w) < 0.0001) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }
    let worldPos = worldPos4.xyz / worldPos4.w;

    // 이전 프레임의 clip space로 투영
    let prevClipPos = uniforms.prevViewProj * vec4<f32>(worldPos, 1.0);
    if (prevClipPos.w <= 0.01) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // 이전 프레임의 NDC
    let prevNDC = prevClipPos.xyz / prevClipPos.w;
    let prevUV = vec2<f32>(
        prevNDC.x * 0.5 + 0.5,
        0.5 - prevNDC.y * 0.5
    );

    // 모션 벡터 계산
    let motionVector = currentUV - prevUV;
    let motionMagnitude = length(motionVector * screenSize); // 픽셀 단위 움직임

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

    // 색상 차이 계산
    let colorDiff = length(currentColor.rgb - clampedHistory.rgb);

    // 모션 기반 블렌딩
    let motionBlend = smoothstep(0.5, 5.0, motionMagnitude);

    // 색상 변화 감지
    let colorBlend = smoothstep(0.05, 0.3, colorDiff);

    // 두 요소 결합 (둘 중 하나라도 크면 히스토리 적게 사용)
    let combinedBlend = max(motionBlend, colorBlend);

    // 최종 블렌드 팩터: 정적(0.03) ~ 동적(0.8)
    let dynamicBlend = mix(0.03, 0.8, combinedBlend);

    let finalColor = mix(clampedHistory, currentColor, dynamicBlend);

    textureStore(outputTexture, pixelCoord, finalColor);
}
