// [KO] 3D 입력 벡터를 기반으로 3D 해시 벡터를 생성합니다.
// [EN] Generates a 3D hash vector based on a 3D input vector.
fn hash33(p: vec3<f32>) -> vec3<f32> {
    var p3 = fract(p * vec3<f32>(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
}
