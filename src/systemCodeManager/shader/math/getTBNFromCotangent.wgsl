/**
 * [KO] 픽셀의 미분(Derivatives)을 사용하여 탄젠트와 비탄젠트를 동적으로 계산하고 TBN 행렬을 구축합니다.
 * [EN] Dynamically calculates tangent and bitangent using pixel derivatives and constructs a TBN matrix.
 *
 * @param normal - [KO] 보간된 법선 벡터 [EN] Interpolated normal vector
 * @param worldPosition - [KO] 월드 공간의 픽셀 위치 [EN] World space pixel position
 * @param texcoord - [KO] 픽셀의 UV 좌표 [EN] Pixel UV coordinates
 * @returns [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
 */
fn getTBNFromCotangent(normal: vec3<f32>, worldPosition: vec3<f32>, texcoord: vec2<f32>) -> mat3x3<f32> {
    // 픽셀 미분을 통한 위치 및 UV 변화량 계산
    let dp1 = dpdx(worldPosition);
    let dp2 = dpdy(worldPosition);
    let duv1 = dpdx(texcoord);
    let duv2 = dpdy(texcoord); // [Fixed] 이전 호출에서 dpdx를 중복 사용하던 오류 수정

    // 연립 방정식을 풀어 탄젠트와 비탄젠트 방향 도출 (Schüler's technique)
    let dp2perp = cross(dp2, normal);
    let dp1perp = cross(normal, dp1);
    let T = dp2perp * duv1.x + dp1perp * duv2.x;
    let B = dp2perp * duv1.y + dp1perp * duv2.y;

    // Gram-Schmidt 직교화 및 행렬 구성
    let invmax = inverseSqrt(max(dot(T, T), dot(B, B)));
    return mat3x3<f32>(T * invmax, B * invmax, normal);
}
