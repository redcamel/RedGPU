/**
 * [KO] Charlie Sheen 모델의 DFG(Distribution, Fresnel, Geometry) 통합 항을 계산합니다.
 * [EN] Calculates the integrated DFG term for the Charlie Sheen model.
 *
 * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
 * @param roughness - [KO] Sheen 거칠기 [EN] Sheen roughness
 * @returns [KO] 계산된 DFG 값 [EN] Calculated DFG value
 */
fn getSheenCharlieDFG(NdotV: f32, roughness: f32) -> f32 {
    if (roughness < 0.01) {
        return 0.0;
    }

    let r = clamp(roughness, 0.01, 1.0);
    let grazingFactor = 1.0 - NdotV;
    let roughnessExp = 1.0 / max(r, 0.1);
    let distribution = pow(grazingFactor, roughnessExp);
    let intensity = pow(roughnessExp, 0.5);

    return distribution * intensity * 0.5;
}
