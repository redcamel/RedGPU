// [KO] 3D 위치를 기반으로 3D 난수 벡터를 생성합니다. (비트 연산 및 정수 변환 기반)
// [EN] Generates a 3D random vector based on a 3D position. (Bitwise and Integer conversion)
fn getHash3D_vec3(position: vec3<f32>) -> vec3<f32> {
    var q = vec3<u32>(abs(position));
    var x = q.x ^ q.y ^ q.z;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    
    // [KO] 각 채널에 대해 서로 다른 오프셋을 주어 벡터 구성
    // [EN] Give different offsets for each channel to compose vector
    let r = f32(x) / 4294967296.0;
    x = (x * 1103515245u + 12345u);
    let g = f32(x) / 4294967296.0;
    x = (x * 1103515245u + 12345u);
    let b = f32(x) / 4294967296.0;
    
    return vec3<f32>(r, g, b);
}
