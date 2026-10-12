fn testSphereInFrustum(center: vec3<f32>, radius: f32, frustumPlanes: array<vec4<f32>, 6>) -> bool {
    let p = vec4<f32>(center, 1.0);
    let negRadius = -radius;
    return dot(p, frustumPlanes[0]) >= negRadius &&
           dot(p, frustumPlanes[1]) >= negRadius &&
           dot(p, frustumPlanes[2]) >= negRadius &&
           dot(p, frustumPlanes[3]) >= negRadius &&
           dot(p, frustumPlanes[4]) >= negRadius &&
           dot(p, frustumPlanes[5]) >= negRadius;
}
