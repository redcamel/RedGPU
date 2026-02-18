/**
 * [KO] 스폿라이트의 각도(원뿔)에 따른 감쇄 계수를 계산합니다.
 * [EN] Calculates the attenuation factor according to the angle (cone) of the spotlight.
 *
 * [KO] 내부 원뿔(Inner Cone)과 외부 원뿔(Outer Cone) 사이의 영역에서 부드러운 페이드 효과를 생성합니다.
 * [EN] Creates a smooth fade effect in the area between the inner cone and the outer cone.
 *
 * @param lightToVertexDirection - 
 * [KO] 광원에서 픽셀(버텍스)을 향하는 정규화된 방향 벡터
 * [EN] Normalized direction vector from the light source to the pixel (vertex)
 * @param lightDirection - 
 * [KO] 스폿라이트가 비추는 정규화된 중심 방향 벡터
 * [EN] Normalized center direction vector that the spotlight shines in
 * @param innerCutoff - 
 * [KO] 내부 원뿔 컷오프 각도 (Degree)
 * [EN] Inner cone cutoff angle (Degree)
 * @param outerCutoff - 
 * [KO] 외부 원뿔 컷오프 각도 (Degree)
 * [EN] Outer cone cutoff angle (Degree)
 * @returns 
 * [KO] 계산된 각도 감쇄 계수 (0.0 ~ 1.0)
 * [EN] Calculated angle attenuation factor (0.0 to 1.0)
 */
fn getLightAngleAttenuation(
    lightToVertexDirection: vec3<f32>, 
    lightDirection: vec3<f32>, 
    innerCutoff: f32, 
    outerCutoff: f32
) -> f32 {
    let cosTheta = dot(lightToVertexDirection, lightDirection);
    let cosOuter = cos(radians(outerCutoff));
    let cosInner = cos(radians(innerCutoff));
    
    // [KO] 스폿라이트 감쇄 수식 (glTF 2.0 표준)
    // [EN] Spotlight attenuation formula (glTF 2.0 standard)
    // scale = 1.0 / max(0.001, cosInner - cosOuter)
    // offset = -cosOuter * scale
    // factor = clamp(cosTheta * scale + offset, 0.0, 1.0)
    // result = factor * factor (더 부드러운 감쇄를 위해 제곱 적용)
    
    let epsilon = max(0.001, cosInner - cosOuter);
    let factor = clamp((cosTheta - cosOuter) / epsilon, 0.0, 1.0);
    return factor * factor;
}
