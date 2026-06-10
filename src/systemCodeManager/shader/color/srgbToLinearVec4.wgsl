#redgpu_include color.srgbToLinearVec3

/**
 * [KO] sRGB 색 공간의 vec4 색상을 Linear 색 공간으로 변환합니다. (Alpha 보존)
 * [EN] Converts vec4 color from sRGB color space to Linear color space. (Preserves Alpha)
 *
 * @param srgbColor [KO] 입력 sRGB 색상 [EN] Input sRGB color
 * @returns [KO] 변환된 Linear 색상 [EN] Converted Linear color
 */
fn srgbToLinearVec4(srgbColor: vec4<f32>) -> vec4<f32> {
    return vec4<f32>(srgbToLinearVec3(srgbColor.rgb), srgbColor.a);
}
