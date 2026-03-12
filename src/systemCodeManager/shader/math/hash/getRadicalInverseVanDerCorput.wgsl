// [KO] 입력된 정수의 비트 순서를 뒤집어 0~1 사이의 소수(Van der Corput 시퀀스)를 반환합니다.
// [EN] Reverses the bits of an integer to return a floating-point number between 0 and 1 (Van der Corput sequence).
fn getRadicalInverseVanDerCorput(bits_in: u32) -> f32 {
    var bits = bits_in;
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return f32(bits) * 2.3283064365386963e-10;
}