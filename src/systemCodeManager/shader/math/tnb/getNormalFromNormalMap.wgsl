/**
 * [KO] 노멀 맵 데이터를 탄젠트 공간의 법선 벡터로 변환하고 TBN 행렬을 적용합니다.
 * [EN] Converts normal map data to a tangent space normal vector and applies the TBN matrix.
 *
 * @param sampledNormalColor - [KO] 노멀 맵에서 샘플링된 데이터 (RG 또는 RGB) [EN] Sampled data from normal map (RG or RGB)
 * @param tbn - [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
 * @param strength - [KO] 노멀 강도 [EN] Normal strength
 * @returns [KO] 월드/뷰 공간의 정규화된 법선 벡터 [EN] Normalized normal vector in world/view space
 */
fn getNormalFromNormalMap(sampledNormalColor: vec3<f32>, tbn: mat3x3<f32>, strength: f32) -> vec3<f32> {
    // 1. Unpack XY: [0, 1] -> [-1, 1]
    var n: vec2<f32> = sampledNormalColor.xy * 2.0 - 1.0;

    // 2. Apply Strength
    n *= strength;

    // 3. Z-Reconstruction: z = sqrt(1.0 - x^2 - y^2)
    let z: f32 = sqrt(max(0.0, 1.0 - dot(n, n)));

    // 4. Transform to World/View Space and Normalize
    return normalize(tbn * vec3<f32>(n, z));
}
