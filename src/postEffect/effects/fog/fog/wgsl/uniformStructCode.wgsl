struct Uniforms {
    fogType: u32,
    density: f32,
    nearDistance: f32,
    farDistance: f32,
    fogColor: vec3<f32>,
    padding1: f32,
};

fn linearizeDepth(depth: f32, cameraNear: f32, cameraFar: f32) -> f32 {
    let z = depth * 2.0 - 1.0;
    return (2.0 * cameraNear * cameraFar) /
           (cameraFar + cameraNear - z * (cameraFar - cameraNear));
}

fn calculateFogFactor(linearDepth: f32, cameraFar: f32) -> f32 {
    let u_density = uniforms.density;
    let u_fogType = uniforms.fogType;
    let u_nearDistance = uniforms.nearDistance;
    let u_farDistance = uniforms.farDistance;

    // 배경/스카이박스 감지 - 시스템 카메라 정보 사용
    let isBackground = linearDepth >= (cameraFar * 0.99);

    if (isBackground) {
        /* 배경은 약한 포그 적용 */
        return 1.0 - u_density;
    }

    /* 일반 객체 처리 - 표준 포그 공식 */
    let distance = max(0.0, linearDepth - u_nearDistance);
    let maxDistance = u_farDistance - u_nearDistance;

    /* 거리 정규화 (0~1 범위) */
    let normalizedDistance = clamp(distance / max(0.1, maxDistance), 0.0, 1.0);

    var fogFactor: f32;

    if (u_fogType == 0u) {
        /* 표준 Exponential Fog */
        fogFactor = exp(-u_density * normalizedDistance * 10.0);
    } else {
        /* 표준 Exponential Squared Fog */
        let expValue = u_density * normalizedDistance * 5.0;
        fogFactor = exp(-(expValue * expValue));
    }

    return clamp(fogFactor, 0.0, 1.0);
}
