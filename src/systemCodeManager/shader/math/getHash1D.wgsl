// [KO] 단일 시드값을 기반으로 1D 난수(0.0 ~ 1.0)를 생성합니다. (비트 연산 기반 고정밀)
// [EN] Generates a 1D random number (0.0 ~ 1.0) based on a single seed value. (High-precision Bitwise)
fn getHash1D(seed: f32) -> f32 {
    var x = bitcast<u32>(seed);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
