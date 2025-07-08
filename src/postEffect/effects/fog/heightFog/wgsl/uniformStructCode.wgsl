struct Uniforms {
    fogType: u32,
    density: f32,
    baseHeight: f32,
    falloff: f32,
    maxHeight: f32,
    fogColor: vec3<f32>,
    padding1: f32,
    padding2: f32,
};

// 🔧 고정밀 월드 포지션 재구성 (수치적 안정성 극대화)
fn reconstructWorldPosition(screenCoord: vec2<f32>, depth: f32) -> vec3<f32> {
    // ✅ 더블 정밀도 모방 - NDC 계산을 두 단계로 분리
    let screenX = screenCoord.x;
    let screenY = screenCoord.y;

    // 정확한 NDC 변환 (중간 계산 최소화)
    let ndcX = fma(screenX, 2.0, -1.0);  // screenX * 2.0 - 1.0 (더 정확)
    let ndcY = -fma(screenY, 2.0, -1.0); // -(screenY * 2.0 - 1.0)
    let ndc = vec3<f32>(ndcX, ndcY, depth);

    let clipPos = vec4<f32>(ndc, 1.0);
    let worldPos4 = systemUniforms.inverseProjectionCameraMatrix * clipPos;

    // ✅ 더 엄격한 W 검증 (수치적 안정성)
    let w = max(abs(worldPos4.w), 0.001);  // 0.0001 → 0.001로 증가
    let worldPos = worldPos4.xyz / w;

    // ✅ 월드 좌표 범위 제한 (극값 방지)
    return clamp(worldPos, vec3<f32>(-10000.0), vec3<f32>(10000.0));
}

fn calculateHeightFogFactor(screenCoord: vec2<f32>, depth: f32) -> f32 {
    let u_baseHeight = uniforms.baseHeight;
    let u_maxHeight = uniforms.maxHeight;

    // ✅ 더 엄격한 배경 판별 (정밀도 향상)
    let isBackground = depth >= 0.999995;  // 0.9999 → 0.999995
    var pixelWorldHeight: f32;

    if (isBackground) {
        let rayDirection = getRayDirection(screenCoord);
        pixelWorldHeight = getSkyboxEffectiveHeight(rayDirection);
    } else {
        let worldPos = reconstructWorldPosition(screenCoord, depth);
        pixelWorldHeight = worldPos.y;
    }

    return calculateAbsoluteHeightFog(pixelWorldHeight);
}

// 🔧 수치적으로 안정한 스카이박스 높이 계산
fn getSkyboxEffectiveHeight(rayDirection: vec3<f32>) -> f32 {
    let u_baseHeight = uniforms.baseHeight;
    let u_maxHeight = uniforms.maxHeight;

    // ✅ 더 정밀한 임계값 (부동소수점 안정성)
    let upThreshold = 0.2500001;     // 0.25 → 미세하게 증가
    let downThreshold = -0.0799999;  // -0.08 → 미세하게 감소
    let transitionRange = upThreshold - downThreshold;

    let rayY = rayDirection.y;

    if (rayY > upThreshold) {
        return u_maxHeight + 8.0;
    } else if (rayY < downThreshold) {
        return u_baseHeight + (u_maxHeight - u_baseHeight) * 0.15;
    } else {
        // ✅ 더 안정적인 보간 (fma 사용)
        let t = (rayY - downThreshold) / transitionRange;
        let smoothT = smoothstep(0.0, 1.0, clamp(t, 0.0, 1.0));

        let lowValue = u_baseHeight + (u_maxHeight - u_baseHeight) * 0.15;
        let highValue = u_maxHeight + 8.0;

        return mix(lowValue, highValue, smoothT);
    }
}

