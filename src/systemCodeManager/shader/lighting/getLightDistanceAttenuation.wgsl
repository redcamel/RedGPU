/**
 * [KO] 거리 제곱에 반비례하는 물리적 광원 감쇄 계수를 계산합니다.
 * [EN] Calculates the physical light attenuation factor inversely proportional to the square of the distance.
 *
 * [KO] 이 함수는 Inverse Square Law를 기반으로 하며, 광원의 반경(radius)을 고려하여 거리에 따른 에너지 감쇄를 계산합니다.
 * [EN] This function is based on the Inverse Square Law and calculates energy attenuation according to distance, considering the light's radius.
 *
 * @param distance - 
 * [KO] 광원으로부터의 거리
 * [EN] Distance from the light source
 * @param radius - 
 * [KO] 광원의 도달 반경
 * [EN] Reach radius of the light source
 * @returns 
 * [KO] 계산된 감쇄 계수 (0.0 ~ 1.0)
 * [EN] Calculated attenuation factor (0.0 to 1.0)
 */
fn getLightDistanceAttenuation(distance: f32, radius: f32) -> f32 {
    let d2 = distance * distance;
    let r2 = radius * radius;
    
    // [KO] 현대적인 표준 윈도잉 함수 (glTF 2.0 / Frostbite / Unreal 방식)
    // [EN] Modern standard windowing function (glTF 2.0 / Frostbite / Unreal style)
    let factor = distance / radius;
    let factor2 = factor * factor;
    let factor4 = factor2 * factor2;
    let windowing = clamp(1.0 - factor4, 0.0, 1.0);
    
    // [KO] 정규화된 역제곱 법칙 적용 (Radius^2 / d^2)
    // [EN] Apply normalized inverse square law (Radius^2 / d^2)
    return (windowing * windowing) * r2 / max(d2, 0.0001);
}
