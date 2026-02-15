// [KO] 4D 입력(예: 위치 + 시간)을 기반으로 1D 난수(0.0 ~ 1.0)를 생성합니다. (비트 연산 기반)
// [EN] Generates a 1D random number (0.0 ~ 1.0) based on 4D input (e.g., position + time). (Bitwise)
fn getHash1D_vec4(v: vec4<f32>) -> f32 {
    var q = bitcast<vec4<u32>>(v);
    var x = q.x ^ q.y ^ q.z ^ q.w;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
