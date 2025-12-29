{
    let pixelCoord = global_id.xy;
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= screenSizeU)) { return; }

    let fragCoord = vec2<f32>(pixelCoord);

    // 1. 현재 UV (지터가 포함된 상태 그대로 샘플링)
    let currentUV = fragCoord / screenSize;
    let currentColor = textureSampleLevel(sourceTexture, motionVectorSampler, currentUV, 0.0);

    if (uniforms.frameIndex < 2.0) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // 2. 모션 벡터 추출
    let motionVectorData = textureSampleLevel(motionVectorTexture, motionVectorSampler, currentUV, 0.0);
    let motionVector = motionVectorData.xy;

    // 3. 지터 보정 (Un-jittering)
    // 현재 프레임의 샘플 위치에서 지터를 빼서 '원래 위치'를 찾고,
    // 거기서 모션 벡터만큼 뒤로 가서 이전 프레임의 위치를 찾습니다.
    let jitterPixel = uniforms.jitterOffset; // 픽셀 단위 오프셋
    let unjitteredUV = currentUV - (jitterPixel * invScreenSize);
    let historyUV = unjitteredUV - motionVector;

    // 4. 유효성 검사 및 샘플링
    let isOffScreen = any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0));
    let motionMagnitude = length(motionVector * screenSize);

    if (isOffScreen || motionMagnitude > 20.0) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // Catmull-Rom 샘플링은 지터 보정된 historyUV를 사용해야 선명합니다.
    let historyColor = sampleTextureCatmullRom(previousFrameTexture, motionVectorSampler, historyUV);

    // 5. 클리핑 및 YCoCg 변환
    let clampedHistory = varianceClipping(currentUV, historyColor, sourceTexture, motionVectorSampler);

    let currentYCoCg = rgb_to_ycocg(currentColor.rgb);
    let historyYCoCg = rgb_to_ycocg(clampedHistory.rgb);

    // 6. 가중치 계산 (지글거림 억제 최적화)
    let currentLum = currentYCoCg.x;
    let historyLum = historyYCoCg.x;

    // 에지 감지: 지터링으로 인한 미세 떨림이 강한 곳(에지)을 찾습니다.
    let edgeDetection = smoothstep(0.01, 0.15, abs(currentLum - historyLum));
    let lumDiff = abs(currentLum - historyLum) / (max(currentLum, historyLum) + 0.01);
    let lumWeight = smoothstep(0.1, 0.4, lumDiff);

    let motionWeight = smoothstep(0.2, 1.5, motionMagnitude);
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);
    let depthWeight = smoothstep(0.5, 0.9, currentDepth);

    // 지터링이 적용된 상태에서는 alpha 값이 너무 낮으면(0.05 미만) 잔상이 생기거나
    // 미세 선이 지글거릴 수 있습니다. 에지 영역에선 alpha를 조금 더 높게 잡습니다.
    var alpha = 0.05;
    alpha = max(alpha, edgeDetection * 0.25); // 에지 부분 반응성 강화
    alpha = max(alpha, motionWeight * 0.4);
    alpha = max(alpha, lumWeight);
    alpha = max(alpha, depthWeight);

    // 7. 최종 합성
    let finalYCoCg = mix(historyYCoCg, currentYCoCg, alpha);
    let finalColorRGB = ycocg_to_rgb(finalYCoCg);

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalColorRGB, currentColor.a));
}
