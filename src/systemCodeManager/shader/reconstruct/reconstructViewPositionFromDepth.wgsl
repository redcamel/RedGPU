#redgpu_include reconstruct.getNDCFromDepth

/**
 * [KO] 깊이 정보를 바탕으로 뷰(카메라) 공간의 좌표를 복구합니다.
 * [EN] Reconstructs view (camera) space position from depth information.
 *
 * @param uv - [KO] 스크린 UV (0~1) [EN] Screen UV (0~1)
 * @param depth - [KO] 깊이 값 (0~1) [EN] Depth value (0~1)
 * @param inverseProjectionMatrix - [KO] 역투영 행렬 [EN] Inverse Projection matrix
 * @returns [KO] 복구된 뷰 공간 좌표 [EN] Reconstructed view space position
 */
fn reconstructViewPositionFromDepth(
    uv: vec2<f32>,
    depth: f32,
    inverseProjectionMatrix: mat4x4<f32>
) -> vec3<f32> {
    let ndc = getNDCFromDepth(uv, depth);
    let viewPos4 = inverseProjectionMatrix * vec4<f32>(ndc, 1.0);
    return viewPos4.xyz / viewPos4.w;
}
