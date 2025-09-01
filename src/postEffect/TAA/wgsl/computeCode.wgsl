{
    let pixelIndex = vec2<u32>(global_id.xy);
    let textureSize = vec2<f32>(textureDimensions(sourceTexture));

    // 경계 체크
    if (any(pixelIndex >= vec2<u32>(textureSize))) {
        return;
    }

    let currentColor = textureLoad(sourceTexture, pixelIndex).rgb;
    let motionVector = textureLoad(motionVectorTexture, pixelIndex, 0);
    let motionVectorXY = motionVector.xy ;

    // jitter 비활성화 시 빠른 종료
    let disableJitter = motionVector.z > 0.5;
    if (disableJitter) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentColor, 1.0));
        return;
    }

    // 초기 프레임 처리
    if (uniforms.frameIndex < 3.0) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentColor, 1.0));
        return;
    }

    // 모션 벡터 사용하지 않는 경우
    if (uniforms.useMotionVectors < 0.5) {
        let previousColor = textureLoad(previousFrameTexture, pixelIndex).rgb;
        let blendFactor = clamp(uniforms.temporalBlendFactor, 0.2, 0.8);
        let blendedColor = mix(previousColor, currentColor, blendFactor);
        textureStore(outputTexture, pixelIndex, vec4<f32>(blendedColor, 1.0));
        return;
    }

    // 모션 벡터 계산
    let motionMagnitude = length(motionVectorXY);

    let currentPixelCoord = vec2<f32>(pixelIndex) + vec2<f32>(0.5);
    let previousPixelCoord = currentPixelCoord - motionVectorXY;

    // 이전 픽셀 좌표가 경계를 벗어나는 경우
    if (any(previousPixelCoord < vec2<f32>(0.5)) || any(previousPixelCoord >= textureSize - vec2<f32>(0.5))) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentColor, 1.0));
        return;
    }

    let motionBlurFactor = smoothstep(0.001, 0.02, motionMagnitude) * uniforms.motionBlurReduction;

    // 이중선형 보간으로 이전 색상 샘플링
    let sampleCoord = previousPixelCoord - vec2<f32>(0.5);
    let floorCoord = floor(sampleCoord);
    let fracCoord = sampleCoord - floorCoord;
    let baseIndex = vec2<u32>(floorCoord);

    let topLeft = textureLoad(previousFrameTexture, baseIndex).rgb;
    let topRight = textureLoad(previousFrameTexture, baseIndex + vec2<u32>(1, 0)).rgb;
    let bottomLeft = textureLoad(previousFrameTexture, baseIndex + vec2<u32>(0, 1)).rgb;
    let bottomRight = textureLoad(previousFrameTexture, baseIndex + vec2<u32>(1, 1)).rgb;

    let topMix = mix(topLeft, topRight, fracCoord.x);
    let bottomMix = mix(bottomLeft, bottomRight, fracCoord.x);
    let previousColor = mix(topMix, bottomMix, fracCoord.y);

    // 이웃 픽셀 분석
    var neighborMin = currentColor;
    var neighborMax = currentColor;
    var neighborSum = vec3<f32>(0.0);
    var neighborSumSquared = vec3<f32>(0.0);

    let neighborOffsets = array<vec2<i32>, 9>(
            vec2<i32>(-1, -1), vec2<i32>(0, -1), vec2<i32>(1, -1),
            vec2<i32>(-1,  0), vec2<i32>(0,  0), vec2<i32>(1,  0),
            vec2<i32>(-1,  1), vec2<i32>(0,  1), vec2<i32>(1,  1)
    );

    let neighborWeights = array<f32, 9>(
        0.111111, 0.111111, 0.111111,
          0.111111, 0.111111, 0.111111,
          0.111111, 0.111111, 0.111111

    );

    for (var i = 0; i < 9; i++) {
        let neighborPixelIndex = vec2<i32>(pixelIndex) + neighborOffsets[i];
        let clampedPixelIndex = clamp(
            neighborPixelIndex,
            vec2<i32>(0),
            vec2<i32>(textureSize) - vec2<i32>(1)
        );

        let samplePos = vec2<u32>(clampedPixelIndex);
        let sampleColor = textureLoad(sourceTexture, samplePos).rgb;
        let weight = neighborWeights[i];

        neighborMin = min(neighborMin, sampleColor);
        neighborMax = max(neighborMax, sampleColor);

        let weightedColor = sampleColor * weight;
        neighborSum += weightedColor;
        neighborSumSquared += sampleColor * sampleColor * weight;
    }

    let clampedPreviousColor = clamp(previousColor, neighborMin, neighborMax);

    let neighborMean = neighborSum;
    let neighborVariance = neighborSumSquared - (neighborMean * neighborMean);
    let neighborStdDev = sqrt(max(neighborVariance, vec3<f32>(0.0001)));

    let baseVarianceScale = 1.25;
    let adaptiveVarianceScale = mix(baseVarianceScale, baseVarianceScale * 0.5, min(motionMagnitude * 50.0, 1.0));

    let varianceMin = neighborMean - neighborStdDev * adaptiveVarianceScale;
    let varianceMax = neighborMean + neighborStdDev * adaptiveVarianceScale;
    let varianceClampedPreviousColor = clamp(clampedPreviousColor, varianceMin, varianceMax);

    let currentLuminance = dot(currentColor, vec3<f32>(0.299, 0.587, 0.114));
    let previousLuminance = dot(varianceClampedPreviousColor, vec3<f32>(0.299, 0.587, 0.114));

    let luminanceDiff = abs(previousLuminance - currentLuminance);
    let colorDifference = length(currentColor - varianceClampedPreviousColor);

    let rejectionFactor = smoothstep(0.015, 0.08, max(luminanceDiff, colorDifference));
    let motionRejectionFactor = smoothstep(0.002, 0.012, motionMagnitude);

    let baseBlendFactor = uniforms.temporalBlendFactor;

    // 모션에 따른 블렌드 팩터 조정 (모션이 클수록 현재 프레임 비중 증가)
    let motionAdjustment = smoothstep(0.001, 0.05, motionMagnitude) * 0.4;
    let motionAdjustedBlendFactor = clamp(baseBlendFactor + motionAdjustment, motionMagnitude, 0.95);

    // 거부 강도 계산 (색상 차이나 모션에 따른 히스토리 거부)
    let rejectionStrength = max(rejectionFactor, motionRejectionFactor);

    // 최종 적응형 블렌드 팩터 계산
    // rejectionStrength가 높을수록 현재 프레임을 더 많이 사용
    let adaptiveBlendFactor = mix(
        motionAdjustedBlendFactor,
        clamp(motionAdjustedBlendFactor + rejectionStrength * 0.6, 0.1, 0.9),
        rejectionStrength
    );

    let finalColor = mix(
        mix(varianceClampedPreviousColor, currentColor, adaptiveBlendFactor),
        mix(varianceClampedPreviousColor, currentColor, baseBlendFactor),
        1 - adaptiveBlendFactor * adaptiveBlendFactor * adaptiveBlendFactor * adaptiveBlendFactor * adaptiveBlendFactor  + 0.04
    );
    textureStore(outputTexture, pixelIndex, vec4<f32>(finalColor, 1.0));
}
