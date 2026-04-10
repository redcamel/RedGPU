#redgpu_include math.EPSILON

/**
 * [KO] Smith의 기법을 사용한 높이 상관(Height-Correlated) 가시성(Visibility) 함수를 계산합니다.
 * [EN] Calculates the Height-Correlated Visibility function using Smith's method.
 *
 * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
 * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
 * @param roughness - [KO] 표면 거칠기 [0, 1] [EN] Surface roughness [0, 1]
 * @returns [KO] 가시성 계수 [EN] Visibility factor
 */
fn getSpecularVisibility(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;

    let GGXV = NdotL * sqrt(NdotV * NdotV * (1.0 - alpha2) + alpha2);
    let GGXL = NdotV * sqrt(NdotL * NdotL * (1.0 - alpha2) + alpha2);

    return 0.5 / max(GGXV + GGXL, EPSILON);
}
