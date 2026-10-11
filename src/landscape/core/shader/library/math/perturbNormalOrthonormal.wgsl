fn perturbNormalOrthonormal(baseN: vec3<f32>, tangentN: vec3<f32>) -> vec3<f32> {
    // 🚀 [SFU 최적화]: length()의 sqrt 대신 내적 제곱 거리(dot)로 비교하여 SFU sqrt 제거
    if (dot(tangentN.xy, tangentN.xy) <= 1e-6) {
        return baseN;
    }
    let upVec = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(0.0, 0.0, 1.0), abs(baseN.y) > 0.999);
    let tangentX = normalize(cross(upVec, baseN));
    let tangentZ = cross(baseN, tangentX);
    return tangentX * tangentN.x + tangentZ * tangentN.y + baseN * tangentN.z;
}
