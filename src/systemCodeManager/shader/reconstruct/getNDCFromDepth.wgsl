/**
 * [KO] 스크린 UV와 깊이 값을 WebGPU 표준 NDC(Normalized Device Coordinates) 좌표로 변환합니다.
 * [EN] Converts screen UV and depth values to standard WebGPU NDC (Normalized Device Coordinates).
 *
 * @param uv - [KO] 스크린 UV (0~1) [EN] Screen UV (0~1)
 * @param depth - [KO] 깊이 값 (0~1) [EN] Depth value (0~1)
 * @returns [KO] NDC 좌표 (-1~1 range for XY, 0~1 for Z) [EN] NDC coordinates
 */
fn getNDCFromDepth(uv: vec2<f32>, depth: f32) -> vec3<f32> {
    return vec3<f32>(
        uv.x * 2.0 - 1.0,
        (1.0 - uv.y) * 2.0 - 1.0, // WGSL 스크린 Y-Down을 NDC Y-Up으로 보정
        depth
    );
}
