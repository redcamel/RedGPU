#redgpu_include math.reconstruct.getNDCFromDepth

/**
 * [KO] 깊이 정보를 바탕으로 월드 공간의 좌표를 복구합니다.
 * [EN] Reconstructs world space position from depth information.
 *
 * @param uv - [KO] 스크린 UV (0~1) [EN] Screen UV (0~1)
 * @param depth - [KO] 깊이 값 (0~1) [EN] Depth value (0~1)
 * @param inverseProjectionCameraMatrix - [KO] 역투영카메라 행렬 [EN] Inverse Projection-Camera matrix
 * @returns [KO] 복구된 월드 공간 좌표 [EN] Reconstructed world space position
 */
fn getWorldPositionFromDepth(
    uv: vec2<f32>,
    depth: f32,
    inverseProjectionCameraMatrix: mat4x4<f32>
) -> vec3<f32> {
    let ndc = getNDCFromDepth(uv, depth);
    let worldPos4 = inverseProjectionCameraMatrix * vec4<f32>(ndc, 1.0);
    return worldPos4.xyz / worldPos4.w;
}
