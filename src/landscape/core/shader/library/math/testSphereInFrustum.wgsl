// ============================================================================
// RedGPU Landscape Scatter Frustum Culling Math Module
// - 6-plane Frustum vs 3D Bounding Sphere Intersection Test
// ============================================================================

/**
 * [KO] 3D 바운딩 구체(중심점, 반경)와 6개 평면 절두체(Frustum) 간의 교차 여부를 판정합니다.
 * [EN] Tests intersection between a 3D bounding sphere (center, radius) and a 6-plane view/shadow frustum.
 *
 * @param sphereCenter - 구체 중심점 월드 좌표 (World space sphere center)
 * @param boundRadius  - 구체 바운딩 반경 (Bounding sphere radius)
 * @param planes       - 6개 절두체 평면 방정식 배열 [nx, ny, nz, d] (Array of 6 frustum planes)
 * @returns true일 경우 절두체 내부에 있거나 교차, false일 경우 완전히 벗어남 (True if inside or intersecting, false if fully culled)
 */
fn testSphereInFrustum(sphereCenter: vec3<f32>, boundRadius: f32, planes: array<vec4<f32>, 6>) -> bool {
    let p = vec4<f32>(sphereCenter, 1.0);
    let negRadius = -boundRadius;
    return dot(p, planes[0]) >= negRadius &&
           dot(p, planes[1]) >= negRadius &&
           dot(p, planes[2]) >= negRadius &&
           dot(p, planes[3]) >= negRadius &&
           dot(p, planes[4]) >= negRadius &&
           dot(p, planes[5]) >= negRadius;
}
