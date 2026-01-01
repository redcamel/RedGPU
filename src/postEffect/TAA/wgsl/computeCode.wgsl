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
    let pureUV = currentUV - jUV; // 지터가 제거된 현재 프레임의 기준 UV

    // --- 2. 현재 데이터 및 3x3 통계(Variance) 수집 ---
    let currentColorRGB = textureLoad(sourceTexture, pixelCoord, 0).rgb;
    let currentDepth = textureLoad(depthTexture, pixelCoord, 0);
    let currentYCoCg = rgb_to_ycocg(currentColorRGB);

    var m1 = vec3<f32>(0.0);
    var m2 = vec3<f32>(0.0);

    // Velocity Dilation을 위한 변수
    var closestDepth = 1.0;
    var closestOffset = vec2<i32>(0, 0);

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let samplePos = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);

            // A. 컬러 통계 수집
            let neighborRGB = textureLoad(sourceTexture, samplePos, 0).rgb;
            let neighborYCoCg = rgb_to_ycocg(neighborRGB);
            m1 += neighborYCoCg;
            m2 += neighborYCoCg * neighborYCoCg;

            // B. Velocity Dilation: 가장 가까운 픽셀 찾기
            let d = textureLoad(depthTexture, samplePos, 0);
            if (d < closestDepth) {
                closestDepth = d;
                closestOffset = vec2<i32>(x, y);
            }
        }
    }

    // Variance Clipping 범위 설정
    let mean = m1 / 9.0;
    let stddev = sqrt(max(vec3<f32>(0.0), (m2 / 9.0) - (mean * mean)));
    let minColorYCoCg = mean - 1.25 * stddev;
    let maxColorYCoCg = mean + 1.25 * stddev;

    // --- 3. 모션 벡터 샘플링 (Dilation 적용) ---
    // 가장 가까운 픽셀의 위치에서 모션 벡터를 추출 (Bilinear 필터링을 위해 SampleLevel 사용)
    let dilatedUV = (vec2<f32>(pixelCoord + closestOffset) + 0.5) * invScreenSize - jUV;
    let motionVector = textureSampleLevel(motionVectorTexture, taaTextureSampler, dilatedUV, 0.0).xy;

    // 히스토리 좌표 계산
    let historyUV = pureUV - motionVector + pjUV;
    let historyPixelCoord = vec2<i32>(historyUV * screenSize);

    // --- 4. 히스토리 복원 및 디스오컬루젼 (직접 샘플링 버전) ---
    var historyColorRGB = currentColorRGB;
    var dynamicAlpha = 0.05;
    let velocityLength = length(motionVector);

    // 히스토리 좌표 기반 픽셀 위치 (floor)
    let historyPos = historyUV * screenSize - 0.5;
    let fptr = floor(historyPos);
    let st = historyPos - fptr; // 보간 계수
    let basePixel = vec2<i32>(fptr);

    if (all(basePixel >= vec2<i32>(0)) && all(basePixel < vec2<i32>(screenSizeU) - 1)) {
        // A. 컬러 복원 (기존 Catmull-Rom 함수 내부에서 textureLoad를 쓴다면 유지)
        historyColorRGB = sample_texture_catmull_rom_ycocg(historyTexture, taaTextureSampler, historyUV, screenSize).rgb;

        // B. 뎁스 여러 개 직접 조회 (2x2 Neighborhood)
        let d00 = textureLoad(historyDepthTexture, basePixel + vec2<i32>(0, 0), 0);
        let d10 = textureLoad(historyDepthTexture, basePixel + vec2<i32>(1, 0), 0);
        let d01 = textureLoad(historyDepthTexture, basePixel + vec2<i32>(0, 1), 0);
        let d11 = textureLoad(historyDepthTexture, basePixel + vec2<i32>(1, 1), 0);

        // C. Bilinear 보간으로 대표 히스토리 뎁스 계산
        let historyDepth = mix(mix(d00, d10, st.x), mix(d01, d11, st.x), st.y);

        // D. 뎁스 비교 (Dilation된 현재 뎁스 vs 보간된 히스토리 뎁스)
        let depthDiff = abs(closestDepth - historyDepth);

        // E. 추가 안전장치: 4개 샘플 중 현재 뎁스와 가장 차이가 적은 값을 기준으로 쓸 수도 있음
        // let minDiff = min(min(abs(closestDepth - d00), abs(closestDepth - d10)),
        //                   min(abs(closestDepth - d01), abs(closestDepth - d11)));

        let adaptiveDepthThreshold = mix(0.1, 0.01, clamp(velocityLength / 0.01, 0.0, 1.0));

        if (depthDiff > adaptiveDepthThreshold) {
            let disocclusionAmount = smoothstep(adaptiveDepthThreshold, adaptiveDepthThreshold * 2.0, depthDiff);
            dynamicAlpha = mix(dynamicAlpha, 1.0, disocclusionAmount);
        }
    } else {
        dynamicAlpha = 1.0;
    }

    // 모션 속도에 따른 Alpha 보정 (잔상 제거 가속)
    dynamicAlpha = max(dynamicAlpha, mix(0.05, 0.5, clamp(velocityLength / 0.002, 0.0, 1.0)));

    // --- 5. 클램핑 및 최종 블렌딩 ---
    let historyYCoCg = rgb_to_ycocg(historyColorRGB);
    let clampedHistoryYCoCg = clamp(historyYCoCg, minColorYCoCg, maxColorYCoCg);

    let resolvedYCoCg = mix(clampedHistoryYCoCg, currentYCoCg, dynamicAlpha);
    let finalRGB = ycocg_to_rgb(resolvedYCoCg);

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, 1.0));
}