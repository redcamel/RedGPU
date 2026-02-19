/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] 카메라 위치와 월드 좌표를 사용하여 정규화된 광선 방향 벡터(픽셀을 향하는 벡터)를 계산합니다.
 * [EN] Calculates the normalized ray direction vector (vector toward the pixel) using camera position and world position.
 *
 * @param worldPosition - [KO] 월드 공간의 좌표 [EN] World space position
 * @param cameraPosition - [KO] 카메라의 월드 위치 [EN] Camera position in world space
 * @returns [KO] 정규화된 광선 방향 벡터 [EN] Normalized ray direction vector
 */
fn getRayDirection(worldPosition: vec3<f32>, cameraPosition: vec3<f32>) -> vec3<f32> {
    return normalize(worldPosition - cameraPosition);
}
