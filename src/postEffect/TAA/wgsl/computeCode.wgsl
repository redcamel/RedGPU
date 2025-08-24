{
    // ==== 1단계: 기본 설정 ====
    let pixelIndex = vec2<u32>(global_id.xy);
    let textureSizeF = vec2<f32>(textureDimensions(sourceTexture));
    let pixelCoord = vec2<f32>(pixelIndex) + vec2<f32>(0.5);

    if (any(pixelIndex >= vec2<u32>(textureSizeF))) {
        return;
    }

    let currentFrameColor = textureLoad(sourceTexture, pixelIndex).rgb;

    if (uniforms.frameIndex < 3.0) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentFrameColor, 1.0));
        return;
    }

    // ==== 4단계: 모션벡터 처리 ====
    let motionVectorRaw = textureLoad(motionVectorTexture, pixelIndex, 0).xy;

    // 모션벡터는 이미 UV 공간 차이값 (-1 ~ +1 범위)
    // 픽셀 단위로 변환
    let motionVectorPixels = motionVectorRaw * textureSizeF;

    // 모션벡터 강도 조절
    let scaledMotionVector = motionVectorPixels * uniforms.motionVectorIntensity;

    // 이전 프레임 위치 계산
    let previousPixelCoord = pixelCoord - scaledMotionVector;
    let clampedPrevCoord = clamp(previousPixelCoord, vec2<f32>(0.5), textureSizeF - vec2<f32>(0.5));

    // ==== 5단계: 바이리니어 샘플링 ====
    let baseCoord = floor(clampedPrevCoord - vec2<f32>(0.5));
    let fractionalPart = clampedPrevCoord - (baseCoord + vec2<f32>(0.5));

    let maxIndex = textureSizeF - vec2<f32>(1.0);
    let topLeft = vec2<u32>(clamp(baseCoord, vec2<f32>(0.0), maxIndex));
    let topRight = vec2<u32>(clamp(baseCoord + vec2<f32>(1.0, 0.0), vec2<f32>(0.0), maxIndex));
    let bottomLeft = vec2<u32>(clamp(baseCoord + vec2<f32>(0.0, 1.0), vec2<f32>(0.0), maxIndex));
    let bottomRight = vec2<u32>(clamp(baseCoord + vec2<f32>(1.0, 1.0), vec2<f32>(0.0), maxIndex));

    let colorTL = textureLoad(previousFrameTexture, topLeft).rgb;
    let colorTR = textureLoad(previousFrameTexture, topRight).rgb;
    let colorBL = textureLoad(previousFrameTexture, bottomLeft).rgb;
    let colorBR = textureLoad(previousFrameTexture, bottomRight).rgb;

    let topMix = mix(colorTL, colorTR, fractionalPart.x);
    let bottomMix = mix(colorBL, colorBR, fractionalPart.x);
    let previousFrameColor = mix(topMix, bottomMix, fractionalPart.y);

    // ==== 6단계: 히스토리 유효성 검증 ====
    let colorBrightness = dot(previousFrameColor, vec3<f32>(0.299, 0.587, 0.114));
    if (colorBrightness < 0.001 || colorBrightness > 50.0) {
        textureStore(outputTexture, pixelIndex, vec4<f32>(currentFrameColor, 1.0));
        return;
    }

    // ==== 7단계: 이웃 클램핑 ====
    var neighborMinColor = currentFrameColor;
    var neighborMaxColor = currentFrameColor;

    for (var dy = -1; dy <= 1; dy++) {
        for (var dx = -1; dx <= 1; dx++) {
            let neighborIdx = vec2<i32>(pixelIndex) + vec2<i32>(dx, dy);

            if (neighborIdx.x >= 0 && neighborIdx.y >= 0 &&
                neighborIdx.x < i32(textureSizeF.x) && neighborIdx.y < i32(textureSizeF.y)) {

                let neighborColor = textureLoad(sourceTexture, vec2<u32>(neighborIdx)).rgb;
                neighborMinColor = min(neighborMinColor, neighborColor);
                neighborMaxColor = max(neighborMaxColor, neighborColor);
            }
        }
    }

    let clampedPreviousColor = clamp(previousFrameColor, neighborMinColor, neighborMaxColor);

    // ==== 8단계: 모션 기반 블렌딩 ====
    let motionLength = length(scaledMotionVector);
    let motionBlendFactor = mix(
        uniforms.temporalBlendFactor,
        uniforms.temporalBlendFactor * uniforms.motionBlurReduction,
        saturate(motionLength / 10.0)
    );

    let finalBlendedColor = mix(clampedPreviousColor, currentFrameColor, motionBlendFactor);
    textureStore(outputTexture, pixelIndex, vec4<f32>(finalBlendedColor, 1.0));
}
