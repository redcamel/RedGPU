/**
 * [KO] 노멀 맵의 RGB 데이터와 TBN 행렬을 결합하여 최종 법선 벡터를 계산합니다.
 * [EN] Combines normal map RGB data with a TBN matrix to calculate the final normal vector.
 *
 * @param normalMapColor - [KO] 노멀 맵에서 샘플링된 RGB 데이터 [0, 1] [EN] RGB data sampled from normal map [0, 1]
 * @param tbn - [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
 * @param normalScale - [KO] 노멀 강도 조절 계수 [EN] Normal scale adjustment factor
 * @returns [KO] 정규화된 최종 법선 벡터 [EN] Final normalized normal vector
 */
fn getNormalFromNormalMap(normalMapColor: vec3<f32>, tbn: mat3x3<f32>, normalScale: f32) -> vec3<f32> {
    // 1. RGB [0, 1] -> 탄젠트 공간 노멀 [-1, 1] 변환
    var tangentNormal = normalMapColor * 2.0 - 1.0;
    
    // 2. Normal Scale 적용 (XY 성분만 스케일링)
    tangentNormal = vec3<f32>(tangentNormal.xy * normalScale, tangentNormal.z);
    
    // 3. TBN 행렬을 통한 공간 변환 및 정규화
    return normalize(tbn * tangentNormal);
}
