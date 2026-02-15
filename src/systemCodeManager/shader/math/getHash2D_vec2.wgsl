// [KO] 2D 좌표를 기반으로 2D 난수 벡터를 생성합니다. (비트 연산 및 정수 변환 기반)
// [EN] Generates a 2D random vector based on 2D coordinates. (Bitwise and Integer conversion)
fn getHash2D_vec2(coord: vec2<f32>) -> vec2<f32> {
    var q = vec2<u32>(abs(coord));
    q = q * vec2<u32>(1597334677u, 3812015801u);
    let n = (q.x ^ q.y) * 1597334677u;
    q = vec2<u32>(n ^ (n >> 16u), n ^ (n << 16u));
    return vec2<f32>(q) / 4294967296.0;
}
