// [KO] 단일 시드값을 정수로 변환하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (안정적 그리드 기반)
// [EN] Generates a 1D random number (0.0 ~ 1.0) by converting a single seed value to an integer. (Stable Grid-based)
fn getHash1D(seed: f32) -> f32 {
    var x = u32(abs(seed));
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
