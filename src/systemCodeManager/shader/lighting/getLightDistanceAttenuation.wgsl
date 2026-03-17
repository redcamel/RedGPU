#redgpu_include math.EPSILON

/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] 물리적인 역제곱 법칙(Inverse Square Law)에 따른 광원 감쇄 계수를 계산합니다.
 * [EN] Calculates the light attenuation factor according to the physical Inverse Square Law.
 *
 * [KO] 이 함수는 순수 물리적 역제곱 법칙(1/d^2)을 따르며, Frostbite 방식의 윈도잉 함수를 사용하여 광원의 radius 지점에서 부드럽게 0으로 수렴하도록 합니다.
 * [KO] 주의: 4*PI 분산 계수는 에너지 보존을 위해 외부(Lumen 단위 변환 시)에서 적용되어야 합니다.
 * [EN] This function follows the pure physical inverse square law (1/d^2) and uses a Frostbite-style windowing function to smoothly converge to 0 at the light's radius.
 * [EN] Note: The 4*PI dispersion factor should be applied externally (during Lumen unit conversion) for energy conservation.
 *
 * @param distance - 
 * [KO] 광원으로부터의 거리
 * [EN] Distance from the light source
 * @param radius - 
 * [KO] 광원의 최대 도달 반경 (윈도잉 기준)
 * [EN] Maximum reach radius of the light source (windowing reference)
 * @returns 
 * [KO] 계산된 물리적 감쇄 계수
 * [EN] Calculated physical attenuation factor
 */
fn getLightDistanceAttenuation(distance: f32, radius: f32) -> f32 {
    let d2 = distance * distance;
    
    // [KO] 현대적인 표준 윈도잉 함수 (Frostbite / Unreal 방식)
    // [EN] Modern standard windowing function (Frostbite / Unreal style)
    let factor = distance / radius;
    let factor2 = factor * factor;
    let factor4 = factor2 * factor2;
    let windowing = clamp(1.0 - factor4, 0.0, 1.0);
    
    // [KO] 순수 역제곱 법칙 적용 (1 / d^2) + 윈도잉
    // [EN] Apply pure inverse square law (1 / d^2) + windowing
    return (windowing * windowing) / max(d2, 0.0001);
}
