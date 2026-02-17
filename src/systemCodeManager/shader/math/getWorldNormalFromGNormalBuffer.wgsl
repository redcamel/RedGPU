/**
 * [KO] G-Buffer의 RGB 데이터([0, 1] 범위)를 사용하여 월드 공간 법선 벡터([-1, 1] 범위)를 복구합니다.
 * [EN] Reconstructs world space normal vector ([-1, 1] range) from G-Buffer RGB data ([0, 1] range).
 *
 * @param gBufferNormal - [KO] G-Buffer에서 샘플링된 노멀 데이터 [EN] Normal data sampled from G-Buffer
 * @returns [KO] 복구된 월드 공간 법선 벡터 [EN] Reconstructed world space normal vector
 */
fn getWorldNormalFromGNormalBuffer(gBufferNormal: vec3<f32>) -> vec3<f32> {
    return normalize(gBufferNormal * 2.0 - 1.0);
}
