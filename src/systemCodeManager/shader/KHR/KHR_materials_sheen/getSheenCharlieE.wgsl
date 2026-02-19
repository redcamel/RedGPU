#redgpu_include math.EPSILON

/**
 * [KO] Charlie Sheen 모델의 에너지 보존을 위한 E항을 계산합니다. (Albedo scaling용)
 * [EN] Calculates the E term for energy conservation in the Charlie Sheen model. (For albedo scaling)
 *
 * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
 * @param roughness - [KO] Sheen 거칠기 [EN] Sheen roughness
 * @returns [KO] 계산된 E 값 [EN] Calculated E value
 */
fn getSheenCharlieE(NdotV: f32, roughness: f32) -> f32 {
    if (roughness < 0.01) {
        return 0.0;
    }

    let r = clamp(roughness, 0.01, 1.0);
    let grazingFactor = 1.0 - NdotV;
    let roughnessExp = 1.0 / max(r, EPSILON);

    return pow(grazingFactor, roughnessExp) * pow(r, 0.5);
}
