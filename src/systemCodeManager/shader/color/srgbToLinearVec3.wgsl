/**
 * [KO] sRGB 색 공간의 vec3 색상을 Linear 색 공간으로 변환합니다.
 * [EN] Converts vec3 color from sRGB color space to Linear color space.
 *
 * @param srgbColor [KO] 입력 sRGB 색상 [EN] Input sRGB color
 * @returns [KO] 변환된 Linear 색상 [EN] Converted Linear color
 */
fn srgbToLinearVec3(srgbColor: vec3<f32>) -> vec3<f32> {
    return select(
        srgbColor / 12.92,
        pow((srgbColor + 0.055) / 1.055, vec3<f32>(2.4)),
        srgbColor > vec3<f32>(0.04045)
    );
}
