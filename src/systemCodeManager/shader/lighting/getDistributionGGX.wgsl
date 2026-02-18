#redgpu_include math.PI
#redgpu_include math.EPSILON

/**
 * [KO] GGX(Trowbridge-Reitz) 법선 분포 함수(NDF)를 계산합니다.
 * [EN] Calculates the GGX (Trowbridge-Reitz) Normal Distribution Function (NDF).
 *
 * @param NdotH - [KO] 법선과 하프 벡터의 내적 [EN] Dot product of normal and half vector
 * @param roughness - [KO] 표면 거칠기 [0, 1] [EN] Surface roughness [0, 1]
 * @returns [KO] 미세면의 정렬 밀도 [EN] Microfacet alignment density
 */
fn getDistributionGGX(NdotH: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;
    let NdotH2 = NdotH * NdotH;

    let nom = alpha2;
    let denom = (NdotH2 * (alpha2 - 1.0) + 1.0);
    let denomSquared = denom * denom;

    return nom / max(EPSILON, denomSquared * PI);
}
