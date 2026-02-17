/**
 * [KO] Smith의 기법을 사용한 기하 차폐(Geometric Shadowing) 함수를 계산합니다.
 * [EN] Calculates Geometric Shadowing using Smith's method with GGX.
 *
 * @param NdotV - [KO] 법선과 시선 방향의 내적 [EN] Dot product of normal and view direction
 * @param NdotL - [KO] 법선과 광원 방향의 내적 [EN] Dot product of normal and light direction
 * @param roughness - [KO] 표면 거칠기 [0, 1] [EN] Surface roughness [0, 1]
 * @returns [KO] 기하 감쇠 계수 [EN] Geometric attenuation factor
 */
fn geometry_smith(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let k = alpha / 2.0; // 직접 조명(Direct Lighting)에 적합한 k 값

    let ggx1 = NdotV / (NdotV * (1.0 - k) + k);
    let ggx2 = NdotL / (NdotL * (1.0 - k) + k);

    return ggx1 * ggx2;
}
