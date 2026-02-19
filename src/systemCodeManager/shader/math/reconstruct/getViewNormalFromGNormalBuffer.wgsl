#redgpu_include math.reconstruct.getWorldNormalFromGNormalBuffer

/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] G-Buffer 데이터와 카메라 행렬을 사용하여 뷰 공간 법선 벡터를 복구합니다.
 * [EN] Reconstructs view space normal vector from G-Buffer data and camera matrix.
 *
 * @param gBufferNormal - [KO] G-Buffer에서 샘플링된 노멀 데이터 [EN] Normal data sampled from G-Buffer
 * @param cameraMatrix - [KO] 카메라 행렬 (View Matrix) [EN] Camera matrix (View Matrix)
 * @returns [KO] 복구된 뷰 공간 법선 벡터 [EN] Reconstructed view space normal vector
 */
fn getViewNormalFromGNormalBuffer(gBufferNormal: vec3<f32>, cameraMatrix: mat4x4<f32>) -> vec3<f32> {
    let worldNormal = getWorldNormalFromGNormalBuffer(gBufferNormal);
    return normalize((cameraMatrix * vec4<f32>(worldNormal, 0.0)).xyz);
}
