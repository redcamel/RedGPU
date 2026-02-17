// [KO] 4D 벡터의 비트 구조를 보존하여 1D 난수를 생성합니다. (초정밀)
// [EN] Generates a 1D random number by preserving the bit structure of a 4D vector. (Ultra-precise)
fn getBitHash1D_vec4(v: vec4<f32>) -> f32 {
    var q = bitcast<vec4<u32>>(v);
    var x = q.x ^ q.y ^ q.z ^ q.w;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
