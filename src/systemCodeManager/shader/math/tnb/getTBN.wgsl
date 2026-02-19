/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] 법선(Normal)과 임의의 탄젠트(Tangent) 벡터를 사용하여 완전한 직교 기저(Orthonormal Basis)인 TBN 행렬을 구축합니다.
 * [EN] Constructs a perfectly orthonormal TBN (Tangent, Bitangent, Normal) matrix using a normal and an arbitrary tangent vector.
 *
 * @param inputNormal - [KO] 정규화된 법선 벡터 [EN] Normalized normal vector
 * @param inputTangent - [KO] 탄젠트 벡터 (법선과 수직이 아니어도 됨) [EN] Tangent vector (does not need to be perpendicular to normal)
 * @returns [KO] 3x3 직교 TBN 행렬 [EN] 3x3 Orthonormal TBN matrix
 */
fn getTBN(inputNormal: vec3<f32>, inputTangent: vec3<f32>) -> mat3x3<f32> {
    // Gram-Schmidt orthonormalization
    let tangent = normalize(inputTangent - inputNormal * dot(inputTangent, inputNormal));
    // [KO] 표준적인 오른손 좌표계 기저 형성 (N x T = B)
    // [EN] Standard right-handed basis formation (N x T = B)
    let bitangent = cross(inputNormal, tangent);
    return mat3x3<f32>(tangent, bitangent, inputNormal);
}
