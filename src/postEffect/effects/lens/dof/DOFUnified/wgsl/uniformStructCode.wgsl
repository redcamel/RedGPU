#redgpu_include math.PI2
struct Uniforms {
    nearBlurSize: f32,
    farBlurSize: f32,
    nearStrength: f32,
    farStrength: f32,
};

/* [KO] CoC 디코딩 함수 (0~1 범위를 -1~1 범위로 복원) */
fn decodeCoC(encoded: f32) -> f32 {
    return encoded * 2.0 - 1.0;
}

/**
 * [KO] 고품질 DOF 블러를 계산합니다. (하드웨어 선형 샘플링 및 DPR 반영)
 */
fn calculateBlur(centerUV: vec2<f32>, intensity: f32, maxBlurSize: f32, isNear: bool) -> vec4<f32> {
    // [KO] DPR을 반영하여 물리적 해상도에 맞는 블러 반경 계산
    // [EN] Calculate blur radius matching physical resolution by reflecting DPR
    let blurRadius = intensity * maxBlurSize * systemUniforms.devicePixelRatio;
    let dimensions = vec2<f32>(textureDimensions(sourceTexture));
    let invSize = 1.0 / vec2<f32>(dimensions);

    /* 최소 블러 반경 미만 시 원본 반환 */
    if (blurRadius < 0.3) {
        return textureSampleLevel(sourceTexture, basicSampler, centerUV, 0.0);
    }

    var sum: vec3<f32> = vec3<f32>(0.0);
    var sumAlpha: f32 = 0.0;
    var totalWeight = 0.0;

    let maxRadius = min(blurRadius, maxBlurSize * systemUniforms.devicePixelRatio);
    let samples = select(8, 16, isNear); /* near=16, far=8 */
    let angleStep = PI2 / f32(samples);

    let originalColor = textureSampleLevel(sourceTexture, basicSampler, centerUV, 0.0);
    let centerWeight = select(0.4, 0.2, isNear); 
    
    sum += originalColor.rgb * centerWeight;
    sumAlpha += originalColor.a * centerWeight;
    totalWeight += centerWeight;

    /* 방사형 샘플링 루프 (하드웨어 보간 활용) */
    for (var i = 0; i < samples; i = i + 1) {
        for (var r = 1.0; r <= maxRadius; r = r + 1.5) { // 1.5 간격으로 샘플링 효율화
            let angle = f32(i) * angleStep;
            let offsetUV = vec2<f32>(cos(angle), sin(angle)) * r * invSize;
            let sampleUV = centerUV + offsetUV;

            let sampleData = textureSampleLevel(sourceTexture, basicSampler, sampleUV, 0.0);
            let sampleEncodedCoC = textureSampleLevel(cocTexture, basicSampler, sampleUV, 0.0).a;
            let sampleCoC = decodeCoC(sampleEncodedCoC);

            /* 가우시안 가중치 근사 */
            var weight = exp(-r * r / (maxRadius * maxRadius * 0.5));

            /* CoC 기반 가중치 보정 (보케 형태 선명화) */
            if (isNear) {
                if (sampleCoC < 0.0 && abs(sampleCoC) >= intensity * 0.5) { weight *= 1.5; }
            } else {
                if (sampleCoC > 0.0 && sampleCoC >= intensity * 0.7) { weight *= 1.2; }
            }

            sum += sampleData.rgb * weight;
            sumAlpha += sampleData.a * weight;
            totalWeight += weight;
        }
    }

    return vec4<f32>(sum / totalWeight, sumAlpha / totalWeight);
}
