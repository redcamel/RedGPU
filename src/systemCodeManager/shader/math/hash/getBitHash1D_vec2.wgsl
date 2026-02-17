// [KO] 2D 벡터의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)
// [EN] Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a 2D vector. (Ultra-precise)
fn getBitHash1D_vec2(coord: vec2<f32>) -> f32 {
    let q = bitcast<vec2<u32>>(coord);
    var x = q.x ^ q.y;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
