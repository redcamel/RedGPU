// [KO] 3D 입력(위치+시간)을 기반으로 고품질 1D 난수를 생성합니다. (PCG 기반 패턴 파괴)
// [EN] Generates high-quality 1D random number based on 3D input. (PCG-based pattern destruction)
fn getHash1D_vec3(v: vec3<f32>) -> f32 {
    // [KO] 비트 구조를 그대로 가져와서 정밀한 시드로 활용 (abs 금지, 패턴 유발 방지)
    var q = bitcast<vec3<u32>>(v);
    
    // [KO] 더욱 강력한 비트 믹싱 (PCG 스타일)
    q = q * 1664525u + 1013904223u;
    var x = q.x;
    x += q.y * q.z;
    x ^= x >> 16u;
    x ^= x << 16u;
    x *= 1664525u;
    
    return f32(x) / 4294967296.0;
}
