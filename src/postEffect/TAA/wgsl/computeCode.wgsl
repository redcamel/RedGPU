{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let invScreenSize = 1.0 / screenSize;

    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // --- 1. 좌표 및 현재 컬러 설정 ---
    let currentUV = (vec2<f32>(pixelCoord) + 0.5) * invScreenSize;
    let unjitteredUV = currentUV - uniforms.jitterOffset;
    let currentColor = textureSampleLevel(sourceTexture, taaTextureSampler, unjitteredUV, 0.0);

    if (uniforms.frameIndex < 2.0) {
        textureStore(outputTexture, vec2<u32>(pixelCoord), currentColor);
        return;
    }

    // --- 2. Velocity Dilation ---
    var bestOffset = vec2<i32>(0, 0);
    var minDepth = 1.0;
    for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
            let neighbor = clamp(pixelCoord + vec2<i32>(x, y), vec2<i32>(0), vec2<i32>(screenSizeU) - 1);
            let d = textureLoad(depthTexture, neighbor, 0);
            if (d < minDepth) {
                minDepth = d;
                bestOffset = vec2<i32>(x, y);
            }
        }
    }
    let dilatedUV = (vec2<f32>(pixelCoord + bestOffset) + 0.5) * invScreenSize;
    let motionVector = textureSampleLevel(motionVectorTexture, taaTextureSampler, dilatedUV, 0.0).xy;


    let motionPixel = motionVector * screenSize;
    let motionMag = length(motionPixel);

    // 1. 임계값 설정 (예: 한 프레임에 20픽셀 이상 이동 시)
    let maxMotionPixel: f32 = 20.0;

    if (motionMag > maxMotionPixel) {
        // 움직임이 너무 빠르면 히스토리가 오염된 것으로 간주하고
        // 안티앨리어싱을 포기(현재 프레임 출력)하여 지글거림과 잔상을 방지합니다.
        textureStore(outputTexture, vec2<u32>(pixelCoord), currentColor);
        return;
    }
    // --- 3. 히스토리 재투영 및 UV 안전 마진 체크 ---
    let historyUV = unjitteredUV - motionVector;

    // Catmull-Rom 필터 반경(1.5 픽셀)을 고려한 안전 마진
    let edgeMargin = 1.5 * invScreenSize;
    let isOutOfBounds = any(historyUV < edgeMargin) || any(historyUV > (1.0 - edgeMargin));

    var finalHistory: vec4<f32>;
    if (isOutOfBounds) {
        // 화면 밖이면 누적을 중단하고 현재 프레임 사용 (스트레칭 방지)
        textureStore(outputTexture, vec2<u32>(pixelCoord), currentColor);
        return;
    } else {
        // --- 4. 가려짐 감지 및 샘플링 ---
        let historyCoord = vec2<i32>(historyUV * screenSize);
        let prevDepth = textureLoad(historyDepthTexture, clamp(historyCoord, vec2<i32>(0), vec2<i32>(screenSizeU) - 1), 0);

        let depthDiff = abs(minDepth - prevDepth);
        let relativeDiff = depthDiff / (min(minDepth, prevDepth) + 1e-4);
        let disocclusionWeight = smoothstep(0.01, 0.05, relativeDiff);

        // 고품질 샘플링 및 개별 클리핑 (currentUV 전달로 정밀도 향상)
        let historyColor = sampleTextureCatmullRom(previousFrameTexture, taaTextureSampler, historyUV);
        finalHistory = varianceClipping(currentUV, historyColor, sourceTexture, taaTextureSampler);

        // --- 5. 최종 혼합 (Luma Weighting 적용) ---
        let currentYCoCg = rgb_to_ycocg(currentColor.rgb);
        let historyYCoCg = rgb_to_ycocg(finalHistory.rgb);

        // 휘도 기반 가중치: 바닥 지글거림 억제의 핵심
        let w_c = 1.0 / (1.0 + currentYCoCg.x);
        let w_h = 1.0 / (1.0 + historyYCoCg.x);

        var alpha = mix(0.05, 0.5, disocclusionWeight);

        // 가중치를 반영한 혼합
        let blend_h = (1.0 - alpha) * w_h;
        let blend_c = alpha * w_c;
        var finalYCoCg = (historyYCoCg * blend_h + currentYCoCg * blend_c) / (blend_h + blend_c);

        // 최종 안전 클램핑
        finalYCoCg.x = max(finalYCoCg.x, 0.0);
        let finalRGB = clamp(ycocg_to_rgb(finalYCoCg), vec3<f32>(0.0), vec3<f32>(1.0));

        textureStore(outputTexture, vec2<u32>(pixelCoord), vec4<f32>(finalRGB, currentColor.a));
    }
}
