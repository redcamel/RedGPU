{
    let pixelIndex = vec2<u32>(global_id.xy);
    let textureSizeF = vec2<f32>(textureDimensions(sourceTexture));

    // UV 좌표 계산 (픽셀 중심 기준)
    let uv = (vec2<f32>(pixelIndex) + 0.5) / textureSizeF;

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
        let prevFrameColor = textureLoad(previousFrameTexture, pixelIndex, 0).rgb;
        let blendFactor = clamp(uniforms.temporalBlendFactor, 0.2, 0.8);
        let finalColor = mix(prevFrameColor, currentFrameColor, blendFactor);
        textureStore(outputTexture, pixelIndex, vec4<f32>(finalColor, 1.0));
        return;
    }

    // 모션 벡터 로드 (UV 공간에서)
    let motionVector = textureLoad(motionVectorTexture, pixelIndex, 0).xy;
    let motionMagnitude = length(motionVector);

    // 모션 블러 감소 효과 계산
    let motionBlurFactor = smoothstep(0.001, 0.02, motionMagnitude) * uniforms.motionBlurReduction;

    // 모션 벡터가 큰 경우 현재 프레임만 사용
     if (motionMagnitude > 0.01) {
        let motionBasedBlend = mix(0.1, 1.0, motionBlurFactor);
        let blendedColor = mix(
            textureLoad(previousFrameTexture, pixelIndex, 0).rgb,
            currentFrameColor,
            motionBasedBlend
        );
        textureStore(outputTexture, pixelIndex, vec4<f32>(blendedColor, 1.0));
        return;
    }

    // 이전 프레임 UV 위치 계산
    let prevUV = uv - motionVector;

    // UV 경계 체크 (더 정확한 범위)
    if (any(prevUV < vec2<f32>(0.5 / textureSizeF.x, 0.5 / textureSizeF.y)) ||
        any(prevUV > vec2<f32>(1.0 - 0.5 / textureSizeF.x, 1.0 - 0.5 / textureSizeF.y))) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentFrameColor, 1.0));
        return;
    }

    // 이전 프레임 픽셀 좌표 계산 (UV에서 픽셀로 변환)
    let prevPixelCoord = prevUV * textureSizeF - 0.5;
    let prevPixelFloor = floor(prevPixelCoord);
    let prevPixelFrac = prevPixelCoord - prevPixelFloor;
    let prevPixelIndex = vec2<u32>(prevPixelFloor);

    // 바이리니어 보간으로 이전 프레임 샘플링
    let tl = textureLoad(previousFrameTexture, prevPixelIndex, 0).rgb;
    let tr = textureLoad(previousFrameTexture, prevPixelIndex + vec2<u32>(1, 0), 0).rgb;
    let bl = textureLoad(previousFrameTexture, prevPixelIndex + vec2<u32>(0, 1), 0).rgb;
    let br = textureLoad(previousFrameTexture, prevPixelIndex + vec2<u32>(1, 1), 0).rgb;

    let topMix = mix(tl, tr, prevPixelFrac.x);
    let bottomMix = mix(bl, br, prevPixelFrac.x);
    let previousFrameColor = mix(topMix, bottomMix, prevPixelFrac.y);

    // *** 업계 표준 3x3 Neighborhood 샘플링 ***
    var neighborhoodMin = currentFrameColor;
    var neighborhoodMax = currentFrameColor;
    var neighborhoodSum = vec3<f32>(0.0);
    var neighborhoodSumSquared = vec3<f32>(0.0);

    // 3x3 커널 오프셋 및 가중치
    let offsets = array<vec2<i32>, 9>(
        vec2<i32>(-1, -1), vec2<i32>(0, -1), vec2<i32>(1, -1),
        vec2<i32>(-1,  0), vec2<i32>(0,  0), vec2<i32>(1,  0),
        vec2<i32>(-1,  1), vec2<i32>(0,  1), vec2<i32>(1,  1)
    );

    let weights = array<f32, 9>(
        0.0947416,  0.118318,  0.0947416,
        0.118318,   0.147761,  0.118318,
        0.0947416,  0.118318,  0.0947416
    );

    // 3x3 Neighborhood 샘플링
    for (var i = 0; i < 9; i++) {
        let offset = offsets[i];
        let sampleX = u32(clamp(i32(pixelIndex.x) + offset.x, 0, i32(textureSizeF.x - 1.0)));
        let sampleY = u32(clamp(i32(pixelIndex.y) + offset.y, 0, i32(textureSizeF.y - 1.0)));
        let samplePos = vec2<u32>(sampleX, sampleY);
        let sampleColor = textureLoad(sourceTexture, samplePos).rgb;
        let weight = weights[i];

        neighborhoodMin = min(neighborhoodMin, sampleColor);
        neighborhoodMax = max(neighborhoodMax, sampleColor);

        let weightedColor = sampleColor * weight;
        neighborhoodSum += weightedColor;
        neighborhoodSumSquared += sampleColor * sampleColor * weight;
    }

    // 이전 프레임 색상을 이웃 범위로 클램핑
    let clampedPrevColor = clamp(previousFrameColor, neighborhoodMin, neighborhoodMax);

    // *** 개선된 Variance Clipping ***
    let neighborhoodMean = neighborhoodSum;
    let neighborhoodVariance = neighborhoodSumSquared - (neighborhoodMean * neighborhoodMean);
    let neighborhoodStdDev = sqrt(max(neighborhoodVariance, vec3<f32>(0.0001)));

    // 적응적 분산 스케일링
    let baseVarianceScale = 1.25;
    let adaptiveVarianceScale = mix(baseVarianceScale, baseVarianceScale * 0.5, min(motionMagnitude * 50.0, 1.0));

    let varianceMin = neighborhoodMean - neighborhoodStdDev * adaptiveVarianceScale;
    let varianceMax = neighborhoodMean + neighborhoodStdDev * adaptiveVarianceScale;
    let varianceClampedPrevColor = clamp(clampedPrevColor, varianceMin, varianceMax);

    // *** Luminance-based rejection ***
    let currentLuma = dot(currentFrameColor, vec3<f32>(0.299, 0.587, 0.114));
    let prevLuma = dot(varianceClampedPrevColor, vec3<f32>(0.299, 0.587, 0.114));
    let neighborLuma = dot(neighborhoodMean, vec3<f32>(0.299, 0.587, 0.114));

    let lumaDiff = abs(prevLuma - currentLuma);
    let neighborLumaDiff = abs(prevLuma - neighborLuma);

    // 적응적 블렌드 팩터 계산
    let colorDifference = length(currentFrameColor - varianceClampedPrevColor);
    let rejectionFactor = smoothstep(0.015, 0.08, max(lumaDiff, colorDifference));
    let motionRejection = smoothstep(0.002, 0.012, motionMagnitude);

    // 최종 블렌드 팩터
    let baseBlendFactor = uniforms.temporalBlendFactor;

    let motionBlurAdjustedBlendFactor = mix(
        baseBlendFactor,
        min(baseBlendFactor + motionBlurFactor * 0.25, 0.9),
        motionBlurFactor
    );

    var adaptiveBlendFactor = mix(
        motionBlurAdjustedBlendFactor,
        0.85,
        max(rejectionFactor, motionRejection)
    );

    // 에지 검출 기반 블렌딩 조정
    let edgeStrength = length(neighborhoodMax - neighborhoodMin);
    let isHighFrequency = smoothstep(0.1, 0.3, edgeStrength);
    adaptiveBlendFactor = mix(adaptiveBlendFactor, min(adaptiveBlendFactor + 0.3, 0.95), isHighFrequency);

    let finalColor = mix(varianceClampedPrevColor, currentFrameColor, adaptiveBlendFactor);
    textureStore(outputTexture, pixelIndex, vec4<f32>(finalColor, 1.0));
}
