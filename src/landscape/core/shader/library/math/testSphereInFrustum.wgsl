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
