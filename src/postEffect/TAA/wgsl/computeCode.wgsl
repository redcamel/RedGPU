{
    let pixelCoord = global_id.xy;
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);

    if (any(pixelCoord >= screenSizeU)) { return; }

    let fragCoord = vec2<f32>(pixelCoord);
    let currentUV = fragCoord / screenSize;

    // 현재 프레임 컬러 샘플링
    let currentColor = textureSampleLevel(sourceTexture, motionVectorSampler, currentUV, 0.0);

    // 1. 초기 프레임 처리
    if (uniforms.frameIndex < 2.0) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // 2. 모션 벡터 추출 및 데이터 계산
    let motionVectorData = textureSampleLevel(motionVectorTexture, motionVectorSampler, currentUV, 0.0);
    let motionVector = motionVectorData.xy;
    let motionMagnitude = length(motionVector * screenSize);

    // 3. 히스토리 샘플링 위치 계산 및 유효성 검사
    let historyUV = currentUV - motionVector;
    let isOffScreen = any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0));

    let MAX_MOTION_PIXELS = 20.0;
    if (isOffScreen || motionMagnitude > MAX_MOTION_PIXELS) {
        textureStore(outputTexture, pixelCoord, currentColor);
        return;
    }

    // 4. 히스토리 컬러 샘플링 및 클리핑
    let historyColor = textureSampleLevel(previousFrameTexture, motionVectorSampler, historyUV, 0.0);
    let clampedHistory = varianceClipping(currentUV, historyColor, sourceTexture, motionVectorSampler);

    // 5. 밝기 변화량(Luminance Difference) 계산
    let currentLum = getLuminance(currentColor.rgb);
    let historyLum = getLuminance(clampedHistory.rgb);

    // 상대적 밝기 차이 계산 (0.0 ~ 1.0)
    let lumDiff = abs(currentLum - historyLum) / currentLum;
    // 밝기 차이가 10% 이상일 때부터 현재 프레임 비중을 높임
    let lumWeight = smoothstep(0.1, 0.4, lumDiff);

    // 6. 동적 블렌딩 계수 결정
    // 모션 기반 가중치
    let motionWeight = smoothstep(0.3, 2.0, motionMagnitude);

    // 깊이 기반 가중치 (멀리 있을수록 히스토리 신뢰도 높임)
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);
    let distanceWeight = mix(0.2, 0.05, f32(currentDepth));

    // 기본 블렌드: 움직임이 많을수록 현재 프레임(선명함) 비중 증가
    var dynamicBlend = mix(0.95, 0.6, motionWeight);

    // 밝기 변화가 크면 히스토리를 버리고 현재 프레임 비중을 대폭 강화
    dynamicBlend = max(dynamicBlend, lumWeight);

    // 거리 가중치와 결합 (최소 블렌딩 하한선 보정)
    dynamicBlend = max(dynamicBlend, distanceWeight * distanceWeight);

    // 7. 최종 합성 및 저장
    let finalColor = mix(clampedHistory, currentColor, dynamicBlend);
    textureStore(outputTexture, pixelCoord, finalColor);
}
