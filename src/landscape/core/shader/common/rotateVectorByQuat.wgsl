fn rotateVectorByQuat(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    let t = 2.0 * cross(q.xyz, v);
    return fma(vec3<f32>(q.w), t, v) + cross(q.xyz, t);
}
