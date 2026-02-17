// [KO] 3D 벡터의 비트 구조를 보존하여 1D 난수를 생성합니다. (초정밀)
// [EN] Generates a 1D random number by preserving the bit structure of a 3D vector. (Ultra-precise)
fn getBitHash1D_vec3(v: vec3<f32>) -> f32 {
    var q = bitcast<vec3<u32>>(v);
    var x = q.x ^ q.y ^ q.z;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
