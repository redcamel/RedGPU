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

// 🔧 고정밀 월드 포지션 재구성 (상하회전 안정화)
fn reconstructWorldPosition(screenCoord: vec2<f32>, depth: f32) -> vec3<f32> {
    // ✅ 더 정확한 NDC 계산 (상하회전 안정성 강화)
    let screenX = screenCoord.x;
    let screenY = screenCoord.y;

    // 🎯 NDC 변환 시 Y축 처리 개선
    let ndcX = fma(screenX, 2.0, -1.0);
    let ndcY = -fma(screenY, 2.0, -1.0);

    // ✅ 극각 근처에서도 안정적인 depth 처리
    let safeDepth = clamp(depth, 0.000001, 0.999999);
    let ndc = vec3<f32>(ndcX, ndcY, safeDepth);

    let clipPos = vec4<f32>(ndc, 1.0);
    let worldPos4 = systemUniforms.inverseProjectionCameraMatrix * clipPos;

    // ✅ W 성분 안정화 (상하회전 시 극값 방지)
    let w = max(abs(worldPos4.w), 0.01);  // 0.001 → 0.01로 대폭 증가
    let worldPos = worldPos4.xyz / w;

    // ✅ Y축 좌표 안정화 (극각 문제 해결)
    let clampedY = clamp(worldPos.y, -50000.0, 50000.0);
    return vec3<f32>(worldPos.x, clampedY, worldPos.z);
}

fn calculateHeightFogFactor(screenCoord: vec2<f32>, depth: f32) -> f32 {
    let u_baseHeight = uniforms.baseHeight;
    let u_maxHeight = uniforms.maxHeight;

    // ✅ 배경 판별 더 보수적으로 (상하회전 안정성)
    let isBackground = depth >= 0.9999;  // 0.999995 → 0.9999
    var pixelWorldHeight: f32;

    if (isBackground) {
        let rayDirection = getRayDirectionStable(screenCoord);
        pixelWorldHeight = getSkyboxEffectiveHeightStable(rayDirection);
    } else {
        let worldPos = reconstructWorldPosition(screenCoord, depth);
        pixelWorldHeight = worldPos.y;
    }

    return calculateAbsoluteHeightFog(pixelWorldHeight);
}

// 🎯 상하회전 안정화된 스카이박스 높이 계산
fn getSkyboxEffectiveHeightStable(rayDirection: vec3<f32>) -> f32 {
    let u_baseHeight = uniforms.baseHeight;
    let u_maxHeight = uniforms.maxHeight;

    // ✅ 극각 안정화 - 더 보수적인 임계값
    let rayY = clamp(rayDirection.y, -0.95, 0.95);  // 극각 제한

    // 🎯 상하회전 안정화된 임계값 설정
    let upThreshold = 0.15;      // 0.2500001 → 0.15 (더 보수적)
    let downThreshold = -0.05;   // -0.0799999 → -0.05
    let transitionRange = upThreshold - downThreshold;

    // ✅ 안정적인 구간별 처리
    if (rayY > upThreshold) {
        // 🌤️ 위쪽 하늘 - 안개 없음
        return u_maxHeight + 12.0;  // 8.0 → 12.0 (더 여유있게)
    } else if (rayY < downThreshold) {
        // 🌫️ 아래쪽 - 안개 많음
        return u_baseHeight + (u_maxHeight - u_baseHeight) * 0.1;  // 0.15 → 0.1
    } else {
        // 🌅 중간 전환 구간 - 매우 부드러운 보간
        let normalizedT = (rayY - downThreshold) / transitionRange;

        // ✅ 삼중 smoothstep으로 극도로 부드러운 전환
        let smoothT1 = smoothstep(0.0, 1.0, normalizedT);
        let smoothT2 = smoothstep(0.0, 1.0, smoothT1);
        let smoothT3 = smoothstep(0.0, 1.0, smoothT2);

        let lowValue = u_baseHeight + (u_maxHeight - u_baseHeight) * 0.1;
        let highValue = u_maxHeight + 12.0;

        return mix(lowValue, highValue, smoothT3);
    }
}

