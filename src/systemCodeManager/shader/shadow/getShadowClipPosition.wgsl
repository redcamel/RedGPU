/**
 * [Stage: Vertex Only]
 * [KO] 월드 좌표를 빛의 관점에서의 클립 공간(Clip Space) 좌표로 변환합니다. (Shadow Pass 전용)
 * [EN] Converts world coordinates to clip space coordinates from the light's perspective. (For Shadow Pass)
 *
 * @param worldPosition - [KO] 월드 공간 상의 위치 [EN] Position in world space
 * @param lightViewProjectionMatrix - [KO] 빛의 View-Projection 행렬 [EN] Light's View-Projection matrix
 * @returns [KO] 빛의 클립 공간 좌표 (vec4) [EN] Light's clip space coordinates (vec4)
 */
fn getShadowClipPosition(worldPosition: vec3<f32>, lightViewProjectionMatrix: mat4x4<f32>) -> vec4<f32> {
    // [KO] 월드 좌표를 빛의 공간으로 투영
    // [EN] Projects world coordinates into light space
    return lightViewProjectionMatrix * vec4<f32>(worldPosition, 1.0);
}
