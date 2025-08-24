{
    let pixelIndex = vec2<u32>(global_id.xy);
    let textureSizeF = vec2<f32>(textureDimensions(sourceTexture));

    if (any(pixelIndex >= vec2<u32>(textureSizeF))) {
        return;
    }

    let currentFrameColor = textureLoad(sourceTexture, pixelIndex).rgb;

    // 초기 몇 프레임은 현재 프레임만 사용
    if (uniforms.frameIndex < 3.0) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentFrameColor, 1.0));
        return;
    }

    // 모션 벡터 사용 여부 확인
    if (uniforms.useMotionVectors < 0.5) {
        let prevFrameColor = textureLoad(previousFrameTexture, pixelIndex).rgb;
        let blendFactor = clamp(uniforms.temporalBlendFactor, 0.2, 0.8);
        let finalColor = mix(prevFrameColor, currentFrameColor, blendFactor);
        textureStore(outputTexture, pixelIndex, vec4<f32>(finalColor, 1.0));
        return;
    }

    // 모션 벡터 로드
    let motionVector = textureLoad(motionVectorTexture, pixelIndex, 0).xy;

    // 모션 벡터가 큰 경우 현재 프레임만 사용
    let motionMagnitude = length(motionVector);
    if (motionMagnitude > 0.01) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentFrameColor, 1.0));
        return;
    }

    // 이전 프레임 위치 계산
    let prevPixelCoord = vec2<f32>(pixelIndex) - motionVector;

    // 경계 체크
    if (any(prevPixelCoord < vec2<f32>(1.0)) || any(prevPixelCoord >= textureSizeF - vec2<f32>(1.0))) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentFrameColor, 1.0));
        return;
    }

    // 바이리니어 보간으로 이전 프레임 샘플링
    let prevPixelFloor = floor(prevPixelCoord);
    let prevPixelFrac = prevPixelCoord - prevPixelFloor;
    let prevPixelIndex = vec2<u32>(prevPixelFloor);

    let tl = textureLoad(previousFrameTexture, prevPixelIndex).rgb;
    let tr = textureLoad(previousFrameTexture, prevPixelIndex + vec2<u32>(1, 0)).rgb;
    let bl = textureLoad(previousFrameTexture, prevPixelIndex + vec2<u32>(0, 1)).rgb;
    let br = textureLoad(previousFrameTexture, prevPixelIndex + vec2<u32>(1, 1)).rgb;

    let topMix = mix(tl, tr, prevPixelFrac.x);
    let bottomMix = mix(bl, br, prevPixelFrac.x);
    let previousFrameColor = mix(topMix, bottomMix, prevPixelFrac.y);

    // *** 핵심: Neighborhood Clamping (이웃 영역 클램핑) ***
    // 현재 프레임의 3x3 이웃 영역 분석
    var neighborhoodMin = currentFrameColor;
    var neighborhoodMax = currentFrameColor;

    // 3x3 이웃 픽셀 샘플링 - 타입 변환 수정
    for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
            let sampleX = u32(clamp(i32(pixelIndex.x) + dx, 0, i32(textureSizeF.x - 1.0)));
            let sampleY = u32(clamp(i32(pixelIndex.y) + dy, 0, i32(textureSizeF.y - 1.0)));
            let samplePos = vec2<u32>(sampleX, sampleY);
            let sampleColor = textureLoad(sourceTexture, samplePos).rgb;
            neighborhoodMin = min(neighborhoodMin, sampleColor);
            neighborhoodMax = max(neighborhoodMax, sampleColor);
        }
    }

    // 이전 프레임 색상을 이웃 범위로 클램핑 (고스팅 방지의 핵심!)
    let clampedPrevColor = clamp(previousFrameColor, neighborhoodMin, neighborhoodMax);

    // *** 추가: Variance Clipping ***
    // 이웃의 평균과 분산 계산
    var neighborhoodSum = vec3<f32>(0.0);
    var neighborhoodSumSquared = vec3<f32>(0.0);
    let neighborCount = 9.0;

    for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
            let sampleX = u32(clamp(i32(pixelIndex.x) + dx, 0, i32(textureSizeF.x - 1.0)));
            let sampleY = u32(clamp(i32(pixelIndex.y) + dy, 0, i32(textureSizeF.y - 1.0)));
            let samplePos = vec2<u32>(sampleX, sampleY);
            let sampleColor = textureLoad(sourceTexture, samplePos).rgb;
            neighborhoodSum += sampleColor;
            neighborhoodSumSquared += sampleColor * sampleColor;
        }
    }

    let neighborhoodMean = neighborhoodSum / neighborCount;
    let neighborhoodVariance = (neighborhoodSumSquared / neighborCount) - (neighborhoodMean * neighborhoodMean);
    let neighborhoodStdDev = sqrt(max(neighborhoodVariance, vec3<f32>(0.0)));

    // 분산 기반 클램핑 (더 정교한 고스팅 방지)
    let varianceScale = 1.25; // 조정 가능한 매개변수
    let varianceMin = neighborhoodMean - neighborhoodStdDev * varianceScale;
    let varianceMax = neighborhoodMean + neighborhoodStdDev * varianceScale;
    let varianceClampedPrevColor = clamp(clampedPrevColor, varianceMin, varianceMax);

    // *** 추가: Luminance-based rejection ***
    let currentLuma = dot(currentFrameColor, vec3<f32>(0.299, 0.587, 0.114));
    let prevLuma = dot(varianceClampedPrevColor, vec3<f32>(0.299, 0.587, 0.114));
    let neighborLuma = dot(neighborhoodMean, vec3<f32>(0.299, 0.587, 0.114));

    // 휘도 차이가 너무 클 경우 히스토리 거부
    let lumaDiff = abs(prevLuma - currentLuma);
    let neighborLumaDiff = abs(prevLuma - neighborLuma);

    // 적응적 블렌드 팩터 계산
    let colorDifference = length(currentFrameColor - varianceClampedPrevColor);
    let rejectionFactor = smoothstep(0.02, 0.1, max(lumaDiff, colorDifference));
    let motionRejection = smoothstep(0.003, 0.015, motionMagnitude);

    // 최종 블렌드 팩터 (고스팅 방지를 위해 더 보수적으로)
    let baseBlendFactor = uniforms.temporalBlendFactor;
    let adaptiveBlendFactor = mix(
        baseBlendFactor,
        0.95, // 거부 시 현재 프레임을 95% 사용
        max(rejectionFactor, motionRejection)
    );

    // 최종 색상 혼합
    let finalColor = mix(varianceClampedPrevColor, currentFrameColor, adaptiveBlendFactor);
    textureStore(outputTexture, pixelIndex, vec4<f32>(finalColor, 1.0));
}
