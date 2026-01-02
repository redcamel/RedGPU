{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 1. 현재 프레임 색상 로드
    let currentRGB = textureLoad(sourceTexture, pixelCoord, 0);

    // 2. 모션 벡터(Velocity) 로드 및 재투영 UV 계산
    // 현재 픽셀 위치의 속도 값을 가져와서 이전 프레임의 위치를 찾습니다.
    let velocity = textureLoad(motionVectorTexture, pixelCoord, 0).xy;
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;
    let historyUV = currentUV - velocity;

    var finalColor: vec4<f32>;

    // 3. 화면 밖으로 나간 경우 처리
    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalColor = currentRGB;
    } else {
        // 4. 과거 프레임 샘플링 (선형 보간)
        let historyRGB = textureSampleLevel(historyTexture, taaTextureSampler, historyUV, 0.0);

        // 5. 단순 블렌딩 (EMA)
        // 0.05(5%)는 현재 프레임, 0.95(95%)는 과거 프레임을 사용하여 부드럽게 만듭니다.
        let alpha = 0.05;
        finalColor = mix(historyRGB, currentRGB, alpha);
    }

    // 6. 결과 저장
    textureStore(outputTexture, pixelCoord, finalColor);
}