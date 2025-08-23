{
    // ==== 1단계: 올바른 픽셀 좌표 설정 (0.5 오프셋 적용) ====
    let pixelCoord = vec2<f32>(global_id.xy) + vec2<f32>(0.5); // 픽셀 중심
    let textureSizeF = vec2<f32>(textureDimensions(sourceTexture));
    let pixelIndex = vec2<u32>(global_id.xy); // 정수 인덱스는 그대로

    // 텍스처 경계 밖이면 종료 (0.5 기준)
    if (any(pixelCoord >= textureSizeF + vec2<f32>(0.5))) {
        return;
    }

    // ==== 2단계: 현재 프레임 색상 가져오기 ====
    let currentFrameColor = textureLoad(sourceTexture, pixelIndex).rgb;

    // ==== 3단계: 초기 프레임 처리 ====
    if (uniforms.frameIndex < 3.0) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentFrameColor, 1.0));
        return;
    }

    // ==== 4단계: 이전 프레임 위치 계산 (픽셀 중심 기준) ====
    let motionVector = textureLoad(motionVectorTexture, pixelIndex, 0).xy;

    // 이전 프레임 위치 계산 (픽셀 중심 기준)
    let previousPixelCoord = pixelCoord - motionVector * textureSizeF;
    let texBounds = textureSizeF - vec2<f32>(0.5); // 올바른 경계
    let clampedPrevCoord = clamp(previousPixelCoord, vec2<f32>(0.5), texBounds);

    // ==== 5단계: 이전 프레임 색상 바이리니어 샘플링 ====
    let baseCoord = floor(clampedPrevCoord - vec2<f32>(0.5)); // 정수 인덱스로 변환
    let fractionalPart = clampedPrevCoord - (baseCoord + vec2<f32>(0.5));

    // 4개 코너 좌표 계산
    let maxIndex = textureSizeF - vec2<f32>(1.0);
    let topLeftF = baseCoord;
    let topRightF = min(baseCoord + vec2<f32>(1.0, 0.0), maxIndex);
    let bottomLeftF = min(baseCoord + vec2<f32>(0.0, 1.0), maxIndex);
    let bottomRightF = min(baseCoord + vec2<f32>(1.0, 1.0), maxIndex);

    // u32로 변환
    let topLeft = vec2<u32>(topLeftF);
    let topRight = vec2<u32>(topRightF);
    let bottomLeft = vec2<u32>(bottomLeftF);
    let bottomRight = vec2<u32>(bottomRightF);

    // 바이리니어 보간
    let colorTL = textureLoad(previousFrameTexture, topLeft).rgb;
    let colorTR = textureLoad(previousFrameTexture, topRight).rgb;
    let colorBL = textureLoad(previousFrameTexture, bottomLeft).rgb;
    let colorBR = textureLoad(previousFrameTexture, bottomRight).rgb;

    let topMix = mix(colorTL, colorTR, fractionalPart.x);
    let bottomMix = mix(colorBL, colorBR, fractionalPart.x);
    let previousFrameColor = mix(topMix, bottomMix, fractionalPart.y);

    // ==== 6단계: 히스토리 유효성 검증 ====
    let colorBrightness = dot(previousFrameColor, vec3<f32>(1.0));
    if (colorBrightness < 0.001 || colorBrightness > 50.0) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentFrameColor, 1.0));
        return;
    }

    // ==== 7단계: 일관성 있는 이웃 클램핑 ====
    var neighborMinColor = currentFrameColor;
    var neighborMaxColor = currentFrameColor;

    // 이웃 오프셋 (픽셀 중심 기준)
    let neighborOffsetsF = array<vec2<f32>, 4>(
        vec2<f32>(0.0, -1.0),   // 위
        vec2<f32>(0.0,  1.0),   // 아래
        vec2<f32>(-1.0, 0.0),   // 왼쪽
        vec2<f32>(1.0,  0.0)    // 오른쪽
    );

    for (var i = 0; i < 4; i++) {
        let neighborCoordF = pixelCoord + neighborOffsetsF[i]; // 이미 0.5 오프셋 적용됨

        // 올바른 경계 검사 (픽셀 중심 기준)
        if (all(neighborCoordF >= vec2<f32>(0.5)) &&
            all(neighborCoordF < textureSizeF - vec2<f32>(0.5))) {

            // 정수 인덱스로 변환
            let neighborIdx = vec2<u32>(neighborCoordF - vec2<f32>(0.5));
            let neighborColor = textureLoad(sourceTexture, neighborIdx).rgb;
            neighborMinColor = min(neighborMinColor, neighborColor);
            neighborMaxColor = max(neighborMaxColor, neighborColor);
        }
    }

    // ==== 나머지 단계들 (변경 없음) ====
    let motionSpeed = length(motionVector);
    let pixelMotionSpeed = motionSpeed * length(textureSizeF);
    let colorVariance = length(neighborMaxColor - neighborMinColor);
    let isSubPixelGeometry = colorVariance > 0.15;
    let isHighMotionThinGeometry = pixelMotionSpeed > 2.0 && colorVariance > 0.1;

    var clampedPreviousColor: vec3<f32>;
    if (isSubPixelGeometry || isHighMotionThinGeometry) {
        let clampExpansion = vec3<f32>(0.1);
        let expandedMin = max(neighborMinColor - clampExpansion, vec3<f32>(0.0));
        let expandedMax = min(neighborMaxColor + clampExpansion, vec3<f32>(1.0));
        clampedPreviousColor = clamp(previousFrameColor, expandedMin, expandedMax);
    } else {
        clampedPreviousColor = clamp(previousFrameColor, neighborMinColor, neighborMaxColor);
    }

    var temporalBlendRatio = uniforms.temporalBlendFactor;

    let velocityClampingThreshold = 2.0;
    if (pixelMotionSpeed > velocityClampingThreshold) {
        temporalBlendRatio = max(temporalBlendRatio, 0.6);
    }

    if (isSubPixelGeometry) {
        temporalBlendRatio = max(temporalBlendRatio, 0.5);
    }

    if (motionSpeed > 0.01) {
        let motionInfluence = min(motionSpeed * 5.0, 1.0);
        temporalBlendRatio = mix(temporalBlendRatio, 0.5, motionInfluence * 0.3);
    }

    let reprojectionDistance = length(clampedPrevCoord - previousPixelCoord);
    if (reprojectionDistance > 1.0) {
        temporalBlendRatio = mix(temporalBlendRatio, 0.4, 0.3);
    }

    let historyCurrentDiff = length(clampedPreviousColor - currentFrameColor);
    if ((isSubPixelGeometry || isHighMotionThinGeometry) && historyCurrentDiff > 0.3) {
        temporalBlendRatio = max(temporalBlendRatio, 0.8);
    }

    let finalBlendedColor = mix(clampedPreviousColor, currentFrameColor, temporalBlendRatio);
    textureStore(outputTexture, pixelIndex, vec4<f32>(finalBlendedColor, 1.0));
}
