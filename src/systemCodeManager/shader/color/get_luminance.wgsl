// [KO] RGB 색상의 휘도(Luminance)를 계산합니다. (Rec. 709)
// [EN] Calculates the luminance of an RGB color. (Rec. 709)
fn get_luminance(rgb: vec3<f32>) -> f32 {
    return dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
}
