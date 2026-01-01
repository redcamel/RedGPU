{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // [Step 1] 분산 기반 통계 수집
    let stats = get_neighborhood_stats(pixelCoord, screenSizeU);

    // [Step 2] 현재 픽셀 샘플링 (Jitter 보정)
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;
    let jUV = uniforms.currJitterOffset * invScreenSize;
    let pureUV = currentUV - vec2<f32>(jUV.x, -jUV.y);
    let currentRGBA = textureSampleLevel(sourceTexture, taaTextureSampler, pureUV, 0.0);

    // [Step 3] 재투영
    let velocity = textureLoad(motionVectorTexture, pixelCoord, 0).xy;
    let jitterDelta = (uniforms.currJitterOffset - uniforms.prevJitterOffset) * invScreenSize;
    let historyUV = currentUV - velocity - jitterDelta;

    var finalColor: vec4<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalColor = currentRGBA;
    } else {
        // [Step 4] 히스토리 샘플링 및 Variance Clipping 적용
        let rawHistory = textureSampleLevel(historyTexture, taaTextureSampler, historyUV, 0.0);
        let clampedHistory = clamp_history(rawHistory, stats);

        // [Step 5] 블렌딩
        // 실제 언리얼 엔진은 여기서 고스트 현상 정도에 따라 blendAlpha를 가변적으로 조절하지만,
        // 일단은 고정값으로 시작합니다.
        let blendAlpha = 0.1;
        finalColor = mix(clampedHistory, currentRGBA, blendAlpha);
    }

    textureStore(outputTexture, pixelCoord, finalColor);
}