// 🌫️ 고정밀 Height Fog 계산 (수치적 안정성 극대화)
fn calculateAbsoluteHeightFog(worldHeight: f32) -> f32 {
    let u_baseHeight = uniforms.baseHeight;
    let u_maxHeight = uniforms.maxHeight;
    let u_density = uniforms.density;
    let u_falloff = uniforms.falloff;
    let u_fogType = uniforms.fogType;

    // ✅ 더 큰 마진으로 떨림 완전 방지
    let heightRange = u_maxHeight - u_baseHeight;
    let margin = max(heightRange * 0.08, 0.1);  // 2% → 8% + 최소값 보장

    let extendedBaseHeight = u_baseHeight - margin;
    let extendedMaxHeight = u_maxHeight + margin;
    let extendedRange = extendedMaxHeight - extendedBaseHeight;

    // ✅ 경계 조건 강화
    if (worldHeight <= extendedBaseHeight) {
        return 1.0; // 완전 투명
    }
    if (worldHeight >= extendedMaxHeight) {
        return 1.0; // 완전 투명
    }

    // ✅ 더 안전한 범위 검증
    if (extendedRange <= 0.01) {  // 0.001 → 0.01
        return 1.0;
    }

    // ✅ 고정밀 정규화
    let normalizedHeight = clamp((worldHeight - extendedBaseHeight) / extendedRange, 0.0, 1.0);

    // ✅ 더 부드러운 경계 페이딩 (넓은 전환 구간)
    let edgeFadeIn = smoothstep(0.0, 0.12, normalizedHeight);   // 5% → 12%
    let edgeFadeOut = smoothstep(0.88, 1.0, normalizedHeight);  // 95% → 88%
    let edgeFactor = edgeFadeIn * (1.0 - edgeFadeOut);

    // ✅ 수치적으로 안정한 안개 밀도 계산
    var fogDensity: f32;
    if (u_fogType == 0u) {
        // 🌫️ EXPONENTIAL: 수치적 안정성 최대화
        let heightFactor = 1.0 - normalizedHeight;

        let safeFalloff = clamp(u_falloff, 0.02, 1.95);  // 범위 축소로 안정성 향상
        let expPower = mix(1.0, 3.0, safeFalloff / 1.95); // 0.8~3.5 → 1.0~3.0

        fogDensity = pow(max(heightFactor, 0.005), expPower);  // 0.001 → 0.005

        // 추가 안정화
        fogDensity = smoothstep(0.0, 1.0, fogDensity);

    } else {
        // 📏 LINEAR: 더 안정적인 선형 계산
        let heightFactor = 1.0 - normalizedHeight;
        let safeFalloff = clamp(u_falloff, 0.02, 1.95);

        fogDensity = pow(max(heightFactor, 0.005), 1.0 / safeFalloff);
        fogDensity = smoothstep(0.0, 1.0, fogDensity);
    }

    // ✅ 경계 페이딩 적용
    fogDensity *= edgeFactor;

    // ✅ 최종 안개 강도 (더 보수적인 블렌딩)
    let safeDensity = clamp(u_density, 0.0, 6.0);  // 8.0 → 6.0
    let finalFogAmount = fogDensity * safeDensity * 0.5;  // 0.65 → 0.5

    return clamp(1.0 - finalFogAmount, 0.0, 1.0);
}

// 🔧 고정밀 레이 방향 계산
fn getRayDirection(screenCoord: vec2<f32>) -> vec3<f32> {
    // ✅ 더 정확한 중심점 계산
    let centeredCoord = vec2<f32>(
        fma(screenCoord.x, 1.0, -0.5),  // screenCoord.x - 0.5 (더 정확)
        fma(screenCoord.y, 1.0, -0.5)   // screenCoord.y - 0.5
    );

    let ndc = vec3<f32>(
        centeredCoord.x * 2.0,
        -(centeredCoord.y * 2.0),
        1.0
    );

    let clipPos = vec4<f32>(ndc, 1.0);
    let worldPos4 = systemUniforms.inverseProjectionCameraMatrix * clipPos;

    // ✅ 더 엄격한 안전 변환
    let w = max(abs(worldPos4.w), 0.001);  // 0.0001 → 0.001
    let worldPos = worldPos4.xyz / w;

    let cameraPos = systemUniforms.camera.cameraPosition;
    let rayDir = worldPos - cameraPos;

    // ✅ 더 엄격한 길이 검증
    let rayLength = length(rayDir);
    if (rayLength < 0.001) {  // 0.0001 → 0.001
        return vec3<f32>(0.0, 0.0, 1.0);
    }

    return rayDir / rayLength;
}
