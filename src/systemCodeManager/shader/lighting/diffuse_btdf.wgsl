#redgpu_include math.INV_PI

/**
 * [KO] 디퓨즈 BTDF(확산 투과)를 계산합니다.
 * [EN] Calculates Diffuse BTDF (Diffuse Transmission).
 *
 * [KO] 뒷면에서 들어오는 광선이 표면을 투과하여 시선 방향으로 산란되는 효과를 처리합니다.
 * [EN] Processes the effect where light coming from the back passes through the surface and scatters toward the view direction.
 *
 * @param N - [KO] 법선 벡터 [EN] Normal vector
 * @param L - [KO] 광원 방향 벡터 [EN] Light direction vector
 * @param albedo - [KO] 표면 반사율(색상) [EN] Surface albedo (color)
 * @returns [KO] 계산된 확산 투과 값 [EN] Calculated diffuse transmission value
 */
fn diffuse_btdf(N: vec3<f32>, L: vec3<f32>, albedo: vec3<f32>) -> vec3<f32> {
    // 뒷면으로 들어오는 광선만 처리 (-dot(N,L)를 사용하여 음수만 양수로 변환하여 사용)
    let cos_theta = max(-dot(N, L), 0.0);
    return albedo * cos_theta * INV_PI;
}
