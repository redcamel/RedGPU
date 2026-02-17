// [KO] 3D 벡터의 비트 구조를 보존하여 3D 난수 벡터를 생성합니다. (초정밀)
// [EN] Generates a 3D random vector by preserving the bit structure of a 3D vector. (Ultra-precise)
fn getBitHash3D_vec3(position: vec3<f32>) -> vec3<f32> {
    var q = bitcast<vec3<u32>>(position);
    var x = q.x ^ q.y ^ q.z;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    
    let r = f32(x) / 4294967296.0;
    x = (x * 1103515245u + 12345u);
    let g = f32(x) / 4294967296.0;
    x = (x * 1103515245u + 12345u);
    let b = f32(x) / 4294967296.0;
    
    return vec3<f32>(r, g, b);
}
