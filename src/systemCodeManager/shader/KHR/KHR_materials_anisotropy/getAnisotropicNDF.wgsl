#redgpu_include math.INV_PI

/**
 * [KO] 이방성 GGX(Trowbridge-Reitz) 법선 분포 함수(NDF)를 계산합니다.
 * [EN] Calculates the Anisotropic GGX (Trowbridge-Reitz) Normal Distribution Function (NDF).
 *
 * @param NdotH - [KO] 법선과 하프 벡터의 내적 [EN] Dot product of normal and half vector
 * @param TdotH - [KO] 탄젠트와 하프 벡터의 내적 [EN] Dot product of tangent and half vector
 * @param BdotH - [KO] 비탄젠트와 하프 벡터의 내적 [EN] Dot product of bitangent and half vector
 * @param at - [KO] 탄젠트 방향의 거칠기 [EN] Roughness in the tangent direction
 * @param ab - [KO] 비탄젠트 방향의 거칠기 [EN] Roughness in the bitangent direction
 * @returns [KO] 계산된 NDF 값 [EN] Calculated NDF value
 */
fn getAnisotropicNDF(NdotH: f32, TdotH: f32, BdotH: f32, at: f32, ab: f32) -> f32 {
    let a2: f32 = at * ab;
    let f: vec3<f32> = vec3<f32>(ab * TdotH, at * BdotH, a2 * NdotH);
    let denominator: f32 = dot(f, f);
    
    // [KO] 수치적 안정성을 위해 INV_PI 적용
    // [EN] Applies INV_PI for numerical stability
    let w2: f32 = a2 / denominator;
    return a2 * w2 * w2 * INV_PI;
}
