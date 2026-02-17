/**
 * [KO] 법선(Normal)과 버텍스 탄젠트(vec4)를 사용하여 TBN(Tangent, Bitangent, Normal) 행렬을 구축합니다.
 * [EN] Constructs a TBN (Tangent, Bitangent, Normal) matrix using the normal and vertex tangent (vec4).
 *
 * [KO] 이 함수는 버텍스 탄젠트의 w 성분을 사용하여 Bitangent의 방향(Handedness)을 정확하게 결정합니다.
 * [EN] This function uses the w component of the vertex tangent to correctly determine the handedness of the Bitangent.
 *
 * @param normal - [KO] 정규화된 법선 벡터 [EN] Normalized normal vector
 * @param vertexTangent - [KO] 버텍스 탄젠트 데이터 (xyz: 방향, w: 방향성) [EN] Vertex tangent data
 * @returns [KO] 3x3 TBN 행렬 [EN] 3x3 TBN matrix
 */
fn getTBNFromVertexTangent(normal: vec3<f32>, vertexTangent: vec4<f32>) -> mat3x3<f32> {
    let T = normalize(vertexTangent.xyz);
    let B = normalize(cross(normal, T) * vertexTangent.w);
    return mat3x3<f32>(T, B, normal);
}
