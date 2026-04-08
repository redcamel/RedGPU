/**
 * [Stage: Fragment Only]
 * [KO] 픽셀의 미분(Derivatives)을 사용하여 탄젠트와 비탄젠트를 동적으로 계산하고 TBN 행렬을 구축합니다.
 * [EN] Dynamically calculates tangent and bitangent using pixel derivatives and constructs a TBN matrix.
 *
 * @param inputNormal - [KO] 보간된 법선 벡터 [EN] Interpolated normal vector
 * @param inputWorldPos - [KO] 월드 공간의 픽셀 위치 [EN] World space pixel position
 * @param inputUV - [KO] 픽셀의 UV 좌표 [EN] Pixel UV coordinates
 * @returns [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
 */
fn getTBNFromCotangent(inputNormal: vec3<f32>, inputWorldPos: vec3<f32>, inputUV: vec2<f32>) -> mat3x3<f32> {
    // 픽셀 미분을 통한 위치 및 UV 변화량 계산
    let dp1 = dpdx(inputWorldPos);
    let dp2 = dpdy(inputWorldPos);
    var duv1 = dpdx(inputUV);
    var duv2 = dpdy(inputUV);

    // [KO] UV 래핑 보정: 0.0 <-> 1.0 경계에서 미분 값이 급증하는 현상 방지
    // [EN] UV Wrap correction: Prevents derivative spikes at 0.0 <-> 1.0 boundaries
    duv1 = duv1 - round(duv1);
    duv2 = duv2 - round(duv2);

    // 연립 방정식을 풀어 탄젠트와 비탄젠트 방향 도출 (Schüler's technique)
    let dp2perp = cross(dp2, inputNormal);
    let dp1perp = cross(inputNormal, dp1);
    let tangent = dp2perp * duv1.x + dp1perp * duv2.x;
    let bitangent = dp2perp * duv1.y + dp1perp * duv2.y;

    // Gram-Schmidt 직교화 및 행렬 구성
    let invmax = inverseSqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)) + 1e-10);
    return mat3x3<f32>(tangent * invmax, bitangent * invmax, inputNormal);
}