// 🌫️ 안정화된 Height Fog 계산
fn calculateAbsoluteHeightFog(worldHeight: f32) -> f32 {
    let u_baseHeight = uniforms.baseHeight;
    let u_maxHeight = uniforms.maxHeight;
    let u_density = uniforms.density;
    let u_falloff = uniforms.falloff;
    let u_fogType = uniforms.fogType;

    // ✅ 더 안정적인 높이 범위 처리
    let heightRange = u_maxHeight - u_baseHeight;
    let margin = max(heightRange * 0.1, 0.5);  // 8% → 10%, 최소값 0.1 → 0.5

    let extendedBaseHeight = u_baseHeight - margin;
    let extendedMaxHeight = u_maxHeight + margin;
    let extendedRange = extendedMaxHeight - extendedBaseHeight;

    // ✅ 안전한 범위 검증
    if (worldHeight <= extendedBaseHeight || worldHeight >= extendedMaxHeight) {
        return 1.0;
    }

    if (extendedRange <= 0.1) {  // 0.01 → 0.1
        return 1.0;
    }

    // ✅ 매우 안정적인 정규화
    let normalizedHeight = clamp((worldHeight - extendedBaseHeight) / extendedRange, 0.0, 1.0);

    // ✅ 극도로 부드러운 경계 페이딩
    let edgeFadeIn = smoothstep(0.0, 0.2, normalizedHeight);    // 12% → 20%
    let edgeFadeOut = smoothstep(0.8, 1.0, normalizedHeight);   // 88% → 80%
    let edgeFactor = edgeFadeIn * (1.0 - edgeFadeOut);

    // ✅ 안정화된 안개 밀도 계산
    var fogDensity: f32;
    let heightFactor = 1.0 - normalizedHeight;

    if (u_fogType == 0u) {
        // 🌫️ EXPONENTIAL: 극도로 안정화
        let safeFalloff = clamp(u_falloff, 0.1, 1.5);  // 0.02~1.95 → 0.1~1.5
        let expPower = mix(1.2, 2.5, safeFalloff / 1.5);  // 범위 축소

        fogDensity = pow(max(heightFactor, 0.01), expPower);  // 0.005 → 0.01
        fogDensity = smoothstep(0.0, 1.0, fogDensity);
    } else {
        // 📏 LINEAR: 매우 안정적
        let safeFalloff = clamp(u_falloff, 0.1, 1.5);
        fogDensity = pow(max(heightFactor, 0.01), 1.0 / safeFalloff);
        fogDensity = smoothstep(0.0, 1.0, fogDensity);
    }

    // ✅ 부드러운 경계 적용
    fogDensity *= edgeFactor;

    // ✅ 매우 보수적인 최종 블렌딩
    let safeDensity = clamp(u_density, 0.0, 4.0);  // 6.0 → 4.0
    let finalFogAmount = fogDensity * safeDensity * 0.4;  // 0.5 → 0.4

    return clamp(1.0 - finalFogAmount, 0.0, 1.0);
}

// 🎯 상하회전 안정화된 레이 방향 계산
fn getRayDirectionStable(screenCoord: vec2<f32>) -> vec3<f32> {
    // ✅ 정확한 좌표 중심화
    let centeredCoord = vec2<f32>(
        screenCoord.x - 0.5,
        screenCoord.y - 0.5
    );

    // ✅ 안정적인 NDC 변환
    let ndc = vec3<f32>(
        centeredCoord.x * 2.0,
        -(centeredCoord.y * 2.0),
        1.0
    );

    let clipPos = vec4<f32>(ndc, 1.0);
    let worldPos4 = systemUniforms.inverseProjectionCameraMatrix * clipPos;

    // ✅ 매우 안전한 W 성분 처리
    let w = max(abs(worldPos4.w), 0.01);  // 0.001 → 0.01
    let worldPos = worldPos4.xyz / w;

    let cameraPos = systemUniforms.camera.cameraPosition;
    let rayDir = worldPos - cameraPos;

    // ✅ 안전한 정규화
    let rayLength = length(rayDir);
    if (rayLength < 0.01) {  // 0.001 → 0.01
        return vec3<f32>(0.0, 0.0, 1.0);
    }

    let normalizedRay = rayDir / rayLength;

    // ✅ Y축 극값 제한 (상하회전 안정성 핵심)
    let clampedY = clamp(normalizedRay.y, -0.95, 0.95);

    // ✅ 정규화 유지하면서 Y축 제한
    let adjustedRay = vec3<f32>(normalizedRay.x, clampedY, normalizedRay.z);
    let adjustedLength = length(adjustedRay);

    if (adjustedLength > 0.01) {
        return adjustedRay / adjustedLength;
    }

    return vec3<f32>(0.0, 0.0, 1.0);
}
