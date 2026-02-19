#redgpu_include math.EPSILON

/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] 비선형 깊이(Depth) 값을 선형 거리로 복구합니다. (Stable Version)
 * [EN] Recovers non-linear depth values into linear distances. (Stable Version)
 *
 * @param depthSample - [KO] 텍스처에서 샘플링된 0~1 사이의 깊이값 [EN] Depth value sampled from texture (0~1)
 * @param near - [KO] 카메라의 Near 평면 거리 [EN] Camera near plane distance
 * @param far - [KO] 카메라의 Far 평면 거리 [EN] Camera far plane distance
 * @returns [KO] 선형화된 거리 값 [EN] Linearized distance value
 */
fn getLinearizeDepth(depthSample : f32, near : f32, far : f32) -> f32 {
    let d = clamp(depthSample, 0.0, 1.0);
    return (near * far) / max(EPSILON, far - d * (far - near));
}
