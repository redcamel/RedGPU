{
    let pixelIndex = vec2<u32>(global_id.xy);
    let textureSize = vec2<f32>(textureDimensions(sourceTexture));

    if (any(pixelIndex >= vec2<u32>(textureSize))) {
        return;
    }

    let currentColor = textureLoad(sourceTexture, pixelIndex).rgb;

    if (uniforms.frameIndex < 3.0) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentColor, 1.0));
        return;
    }

    if (uniforms.useMotionVectors < 0.5) {
        let previousColor = textureLoad(previousFrameTexture, pixelIndex).rgb;
        let blendFactor = clamp(uniforms.temporalBlendFactor, 0.2, 0.8);
        let blendedColor = mix(previousColor, currentColor, blendFactor);
        textureStore(outputTexture, pixelIndex, vec4<f32>(blendedColor, 1.0));
        return;
    }

    // 이미 픽셀 단위로 저장된 모션 벡터를 직접 사용
    let motionVector = textureLoad(motionVectorTexture, pixelIndex, 0).xy;
    let motionMagnitude = length(motionVector);
    let motionBlurFactor = smoothstep(0.001, 0.02, motionMagnitude) * uniforms.motionBlurReduction;

    let currentPixelCoord = vec2<f32>(pixelIndex) + vec2<f32>(0.5);
    let previousPixelCoord = currentPixelCoord - motionVector;

    if (any(previousPixelCoord < vec2<f32>(0.5)) || any(previousPixelCoord >= textureSize - vec2<f32>(0.5))) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentColor, 1.0));
        return;
    }

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

    var neighborMin = currentColor;
    var neighborMax = currentColor;
    var neighborSum = vec3<f32>(0.0);
    var neighborSumSquared = vec3<f32>(0.0);

    let neighborOffsets = array<vec2<f32>, 9>(
        vec2<f32>(-1.0, -1.0), vec2<f32>(0.0, -1.0), vec2<f32>(1.0, -1.0),
        vec2<f32>(-1.0,  0.0), vec2<f32>(0.0,  0.0), vec2<f32>(1.0,  0.0),
        vec2<f32>(-1.0,  1.0), vec2<f32>(0.0,  1.0), vec2<f32>(1.0,  1.0)
    );

    let neighborWeights = array<f32, 9>(
        0.0947416, 0.118318, 0.0947416,
        0.118318,  0.147761, 0.118318,
        0.0947416, 0.118318, 0.0947416
    );

    for (var i = 0; i < 9; i++) {
        let offset = neighborOffsets[i];
        let sampleCoordF = vec2<f32>(pixelIndex) + offset;
        let clampedSampleCoord = clamp(sampleCoordF, vec2<f32>(0.0), textureSize - vec2<f32>(1.0));
        let samplePos = vec2<u32>(clampedSampleCoord);
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
    let motionBlurAdjustedBlendFactor = mix(
        baseBlendFactor,
        min(baseBlendFactor + motionBlurFactor * 0.3, 0.9),
        motionBlurFactor
    );

    let rejectionStrength = max(rejectionFactor, motionRejectionFactor);
    let adaptiveBlendFactor = mix(
        motionBlurAdjustedBlendFactor,
        0.85,
        rejectionStrength
    );

    let finalColor = mix(
        mix(varianceClampedPreviousColor, currentColor, adaptiveBlendFactor),
        mix(varianceClampedPreviousColor, currentColor, baseBlendFactor),
        adaptiveBlendFactor * adaptiveBlendFactor  + 0.04
    );

    let disableJitter = false;
    if (disableJitter) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentColor, 1.0));
    } else {
        textureStore(outputTexture, pixelIndex, vec4<f32>(finalColor, 1.0));
    }
}
