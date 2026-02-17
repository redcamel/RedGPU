/**
 * [KO] 법선(Normal)과 임의의 탄젠트(Tangent) 벡터를 사용하여 완전한 직교 기저(Orthonormal Basis)인 TBN 행렬을 구축합니다.
 * [EN] Constructs a perfectly orthonormal TBN (Tangent, Bitangent, Normal) matrix using a normal and an arbitrary tangent vector.
 *
 * @param normal - [KO] 정규화된 법선 벡터 [EN] Normalized normal vector
 * @param tangent - [KO] 탄젠트 벡터 (법선과 수직이 아니어도 됨) [EN] Tangent vector (does not need to be perpendicular to normal)
 * @returns [KO] 3x3 직교 TBN 행렬 [EN] 3x3 Orthonormal TBN matrix
 */
fn getTBN(normal: vec3<f32>, tangent: vec3<f32>) -> mat3x3<f32> {
    // Gram-Schmidt orthonormalization
    let T = normalize(tangent - normal * dot(tangent, normal));
    // [KO] 표준적인 오른손 좌표계 기저 형성 (N x T = B)
    // [EN] Standard right-handed basis formation (N x T = B)
    let B = cross(normal, T);
    return mat3x3<f32>(T, B, normal);
}
