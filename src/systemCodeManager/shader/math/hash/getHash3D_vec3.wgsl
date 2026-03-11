// [KO] 3D 위치를 정수로 변환하여 3D 난수 벡터를 생성합니다. (안정적 그리드 기반)
// [EN] Generates a 3D random vector by converting a 3D position to integers. (Stable Grid-based)
fn getHash3D_vec3(position: vec3<f32>) -> vec3<f32> {
    var q = vec3<u32>(abs(position));
    // [KO] 소수 곱셈을 이용한 정밀 비트 혼합 (일직선 패턴 방지)
    var x = (q.x * 73856093u) ^ (q.y * 19349663u) ^ (q.z * 83492791u);
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
