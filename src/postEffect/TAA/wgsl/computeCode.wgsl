{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    // 화면 영역 밖 처리
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 1. 현재 픽셀 UV 및 지터 보정 (Unjitter)
    // CPU에서 전달된 jitterOffset(halton-0.5 / size)을 빼서 정확한 픽셀 위치 복구
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) / screenSize;
    let unjitteredUV = currentUV - uniforms.jitterOffset;

    // 2. 현재 컬러 샘플링 (보정된 UV 사용)
    let currentColor = textureSampleLevel(sourceTexture, taaTextureSampler, unjitteredUV, 0.0);

    // 초기 프레임 처리
    if (uniforms.frameIndex < 2.0) {
        textureStore(outputTexture, vec2<u32>(pixelCoord), currentColor);
        return;
    }

    // 3. Velocity Dilation 및 Min Depth 추출
    // 3x3 영역에서 가장 가까운(가장 작은) 깊이를 가진 픽셀의 모션을 찾음
    var bestOffset = vec2<i32>(0, 0);
    var minCurrentDepth = 1.0;

    for (var y: i32 = -1; y <= 1; y++) {
        for (var x: i32 = -1; x <= 1; x++) {
            let neighbor = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            // MSAA 텍스처인 경우 마지막 인자 0(샘플 인덱스) 명시
            let d = textureLoad(depthTexture, neighbor, 0);
            if (d < minCurrentDepth) {
                minCurrentDepth = d;
                bestOffset = vec2<i32>(x, y);
            }
        }
    }

   let dilatedUV = (vec2<f32>(pixelCoord + bestOffset) + 0.5) / screenSize;

   // [수정] 이미 UV 단위이므로 invScreenSize를 곱하지 않습니다.
   let motionVector = textureSampleLevel(motionVectorTexture, taaTextureSampler, dilatedUV, 0.0).xy;

   // 4. 히스토리 좌표 계산
   let historyUV = unjitteredUV - motionVector;
    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        textureStore(outputTexture, vec2<u32>(pixelCoord), currentColor);
        return;
    }

    // 5. Depth Disocclusion Check (새로 추가된 부분)
    // 히스토리 깊이를 가져와 현재와 비교
    let historyCoord = vec2<i32>(historyUV * screenSize);
    let historyDepth = textureLoad(historyDepthTexture, clamp(historyCoord, vec2<i32>(0), vec2<i32>(screenSizeU) - 1), 0);

    let depthDiff = abs(minCurrentDepth - historyDepth);
    let relativeDepthDiff = depthDiff / (min(minCurrentDepth, historyDepth) + 1e-4);

    // 깊이 차이가 크면(가려졌던 곳이 나타나면) 가중치 발생
    let disocclusionWeight = smoothstep(0.02, 0.08, relativeDepthDiff);

    // 6. 히스토리 샘플링 (Catmull-Rom으로 선명도 보강)
    let historyColor = sampleTextureCatmullRom(previousFrameTexture, taaTextureSampler, historyUV);

    // 7. Variance Clipping (k값을 1.5~2.0으로 하여 선명도 유지)
    // 보정된 unjitteredUV 주변 3x3 색상으로 히스토리를 클램핑
    let clampedHistory = varianceClipping(unjitteredUV, historyColor, sourceTexture, taaTextureSampler);

    // 8. 색상 공간 변환 및 최종 혼합 (YCoCg)
    let currentYCoCg = rgb_to_ycocg(currentColor.rgb);
    let historyYCoCg = rgb_to_ycocg(clampedHistory.rgb);

    // Dynamic Alpha: 기본 0.05(95% 누적)
    // Disocclusion 발생 시 최대 0.5까지만 현재 프레임을 섞음 (급격한 블러 방지)
    var alpha = 0.05;
    alpha = mix(alpha, 0.5, disocclusionWeight);

    // 극단적인 모션이 있을 때 아주 살짝만 더 현재 프레임 반영
    let motionMag = length(motionVector * screenSize);
//    alpha = max(alpha, smoothstep(20.0, 40.0, motionMag) * 0.2);

    let finalYCoCg = mix(historyYCoCg, currentYCoCg, alpha);
    let finalColorRGB = ycocg_to_rgb(finalYCoCg);

    // 9. 결과 저장
    textureStore(outputTexture, vec2<u32>(pixelCoord), vec4<f32>(finalColorRGB, currentColor.a));
    // 모션 벡터 방향 확인: 오른쪽 이동 시 빨간색(R), 아래 이동 시 초록색(G) 증가
//    let debugMV = motionVector;
//    textureStore(outputTexture, vec2<u32>(pixelCoord), vec4<f32>(motionVector.xy,0.0,1.0));
}
