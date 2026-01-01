{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // --- 1. 좌표 및 지터 설정 ---
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;
    let jUV = uniforms.jitterOffset * 0.5;
    let pjUV = uniforms.prevJitterOffset * 0.5;
    let pureUV = currentUV - jUV;

    // --- 2. 현재 데이터 수집 (textureLoad 사용) ---
    let currentColor = textureLoad(sourceTexture, pixelCoord, 0);
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);

    // 3x3 Min/Max (Color Clipping용)
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

    // --- 3. 히스토리 좌표 계산 및 로드 ---
    // 모션 벡터는 보간된 값을 읽어야 하므로 SampleLevel 유지
    let motionVector = textureSampleLevel(motionVectorTexture, taaTextureSampler, pureUV, 0.0).xy;
    let historyUV = pureUV - motionVector + pjUV;

    // [중요] 히스토리 UV를 다시 정수 픽셀 좌표로 변환 (textureLoad용)
    let historyPixelCoord = vec2<i32>(historyUV * screenSize);

    var historyColor = currentColor;
    var dynamicAlpha = 0.05;

    // 경계 검사
    if (all(historyPixelCoord >= vec2<i32>(0)) && all(historyPixelCoord < vec2<i32>(screenSizeU))) {
        // 1. 히스토리 컬러 샘플링 (Catmull-Rom을 쓰거나, 성능을 위해 Load 사용 가능)
        // 여기서는 부드러운 AA를 위해 컬러만 Sample(Bilinear/Catmull)을 사용하거나 Load 후 보간합니다.
        historyColor = sample_texture_catmull_rom(historyTexture, taaTextureSampler, historyUV, screenSize);

        // 2. 히스토리 뎁스 로드 (정수 좌표로 정확하게 읽기)
        let historyDepth = textureLoad(historyDepthTexture, historyPixelCoord, 0);

        // 3. 디스오컬루젼 체크 (Depth Reject)
        let depthDiff = abs(currentDepth - historyDepth);
        if (depthDiff > 0.005) { // 임계값은 뎁스 정밀도에 따라 조절
            dynamicAlpha = 1.0;
        }
    } else {
        dynamicAlpha = 1.0;
    }

    // --- 4. 모션 기반 Alpha 보정 ---
    let velocityLength = length(motionVector * screenSize);
    dynamicAlpha = max(dynamicAlpha, mix(0.05, 0.5, clamp(velocityLength / 2.0, 0.0, 1.0)));

    // --- 5. 최종 처리 ---
    let clampedHistory = clamp(historyColor, minColor, maxColor);
    let resolvedColor = mix(clampedHistory, currentColor, dynamicAlpha);

    textureStore(outputTexture, pixelCoord, resolvedColor);
}