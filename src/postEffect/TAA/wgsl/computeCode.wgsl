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
        let blendFactor = clamp(uniforms.temporalBlendFactor, 0.15, 0.7);
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

    // 이웃 픽셀 분석 - 더 부드러운 가우시안 스타일 가중치
    var neighborMin = currentColor;
    var neighborMax = currentColor;
    var neighborSum = vec3<f32>(0.0);
    var neighborSumSquared = vec3<f32>(0.0);

    let neighborOffsets = array<vec2<i32>, 9>(
            vec2<i32>(-1, -1), vec2<i32>(0, -1), vec2<i32>(1, -1),
            vec2<i32>(-1,  0), vec2<i32>(0,  0), vec2<i32>(1,  0),
            vec2<i32>(-1,  1), vec2<i32>(0,  1), vec2<i32>(1,  1)
    );

    // 가우시안 스타일 가중치 (더 부드러운 블렌딩)
    let neighborWeights = array<f32, 9>(
        0.077, 0.123, 0.077,
        0.123, 0.200, 0.123,
        0.077, 0.123, 0.077
    );
  let lumCoeffs = vec3<f32>(0.2126, 0.7152, 0.0722);
    let currentLum = dot(currentColor, lumCoeffs);
    var edgeStrength = 0.0;
    var totalWeight = 0.0;

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

        // 더 부드러운 엣지 감지
        let sampleLum = dot(sampleColor, lumCoeffs);
        edgeStrength += abs(sampleLum - currentLum) * weight;
        totalWeight += weight;

        neighborMin = min(neighborMin, sampleColor);
        neighborMax = max(neighborMax, sampleColor);

        let weightedColor = sampleColor * weight;
        neighborSum += weightedColor;
        neighborSumSquared += sampleColor * sampleColor * weight;
    }

    // 매우 부드러운 엣지 감지
    let normalizedEdgeStrength = clamp(edgeStrength / totalWeight, 0.0, 1.0);
    let lineDetectionFactor = smoothstep(0.03, 0.08, normalizedEdgeStrength);

    let clampedPreviousColor = clamp(previousColor, neighborMin, neighborMax);

    let neighborMean = neighborSum;
    let neighborVariance = neighborSumSquared - (neighborMean * neighborMean);
    let neighborStdDev = sqrt(max(neighborVariance, vec3<f32>(0.0001)));

    // 더욱 부드러운 분산 스케일링
    let baseVarianceScale = 4.0; // 더 관대한 기본값
    let lineVarianceReduction = mix(1.0, 0.8, lineDetectionFactor * 0.5); // 더 부드러운 감소
    let motionVarianceReduction = mix(0.6, 0.5, lineDetectionFactor * 0.3);

    let adaptiveVarianceScale = mix(
        baseVarianceScale * lineVarianceReduction,
        baseVarianceScale * lineVarianceReduction * motionVarianceReduction,
        smoothstep(0.005, 0.08, motionMagnitude) // 더 점진적인 모션 반응
    );

    let varianceMin = neighborMean - neighborStdDev * adaptiveVarianceScale;
    let varianceMax = neighborMean + neighborStdDev * adaptiveVarianceScale;
    let varianceClampedPreviousColor = clamp(clampedPreviousColor, varianceMin, varianceMax);

    let previousLuminance = dot(varianceClampedPreviousColor, lumCoeffs);

    let luminanceDiff = abs(previousLuminance - currentLum);
    let colorDifference = length(currentColor - varianceClampedPreviousColor);

    // 더 관대한 거부 임계값
    let baseRejectionFactor = smoothstep(0.03, 0.15, max(luminanceDiff, colorDifference));
    let motionRejectionFactor = smoothstep(1.2, 3.5, motionMagnitude);

    let rejectionFactor = max(baseRejectionFactor, motionRejectionFactor);

    // 더 보수적인 기본 블렌드 팩터
    let baseBlendFactor = clamp(uniforms.temporalBlendFactor, 0.08, 0.6);

    // 매우 부드러운 모션 조정
    let motionAdjustment = smoothstep(0.005, 0.12, motionMagnitude) * mix(0.15, 0.25, lineDetectionFactor * 0.6);
    let motionAdjustedBlendFactor = clamp(baseBlendFactor + motionAdjustment, 0.08, 0.7);

    // 최종 블렌드 팩터 - 매우 부드러운 전환
    let rejectionInfluence = mix(0.25, 0.35, lineDetectionFactor * 0.4);
    let rejectionSmoothness = 0.5; // 더 부드러운 거부 반응

    let adaptiveBlendFactor = mix(
        motionAdjustedBlendFactor,
        clamp(motionAdjustedBlendFactor + rejectionFactor * rejectionInfluence, 0.12, 0.65),
        rejectionFactor * rejectionSmoothness
    );

    // 추가 안정화: 극단적인 블렌드 팩터 방지
    let stabilizedBlendFactor = clamp(adaptiveBlendFactor, 0.08, 0.6);

    let finalColor = mix(varianceClampedPreviousColor, currentColor, stabilizedBlendFactor);

    textureStore(outputTexture, pixelIndex, vec4<f32>(finalColor, 1.0));
}
