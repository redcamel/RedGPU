/**
 * [KO] 기저 층 위에 투명 코팅(Clearcoat) 레이어를 적용합니다. (에너지 보존 고려)
 * [EN] Applies a clearcoat layer over the base layer, considering energy conservation.
 */
fn fresnel_coat(NdotV: f32, ior: f32, weight: f32, base: vec3<f32>, layer: vec3<f32>) -> vec3<f32> {
    let f0: f32 = pow((1.0 - ior) / (1.0 + ior), 2.0);
    let fr: f32 = f0 + (1.0 - f0) * pow(clamp(1.0 - abs(NdotV), 0.0, 1.0), 5.0);
    return mix(base, layer, weight * fr);
}
