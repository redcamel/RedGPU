// [KO] 3D 벡터를 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)
// [EN] Generates a 1D random number (0.0 ~ 1.0) by converting a 3D vector to integers. (Stable Grid-based)
fn getHash1D_vec3(v: vec3<f32>) -> f32 {
    let q = vec3<u32>(abs(v));
    var x = q.x ^ q.y ^ q.z;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
