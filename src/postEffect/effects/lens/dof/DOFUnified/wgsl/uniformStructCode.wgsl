#redgpu_include math.PI2
struct Uniforms {
    nearBlurSize: f32,
    farBlurSize: f32,
    nearStrength: f32,
    farStrength: f32,
};

/* CoC 디코딩 함수 */
fn decodeCoC(encoded: f32) -> f32 {
    /* 0~1 범위를 -1~1 범위로 복원 */
    return encoded * 2.0 - 1.0;
}

fn calculateBlur(center: vec2<u32>, intensity: f32, maxBlurSize: f32, isNear: bool) -> vec4<f32> {
    let dimensions: vec2<u32> = textureDimensions(sourceTexture);
    let blurRadius = intensity * maxBlurSize;

    /* 최소 블러 반경 조정 */
    if (blurRadius < 0.3) {
        return textureLoad(sourceTexture, center, 0);
    }

    var sum: vec3<f32> = vec3<f32>(0.0);
    var sumAlpha: f32 = 0.0;
    var totalWeight = 0.0;

    let maxRadius = min(blurRadius, maxBlurSize);
    /* Near blur에 더 많은 샘플 적용 */
    let samples = select(8, 16, isNear); /* near=16, far=8 */
    let angleStep = PI2 / f32(samples);

    let originalSample = textureLoad(sourceTexture, center, 0);
    let originalColor = originalSample.rgb;
    let originalAlpha = originalSample.a;
    /* Near blur에 더 강한 중앙 가중치 */
    let centerWeight = select(0.4, 0.2, isNear); /* near=0.2, far=0.4 */
    sum += originalColor * centerWeight;
    sumAlpha += originalAlpha * centerWeight;
    totalWeight += centerWeight;

    /* 방사형 샘플링 */
    for (var i = 0; i < samples; i = i + 1) {
        for (var r = 1.0; r <= maxRadius; r = r + 1.0) {
            let angle = f32(i) * angleStep;
            let offset = vec2<f32>(cos(angle) * r, sin(angle) * r);

            let samplePos = vec2<i32>(
                clamp(i32(f32(center.x) + offset.x), 0, i32(dimensions.x) - 1),
                clamp(i32(f32(center.y) + offset.y), 0, i32(dimensions.y) - 1)
            );

            let sampleData = textureLoad(sourceTexture, vec2<u32>(samplePos), 0);
            let sampleColor = sampleData.rgb;
            let sampleAlpha = sampleData.a;
            let sampleEncodedCoC = textureLoad(cocTexture, vec2<u32>(samplePos)).a;
            let sampleCoC = decodeCoC(sampleEncodedCoC); /* 디코딩 추가 */

            /* 가우시안 가중치 */
            var weight = exp(-r * r / (maxRadius * maxRadius * 0.5));

            /* CoC 기반 가중치 조정 */
            if (isNear) {
                /* Near blur: 더 강한 조건으로 가중치 증가 */
                if (sampleCoC < 0.0 && abs(sampleCoC) >= intensity * 0.5) {
                    weight *= 1.5;
                }
            } else {
                /* Far blur: 기존 조건 유지 */
                if (sampleCoC > 0.0 && sampleCoC >= intensity * 0.7) {
                    weight *= 1.2;
                }
            }

            sum += sampleColor * weight;
            sumAlpha += sampleAlpha * weight;
            totalWeight += weight;
        }
    }

    /* 추가 근거리 샘플링 (near blur만) */
    if (isNear && maxRadius > 2.0) {
        let additionalSamples = 8;
        let innerRadius = maxRadius * 0.3;
        let innerAngleStep = PI2 / f32(additionalSamples);

        for (var i = 0; i < additionalSamples; i = i + 1) {
            let angle = f32(i) * innerAngleStep + 0.5; /* 약간의 오프셋 */
            let offset = vec2<f32>(cos(angle) * innerRadius, sin(angle) * innerRadius);

            let samplePos = vec2<i32>(
                clamp(i32(f32(center.x) + offset.x), 0, i32(dimensions.x) - 1),
                clamp(i32(f32(center.y) + offset.y), 0, i32(dimensions.y) - 1)
            );

            let sampleData = textureLoad(sourceTexture, vec2<u32>(samplePos), 0);
            let sampleColor = sampleData.rgb;
            let sampleAlpha = sampleData.a;
            let weight = 0.8;

            sum += sampleColor * weight;
            sumAlpha += sampleAlpha * weight;
            totalWeight += weight;
        }
    }

    if (totalWeight > 0.0) {
        return vec4<f32>(sum / totalWeight, sumAlpha / totalWeight);
    } else {
        return vec4<f32>(originalColor, originalAlpha);
    }
}
