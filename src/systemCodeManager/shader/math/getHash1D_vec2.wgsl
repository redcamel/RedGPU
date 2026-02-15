// [KO] 2D 좌표를 기반으로 1D 난수(0.0 ~ 1.0)를 생성합니다. (비트 연산 및 정수 변환 기반)
// [EN] Generates a 1D random number (0.0 ~ 1.0) based on 2D coordinates. (Bitwise and Integer conversion)
fn getHash1D_vec2(coord: vec2<f32>) -> f32 {
    // [KO] 명시적 정수 변환으로 좌표 계의 안정성 확보
    // [EN] Explicit integer conversion for coordinate system stability
    let q = vec2<u32>(abs(coord));
    var x = q.x ^ q.y;
    
    // [KO] 고품질 비트 믹서 (PCG 스타일)
    // [EN] High-quality bit mixer (PCG style)
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
