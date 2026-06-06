/**
 * [KO] 단일 시드값의 비트 구조를 보존하여 1D 난수(0.0 ~ 1.0)를 생성합니다. (초정밀)
 * [EN] Generates a 1D random number (0.0 ~ 1.0) by preserving the bit structure of a single seed value. (Ultra-precise)
 *
 * @param seed [KO] 입력 시드값 [EN] Input seed value
 * @returns [KO] 생성된 난수 [EN] Generated random number
 */
fn getBitHash1D(seed: f32) -> f32 {
    var x = bitcast<u32>(seed);
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = ((x >> 16u) ^ x) * 0x45d9f3bu;
    x = (x >> 16u) ^ x;
    return f32(x) / 4294967296.0;
}
