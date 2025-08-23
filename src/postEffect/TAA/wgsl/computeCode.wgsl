let index = vec2<u32>(global_id.xy);
let dims = vec2<u32>(textureDimensions(sourceTexture));

// 경계 검사
if (any(index >= dims)) {
    return;
}

// 현재 프레임 색상
let currentColor = textureLoad(sourceTexture, index).rgb;

var finalColor = currentColor;

// 첫 몇 프레임은 히스토리 없이 현재 프레임만 출력
if (uniforms.frameIndex < 3) {
    finalColor = currentColor;
} else {
    // 모션 벡터를 이용한 히스토리 리프로젝션
    let motionVector = textureLoad(motionVectorTexture, index, 0).xy;
    let prevScreenPos = vec2<f32>(index) - motionVector * vec2<f32>(dims);

    // 경계 검사
    if (prevScreenPos.x >= 0.0 && prevScreenPos.x < f32(dims.x) &&
        prevScreenPos.y >= 0.0 && prevScreenPos.y < f32(dims.y)) {

        // 단순한 nearest neighbor 샘플링
        let prevIndex = vec2<i32>(prevScreenPos + 0.5);
        let clampedPrevIndex = clamp(prevIndex, vec2<i32>(0, 0), vec2<i32>(dims) - vec2<i32>(1, 1));

        var historyColor = textureLoad(previousFrameTexture, clampedPrevIndex).rgb;

        // 히스토리 유효성 검사
        let historySum = dot(historyColor, vec3<f32>(1.0));
        if (historySum > 0.001 && historySum < 50.0) {
            // 네이버후드 클램핑을 위한 min/max 계산
            var minColor = currentColor;
            var maxColor = currentColor;

            // Halton sequence 기반 네이버후드 샘플링
            let sampleCount = 9u;
            for (var i = 0u; i < sampleCount; i++) {
                // Halton sequence를 사용하여 3x3 영역을 더 균등하게 샘플링
                let haltonX = haltonSequence(i + 1u, 2u);
                let haltonY = haltonSequence(i + 1u, 3u);

                // [-1, 1] 범위로 변환하여 3x3 영역 내에서 샘플링
                let offsetX = i32((haltonX - 0.5) * 3.0);
                let offsetY = i32((haltonY - 0.5) * 3.0);

                let nx = clamp(i32(index.x) + offsetX, 0, i32(dims.x) - 1);
                let ny = clamp(i32(index.y) + offsetY, 0, i32(dims.y) - 1);
                let neighbor = textureLoad(sourceTexture, vec2<u32>(u32(nx), u32(ny))).rgb;
                minColor = min(minColor, neighbor);
                maxColor = max(maxColor, neighbor);
            }

            // 히스토리 색상을 네이버후드 범위로 클램핑 (고스팅 방지)
            historyColor = clamp(historyColor, minColor, maxColor);

            // 디스오클루전 감지
            let colorDiff = length(currentColor - historyColor);
            let isDisoccluded = colorDiff > uniforms.disocclusionThreshold;

            // 모션 강도에 따른 적응적 블렌딩
            let motionMagnitude = length(motionVector);
            var adaptiveBlendFactor = uniforms.temporalBlendFactor;

            if (isDisoccluded) {
                // 디스오클루전된 영역은 현재 프레임 위주로 사용
                adaptiveBlendFactor = mix(uniforms.temporalBlendFactor, 0.8, 0.5);
            } else {
                // 정상 영역은 모션에 따른 적응적 블렌딩
                adaptiveBlendFactor = mix(uniforms.temporalBlendFactor, 0.5,
                                        clamp(motionMagnitude * uniforms.motionVectorIntensity, 0.0, 1.0));
            }

            // 템포럴 블렌딩
            finalColor = mix(historyColor, currentColor, adaptiveBlendFactor);
        } else {
            finalColor = currentColor;
        }
    } else {
        // 히스토리 위치가 화면 밖이면 현재 색상만 사용
        finalColor = currentColor;
    }
}


// 결과 저장
textureStore(outputTexture, index, vec4<f32>(finalColor, 1.0));
