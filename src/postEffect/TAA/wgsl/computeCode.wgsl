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
    let motionMagnitude = length(motionVector);

    // 모션 블러 감소 효과 계산 - 모션이 클수록 현재 프레임 비중 증가
    let motionBlurFactor = smoothstep(0.001, 0.02, motionMagnitude) * uniforms.motionBlurReduction;

    // 모션 벡터가 큰 경우 현재 프레임만 사용 (기존 로직 + 모션 블러 감소 적용)
//    if (motionMagnitude > 0.01) {
//        // motionBlurReduction이 높을수록 현재 프레임을 더 많이 사용
//        let motionBasedBlend = mix(0.1, 1.0, motionBlurFactor);
//        let blendedColor = mix(
//            textureLoad(previousFrameTexture, pixelIndex).rgb,
//            currentFrameColor,
//            motionBasedBlend
//        );
//        textureStore(outputTexture, pixelIndex, vec4<f32>(blendedColor, 1.0));
//        return;
//    }


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

    // *** 업계 표준 3x3 Neighborhood 샘플링 ***
    var neighborhoodMin = currentFrameColor;
    var neighborhoodMax = currentFrameColor;
    var neighborhoodSum = vec3<f32>(0.0);
    var neighborhoodSumSquared = vec3<f32>(0.0);
    let neighborCount = 9.0; // 3x3 패턴: 총 9개 샘플

    // 3x3 커널 오프셋 (업계 표준)
    let offsets = array<vec2<i32>, 9>(
        vec2<i32>(-1, -1), vec2<i32>(0, -1), vec2<i32>(1, -1),  // 상단 행
        vec2<i32>(-1,  0), vec2<i32>(0,  0), vec2<i32>(1,  0),  // 중간 행
        vec2<i32>(-1,  1), vec2<i32>(0,  1), vec2<i32>(1,  1)   // 하단 행
    );

    // 가중치 (중앙에 더 높은 가중치 - 업계 표준 Gaussian-like)
    let weights = array<f32, 9>(
        0.0947416,  0.118318,  0.0947416,  // 상단 행
        0.118318,   0.147761,  0.118318,   // 중간 행 (중앙 가중치 높음)
        0.0947416,  0.118318,  0.0947416   // 하단 행
    );

    // 3x3 Neighborhood 샘플링
    for (var i = 0; i < 9; i++) {
        let offset = offsets[i];
        let sampleX = u32(clamp(i32(pixelIndex.x) + offset.x, 0, i32(textureSizeF.x - 1.0)));
        let sampleY = u32(clamp(i32(pixelIndex.y) + offset.y, 0, i32(textureSizeF.y - 1.0)));
        let samplePos = vec2<u32>(sampleX, sampleY);
        let sampleColor = textureLoad(sourceTexture, samplePos).rgb;
        let weight = weights[i];

        // Min/Max 계산 (Neighborhood Clamping용)
        neighborhoodMin = min(neighborhoodMin, sampleColor);
        neighborhoodMax = max(neighborhoodMax, sampleColor);

        // 가중 평균/분산 계산 (Variance Clipping용)
        let weightedColor = sampleColor * weight;
        neighborhoodSum += weightedColor;
        neighborhoodSumSquared += sampleColor * sampleColor * weight;
    }

    // 이전 프레임 색상을 이웃 범위로 클램핑 (고스팅 방지의 핵심!)
    let clampedPrevColor = clamp(previousFrameColor, neighborhoodMin, neighborhoodMax);

    // *** 개선된 Variance Clipping (업계 표준) ***
    let neighborhoodMean = neighborhoodSum; // 이미 가중 평균됨
    let neighborhoodVariance = neighborhoodSumSquared - (neighborhoodMean * neighborhoodMean);
    let neighborhoodStdDev = sqrt(max(neighborhoodVariance, vec3<f32>(0.0001))); // 최소값으로 수치 안정성 확보

    // 적응적 분산 스케일링 (모션에 따라 조정)
    let baseVarianceScale = 1.25;
    let adaptiveVarianceScale = mix(baseVarianceScale, baseVarianceScale * 0.5, min(motionMagnitude * 50.0, 1.0));

    let varianceMin = neighborhoodMean - neighborhoodStdDev * adaptiveVarianceScale;
    let varianceMax = neighborhoodMean + neighborhoodStdDev * adaptiveVarianceScale;
    let varianceClampedPrevColor = clamp(clampedPrevColor, varianceMin, varianceMax);

    // *** 개선된 Luminance-based rejection ***
    let currentLuma = dot(currentFrameColor, vec3<f32>(0.299, 0.587, 0.114));
    let prevLuma = dot(varianceClampedPrevColor, vec3<f32>(0.299, 0.587, 0.114));
    let neighborLuma = dot(neighborhoodMean, vec3<f32>(0.299, 0.587, 0.114));

    // 휘도 차이가 너무 클 경우 히스토리 거부
    let lumaDiff = abs(prevLuma - currentLuma);
    let neighborLumaDiff = abs(prevLuma - neighborLuma);

    // 적응적 블렌드 팩터 계산 (더 정교한 계산)
    let colorDifference = length(currentFrameColor - varianceClampedPrevColor);
    let rejectionFactor = smoothstep(0.015, 0.08, max(lumaDiff, colorDifference));
    let motionRejection = smoothstep(0.002, 0.012, motionMagnitude);

    // 최종 블렌드 팩터 - motionBlurReduction 적용
    let baseBlendFactor = uniforms.temporalBlendFactor;

    // 모션 블러 감소 효과를 추가로 적용
     let motionBlurAdjustedBlendFactor = mix(
          baseBlendFactor,
          min(baseBlendFactor + motionBlurFactor * 0.15, 0.9), // 더 보수적인 조정
          motionBlurFactor
      );

    let rejectionStrength = max(rejectionFactor, motionRejection);


    var adaptiveBlendFactor = mix(
        motionBlurAdjustedBlendFactor,
        0.85, // 거부 시 현재 프레임을 85% 사용 (더 보수적)
        rejectionStrength
    );
    let finalColor = mix(
        mix(varianceClampedPrevColor, currentFrameColor, adaptiveBlendFactor),
        mix(varianceClampedPrevColor, currentFrameColor, baseBlendFactor),
        adaptiveBlendFactor * adaptiveBlendFactor + 0.02
    );
    textureStore(outputTexture, pixelIndex, vec4<f32>(finalColor, 1.0));
}


    // Sobel edge detection
