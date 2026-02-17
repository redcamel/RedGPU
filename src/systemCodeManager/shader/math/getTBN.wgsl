/**
 * [KO] 법선(Normal)과 임의의 탄젠트(Tangent) 벡터를 사용하여 완전한 직교 기저(Orthonormal Basis)인 TBN 행렬을 구축합니다.
 * [EN] Constructs a perfectly orthonormal TBN (Tangent, Bitangent, Normal) matrix using a normal and an arbitrary tangent vector.
 *
 * [KO] 이 함수는 Gram-Schmidt 과정을 수행하여 탄젠트 벡터가 법선 벡터와 정확히 수직이 되도록 강제합니다.
 * [EN] This function performs the Gram-Schmidt process to force the tangent vector to be perfectly perpendicular to the normal vector.
 *
 * @param normal - [KO] 정규화된 법선 벡터 [EN] Normalized normal vector
 * @param tangent - [KO] 탄젠트 벡터 (법선과 수직이 아니어도 됨) [EN] Tangent vector (does not need to be perpendicular to normal)
 * @returns [KO] 3x3 직교 TBN 행렬 [EN] 3x3 Orthonormal TBN matrix
 */
fn getTBN(normal: vec3<f32>, tangent: vec3<f32>) -> mat3x3<f32> {
    // Gram-Schmidt orthonormalization
    let T = normalize(tangent - normal * dot(tangent, normal));
    let B = cross(normal, T);
    return mat3x3<f32>(T, B, normal);
}
