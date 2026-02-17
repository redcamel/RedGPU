/**
 * [KO] 프레넬 항을 기반으로 하단 레이어(base)와 상단 레이어(layer)를 물리적으로 혼합합니다.
 * [EN] Physically mixes the base layer and the top layer based on the Fresnel term.
 *
 * @param F0 - [KO] 기본 반사율 [EN] Base reflectance
 * @param weight - [KO] 혼합 가중치 [EN] Mixing weight
 * @param base - [KO] 하단 레이어 색상 (Diffuse/BTDF) [EN] Base layer color (Diffuse/BTDF)
 * @param layer - [KO] 상단 레이어 색상 (Specular) [EN] Top layer color (Specular)
 * @param VdotH - [KO] 시선 방향과 하프 벡터의 내적 [EN] Dot product of view direction and half vector
 * @returns [KO] 혼합된 최종 색상 [EN] Final mixed color
 */
fn fresnel_mix(
    F0: vec3<f32>,
    weight: f32,
    base: vec3<f32>,
    layer: vec3<f32>,
    VdotH: f32
) -> vec3<f32> {
    var f0 = min(F0, vec3<f32>(1.0));
    let fr = f0 + (vec3<f32>(1.0) - f0) * pow(clamp(1.0 - abs(VdotH), 0.0, 1.0), 5.0);
    return (1.0 - weight * max(max(fr.x, fr.y), fr.z)) * base + weight * fr * layer;
}