//    var sobelX = vec3<f32>(0.0);
//    var sobelY = vec3<f32>(0.0);
//
//    // Sobel kernel weights
//    let sobelKernelX = array<f32, 9>(-1.0, 0.0, 1.0, -2.0, 0.0, 2.0, -1.0, 0.0, 1.0);
//    let sobelKernelY = array<f32, 9>(-1.0, -2.0, -1.0, 0.0, 0.0, 0.0, 1.0, 2.0, 1.0);
//
//    var idx = 0;
//    for (var dy = -1; dy <= 1; dy++) {
//        for (var dx = -1; dx <= 1; dx++) {
//            let sampleX = u32(clamp(i32(pixelIndex.x) + dx, 0, i32(textureSizeF.x - 1.0)));
//            let sampleY = u32(clamp(i32(pixelIndex.y) + dy, 0, i32(textureSizeF.y - 1.0)));
//            let samplePos = vec2<u32>(sampleX, sampleY);
//            let sampleColor = textureLoad(sourceTexture, samplePos).rgb;
//
//            sobelX += sampleColor * sobelKernelX[idx];
//            sobelY += sampleColor * sobelKernelY[idx];
//            idx++;
//        }
//    }
//
//    let edgeStrength = length(sobelX) + length(sobelY);
//    let isComplexEdge = step(0.3, edgeStrength); // 복잡한 에지 검출
//
//    // 복잡한 에지 영역에서는 TAA 완전 비활성화
//    if (isComplexEdge > 0.5) {
//        adaptiveBlendFactor = 0.01;
//    }
