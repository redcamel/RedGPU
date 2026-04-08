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
    // [KO] 픽셀 미분을 통한 위치 및 UV 변화량 계산
    // [EN] Calculate position and UV changes through pixel derivatives
    let dp1 = dpdx(inputWorldPos);
    let dp2 = dpdy(inputWorldPos);
    let duv1 = dpdx(inputUV);
    let duv2 = dpdy(inputUV);

    // [KO] 연립 방정식을 풀어 탄젠트와 비탄젠트 방향 도출 (Schüler's technique)
    // [EN] Derive tangent and bitangent directions by solving simultaneous equations (Schüler's technique)
    let dp2perp = cross(dp2, inputNormal);
    let dp1perp = cross(inputNormal, dp1);
    
    let tangent = dp2perp * duv1.x + dp1perp * duv2.x;
    let bitangent = dp2perp * duv1.y + dp1perp * duv2.y;

    // [KO] Gram-Schmidt 직교화 및 행렬 구성
    // [EN] Gram-Schmidt orthonormalization and matrix construction
    let invmax = inverseSqrt(max(dot(tangent, tangent), dot(bitangent, bitangent)));

    // [KO] glTF 노멀 맵 G 채널은 Y+이며, 이는 V가 감소하는 방향(위쪽)을 의미합니다.
    // [KO] Schüler 공식으로 계산된 bitangent는 V가 증가하는 방향(아래쪽)을 향하므로 부호를 반전시킵니다.
    // [EN] glTF normal map G channel is Y+ (upwards), which corresponds to decreasing V.
    // [EN] The bitangent calculated by Schüler's formula points in the direction of increasing V (downwards), so we flip its sign.
    return mat3x3<f32>(tangent * invmax, -bitangent * invmax, inputNormal);
}
