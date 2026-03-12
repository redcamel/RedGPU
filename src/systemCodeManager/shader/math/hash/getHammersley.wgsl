#redgpu_include math.hash.getRadicalInverseVanDerCorput

// [KO] 균일한 분포를 가지는 2D 준난수(Low-Discrepancy Sequence)를 생성합니다. (IBL 등 중요도 샘플링에 필수적입니다.)
// [EN] Generates a uniformly distributed 2D quasi-random number (Low-Discrepancy Sequence). (Essential for importance sampling like IBL.)
fn getHammersley(i: u32, N: u32) -> vec2<f32> {
    return vec2<f32>(f32(i) / f32(N), getRadicalInverseVanDerCorput(i));
}