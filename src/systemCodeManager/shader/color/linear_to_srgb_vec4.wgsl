#redgpu_include color.linear_to_srgb_vec3

/**
 * [KO] Linear 색 공간의 vec4 색상을 sRGB 색 공간으로 변환합니다. (Alpha 보존)
 * [EN] Converts vec4 color from Linear color space to sRGB color space. (Preserves Alpha)
 */
fn linear_to_srgb_vec4(linearColor: vec4<f32>) -> vec4<f32> {
    return vec4<f32>(linear_to_srgb_vec3(linearColor.rgb), linearColor.a);
}
