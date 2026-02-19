/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] 법선(Normal)과 버텍스 탄젠트(vec4)를 사용하여 TBN(Tangent, Bitangent, Normal) 행렬을 구축합니다.
 * [EN] Constructs a TBN (Tangent, Bitangent, Normal) matrix using the normal and vertex tangent (vec4).
 *
 * @param inputNormal - [KO] 정규화된 법선 벡터 [EN] Normalized normal vector
 * @param inputVertexTangent - [KO] 버텍스 탄젠트 데이터 (xyz: 방향, w: 방향성) [EN] Vertex tangent data
 * @returns [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
 */
fn getTBNFromVertexTangent(inputNormal: vec3<f32>, inputVertexTangent: vec4<f32>) -> mat3x3<f32> {
    let tangent = normalize(inputVertexTangent.xyz);
    // [KO] glTF 표준 및 오른손 법칙 준수 (N x T = B)
    // [EN] Adheres to glTF standard and right-hand rule (N x T = B)
    let bitangent = normalize(cross(inputNormal, tangent) * inputVertexTangent.w);
    return mat3x3<f32>(tangent, bitangent, inputNormal);
}
