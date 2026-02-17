#redgpu_include math.EPSILON
// [KO] 개선된 선형 깊이 복구 공식 (Stable Version)
// [EN] Improved linear depth reconstruction formula (Stable Version)
fn linearizeDepth(depthSample : f32, near : f32, far : f32) -> f32 {
    let d = clamp(depthSample, 0.0, 1.0);
    return (near * far) / max(EPSILON, far - d * (far - near));
}
