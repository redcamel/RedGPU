/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] 월드 좌표와 카메라 위치를 사용하여 정규화된 시선 방향 벡터(카메라를 향하는 벡터)를 계산합니다.
 * [EN] Calculates the normalized view direction vector (vector toward the camera) using world position and camera position.
 *
 * @param worldPosition - [KO] 월드 공간의 좌표 [EN] World space position
 * @param cameraPosition - [KO] 카메라의 월드 위치 [EN] Camera position in world space
 * @returns [KO] 정규화된 시선 방향 벡터 [EN] Normalized view direction vector
 */
fn getViewDirection(worldPosition: vec3<f32>, cameraPosition: vec3<f32>) -> vec3<f32> {
    return normalize(cameraPosition - worldPosition);
}
