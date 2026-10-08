// ============================================================================
// RedGPU Landscape Orthonormal Basis Normal Perturbation Math
// - Gram-Schmidt orthonormal basis construction and tangent normal perturbation
// ============================================================================

fn perturbNormalOrthonormal(baseN: vec3<f32>, tangentN: vec3<f32>) -> vec3<f32> {
    if (length(tangentN.xy) <= 0.001) {
        return baseN;
    }
    let upVec = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(0.0, 0.0, 1.0), abs(baseN.y) > 0.999);
    let tangentX = normalize(cross(upVec, baseN));
    let tangentZ = cross(baseN, tangentX);
    return normalize(tangentX * tangentN.x + tangentZ * tangentN.y + baseN * tangentN.z);
}
