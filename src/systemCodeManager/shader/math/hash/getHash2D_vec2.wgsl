// [KO] 2D 좌표를 정수로 변환하여 2D 난수 벡터를 생성합니다. (안정적 그리드 기반)
// [EN] Generates a 2D random vector by converting 2D coordinates to integers. (Stable Grid-based)
fn getHash2D_vec2(coord: vec2<f32>) -> vec2<f32> {
    var q = vec2<u32>(abs(coord));
    q = q * vec2<u32>(1597334677u, 3812015801u);
    let n = (q.x ^ q.y) * 1597334677u;
    q = vec2<u32>(n ^ (n >> 16u), n ^ (n << 16u));
    return vec2<f32>(q) / 4294967296.0;
}
