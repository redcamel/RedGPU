/**
 * [KO] Linear 색 공간의 vec3 색상을 sRGB 색 공간으로 변환합니다.
 * [EN] Converts vec3 color from Linear color space to sRGB color space.
 */
fn linear_to_srgb_vec3(linearColor: vec3<f32>) -> vec3<f32> {
    return select(
        12.92 * linearColor,
        1.055 * pow(linearColor, vec3<f32>(1.0 / 2.4)) - 0.055,
        linearColor > vec3<f32>(0.0031308)
    );
}
