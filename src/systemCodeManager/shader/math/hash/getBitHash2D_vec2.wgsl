// [KO] 2D 벡터의 비트 구조를 보존하여 2D 난수 벡터를 생성합니다. (초정밀)
// [EN] Generates a 2D random vector by preserving the bit structure of a 2D vector. (Ultra-precise)
fn getBitHash2D_vec2(coord: vec2<f32>) -> vec2<f32> {
    var q = bitcast<vec2<u32>>(coord);
    q = q * vec2<u32>(1597334677u, 3812015801u);
    let n = (q.x ^ q.y) * 1597334677u;
    q = vec2<u32>(n ^ (n >> 16u), n ^ (n << 16u));
    return vec2<f32>(q) / 4294967296.0;
}
