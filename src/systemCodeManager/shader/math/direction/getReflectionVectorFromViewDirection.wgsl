/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] 시선 방향(픽셀에서 카메라를 향하는 벡터)과 법선 벡터를 사용하여 정규화된 반사 방향 벡터를 계산합니다.
 * [EN] Calculates the normalized reflection direction vector using the view direction (vector from pixel to camera) and the normal vector.
 *
 * [KO] 이 함수는 내부적으로 시선 방향을 반전시켜 reflect(-viewDir, normal) 연산을 수행합니다.
 * [EN] This function internally negates the view direction to perform the reflect(-viewDir, normal) operation.
 *
 * @param viewDirection - [KO] 시선 방향 (픽셀 -> 카메라) [EN] View direction (pixel -> camera)
 * @param normal - [KO] 표면 법선 벡터 [EN] Surface normal vector
 * @returns [KO] 정규화된 반사 방향 벡터 [EN] Normalized reflection direction vector
 */
fn getReflectionVectorFromViewDirection(viewDirection: vec3<f32>, normal: vec3<f32>) -> vec3<f32> {
    return reflect(-viewDirection, normal);
}
